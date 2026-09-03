import { prisma } from "../lib/prisma";
import crypto from "crypto";
import { isMemberOrTutor } from "../repositories/tfg.repository";

// async function getApp() {
//   const { App } = await import("@octokit/app");
//   const privateKey = fs.readFileSync(
//     process.env.GITHUB_APP_PRIVATE_KEY_PATH!,
//     "utf-8"
//   );
//   return new App({
//     appId: process.env.GITHUB_APP_ID!,
//     privateKey,
//     oauth: {
//       clientId: process.env.GITHUB_APP_CLIENT_ID!,
//       clientSecret: process.env.GITHUB_APP_CLIENT_SECRET!,
//     },
//   });
// }

async function getApp() {
  const { App } = await import("@octokit/app");
  
  let privateKey: string;
  
  if (process.env.GITHUB_PRIVATE_KEY) {
    privateKey = process.env.GITHUB_PRIVATE_KEY.replace(/\\n/g, "\n");
  } else {
    const fs = await import("fs");
    privateKey = fs.readFileSync(process.env.GITHUB_APP_PRIVATE_KEY_PATH!, "utf-8");
  }
  
  return new App({
    appId: process.env.GITHUB_APP_ID!,
    privateKey,
    oauth: {
      clientId: process.env.GITHUB_APP_CLIENT_ID!,
      clientSecret: process.env.GITHUB_APP_CLIENT_SECRET!,
    },
  });
}


export async function getGithubOAuthUrl(state: string): Promise<string> {
  const app = await getApp();
  const { url } = app.oauth.getWebFlowAuthorizationUrl({ state });
  return url;
}

export async function resolveGithubUserEmail(code: string): Promise<string | null> {
  const app = await getApp();
  const { authentication } = await app.oauth.createToken({ code });

  const { Octokit } = await import("@octokit/rest");
  const octokit = new Octokit({ auth: authentication.token });

  try {
    const { data: emails } = await octokit.request("GET /user/emails");
    const primary = emails.find((e: any) => e.primary && e.verified);
    if (primary) return primary.email.toLowerCase();
  } catch {
    // The App may not have the "Email addresses" account permission granted — fall back below.
  }

  const { data: user } = await octokit.request("GET /user");
  return user.email ? user.email.toLowerCase() : null;
}

function parseRepo(repositoryUrl: string) {
  const match = repositoryUrl.match(/github\.com\/([^/]+)\/([^/]+?)(?:\.git)?$/);
  if (!match) throw new Error("INVALID_REPO_URL");
  return { owner: match[1], repo: match[2] };
}

export function getGithubAuthUrl(userId: number): string {
  const payload = JSON.stringify({ userId, ts: Date.now() });
  const sig = crypto.createHmac("sha256", process.env.JWT_SECRET!).update(payload).digest("hex");
  const state = Buffer.from(JSON.stringify({ payload, sig })).toString("base64url");
  return `https://github.com/apps/${process.env.GITHUB_APP_NAME}/installations/new?state=${state}`;
}

export function verifyGithubState(rawState: string): { userId: number } {
  let parsed: { payload: string; sig: string };
  try {
    parsed = JSON.parse(Buffer.from(rawState, "base64url").toString());
  } catch {
    throw new Error("INVALID_STATE");
  }
  const expected = crypto.createHmac("sha256", process.env.JWT_SECRET!).update(parsed.payload).digest("hex");
  const sigBuf = Buffer.from(parsed.sig, "hex");
  const expBuf = Buffer.from(expected, "hex");
  if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
    throw new Error("INVALID_STATE");
  }
  return JSON.parse(parsed.payload);
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

export async function getCommitsByTfg(tfgId: number, requesterId: number, requesterRole: string) {
  if (requesterRole !== "admin" && requesterRole !== "coordinator") {
    const ok = await isMemberOrTutor(tfgId, requesterId);
    if (!ok) throw new Error("FORBIDDEN");
  }
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

export async function getCommitsBySprint(sprintId: number, tfgId: number, requesterId: number, requesterRole: string) {
  if (requesterRole !== "admin" && requesterRole !== "coordinator") {
    const ok = await isMemberOrTutor(tfgId, requesterId);
    if (!ok) throw new Error("FORBIDDEN");
  }
  return prisma.commit.findMany({
    where: { sprintId },
    include: {
      student: { select: { id: true, name: true, email: true } },
      task: { select: { id: true, title: true } },
    },
    orderBy: { date: "desc" },
  });
}