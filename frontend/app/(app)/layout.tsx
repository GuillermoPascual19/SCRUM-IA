"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import Sidebar from "@/components/layout/Sidebar";
import { motion } from "framer-motion";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isAuthenticated) {
      router.push("/login");
    }
  }, [mounted, isAuthenticated, router]);

  if (!mounted) return null;
  if (!isAuthenticated) return null;

  return (
    <div className="flex h-screen bg-[var(--background)] relative overflow-hidden">
      <div
        className="absolute bottom-0 right-0 w-[600px] h-[600px] rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{ background: "var(--primary)" }}
      />
      <div
        className="absolute top-0 left-0 w-[400px] h-[400px] rounded-full opacity-5 blur-3xl pointer-events-none"
        style={{ background: "var(--primary)" }}
      />
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}
