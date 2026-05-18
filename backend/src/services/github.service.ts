import { prisma } from "../lib/prisma";
import fs from "fs";

async function getApp() {
  const { App } = await import("@octokit/app");
  const privateKey = fs.readFileSync(
    process.env.GITHUB_APP_PRIVATE_KEY_PATH!,
    "utf-8"
  );
  return new App({
    appId: process.env.GITHUB_APP_ID!,
    privateKey,
    oauth: {
      clientId: process.env.GITHUB_APP_CLIENT_ID!,
      clientSecret: process.env.GITHUB_APP_CLIENT_SECRET!,
    },
  });
}

function parseRepo(repositoryUrl: string) {
  const match = repositoryUrl.match(/github\.com\/([^/]+)\/([^/]+?)(?:\.git)?$/);
  if (!match) throw new Error("INVALID_REPO_URL");
  return { owner: match[1], repo: match[2] };
}

export function getGithubAuthUrl(userId: number) {
  const state = Buffer.from(JSON.stringify({ userId })).toString("base64");
  return `https://github.com/apps/${process.env.GITHUB_APP_NAME}/installations/new?state=${state}`;
}

export async function handleInstallationCallback(
  installationId: number,
  userId: number
) {
  await prisma.user.update({
    where: { id: userId },
    data: { githubToken: String(installationId) },
  });
  return installationId;
}

export async function getGithubConnectionStatus(userId: number) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { githubToken: true },
  });

  if (!user?.githubToken) return { connected: false, username: null };

  try {
    const app = await getApp();
    const octokit = await app.getInstallationOctokit(Number(user.githubToken));
    const { data } = await octokit.request("GET /app");
    return { connected: true, username: data?.name || "GitHub", avatarUrl: null };
  } catch {
    return { connected: true, username: "GitHub", avatarUrl: null };
  }
}

export async function disconnectGithub(userId: number) {
  await prisma.user.update({
    where: { id: userId },
    data: { githubToken: null },
  });
}

export async function syncCommits(tfgId: number) {
  const tfg = await prisma.tfg.findUnique({
    where: { id: tfgId },
    include: {
      members: { include: { user: true } },
      sprints: true,
      tutor: true,
    },
  });

  if (!tfg) throw new Error("TFG_NOT_FOUND");
  if (!tfg.repositoryUrl) throw new Error("NO_REPO_URL");

  const { owner, repo } = parseRepo(tfg.repositoryUrl);

  const memberWithToken = tfg.members.find((m) => m.user.githubToken);
  const token = memberWithToken?.user.githubToken || tfg.tutor?.githubToken;

  if (!token) throw new Error("NO_GITHUB_TOKEN");

  const app = await getApp();
  const octokit = await app.getInstallationOctokit(Number(token));

  const { data: githubCommits } = await octokit.request(
    "GET /repos/{owner}/{repo}/commits",
    { owner, repo, per_page: 100 }
  );

  let synced = 0;
  let skipped = 0;

  for (const gc of githubCommits) {
    const existing = await prisma.commit.findUnique({
      where: { hash: gc.sha },
    });
    if (existing) { skipped++; continue; }

    const { data: detail } = await octokit.request(
      "GET /repos/{owner}/{repo}/commits/{ref}",
      { owner, repo, ref: gc.sha }
    );

    const commitDate = new Date(gc.commit.author?.date || Date.now());

    const matchingSprint = tfg.sprints.find((s) => {
      if (!s.startDate || !s.endDate) return false;
      return commitDate >= new Date(s.startDate) && commitDate <= new Date(s.endDate);
    });

    const commitEmail = gc.commit.author?.email?.toLowerCase();
    const matchingMember = tfg.members.find(
      (m) => m.user.email.toLowerCase() === commitEmail
    );

    const sprintId = matchingSprint?.id ?? tfg.sprints[0]?.id;
    const studentId = matchingMember?.userId ?? tfg.members[0]?.userId ?? tfg.tutorId;

    await prisma.commit.create({
      data: {
        hash: gc.sha,
        message: gc.commit.message,
        linesAdded: detail.stats?.additions || 0,
        linesDeleted: detail.stats?.deletions || 0,
        filesChanged: detail.files?.length || 0,
        date: commitDate,
        tfgId,
        studentId,
        ...(sprintId ? { sprintId } : {}),
      } as any,
    });

    synced++;
  }

  return { synced, skipped, total: githubCommits.length };
}

export async function getCommitsByTfg(tfgId: number) {
  return prisma.commit.findMany({
    where: { tfgId },
    include: {
      student: { select: { id: true, name: true, email: true } },
      sprint: { select: { id: true, name: true } },
      task: { select: { id: true, title: true } },
    },
    orderBy: { date: "desc" },
  });
}

export async function getCommitsBySprint(sprintId: number) {
  return prisma.commit.findMany({
    where: { sprintId },
    include: {
      student: { select: { id: true, name: true, email: true } },
      task: { select: { id: true, title: true } },
    },
    orderBy: { date: "desc" },
  });
}