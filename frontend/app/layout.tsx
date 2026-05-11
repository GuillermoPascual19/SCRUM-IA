import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import ThemeProvider from "@/components/layout/ThemeProvider";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SCRUM-IA",
  description: "Plataforma académica de gestión de TFGs con metodología SCRUM",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={geist.className}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}