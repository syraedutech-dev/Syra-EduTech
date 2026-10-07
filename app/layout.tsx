import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Syra — Build skills. Build careers.",
  description: "Premium, practical technology training for the people and teams shaping what comes next.",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
