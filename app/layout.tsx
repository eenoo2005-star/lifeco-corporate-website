import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LIFECO | Libyan Fertiliser Company",
  description: "LIFECO manufactures and supplies urea and ammonia from Al Brega, Libya, for local and international markets.",
  keywords: ["LIFECO", "Libyan Fertiliser Company", "urea", "ammonia", "fertiliser", "Al Brega", "Libya"],
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
