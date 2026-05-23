import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import ThemeProvider from "@/components/layout/ThemeProvider";
import { Toaster } from "@/components/ui/toaster";

const geist = Geist({ subsets: ["latin"] });

// export const metadata: Metadata = {
//   title: "SCRUM-IA",
//   description: "Plataforma académica de gestión de TFGs con metodología SCRUM",
// };

export const metadata: Metadata = {
  title: "SCRUM-IA",
  description: "Plataforma académica de gestión de TFGs con metodología SCRUM",
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={geist.className}>
        <Toaster />
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

