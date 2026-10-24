
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://syraedutech.in"),

  title: "Syra EduTech | Data Analytics, Data Science & Full Stack Training",

  description:
    "Learn Data Analytics, Data Science and Full Stack Development with Syra EduTech. Explore practical training, hands-on projects, interview preparation and technology programs for students and institutions.",

  applicationName: "Syra EduTech",

  alternates: {
    canonical: "/",
  },

  openGraph: {
    title: "Syra EduTech | Career-Focused Technology Training",
    description:
      "Build practical technology skills with Syra EduTech through hands-on courses, projects and career preparation.",
    url: "https://syraedutech.in/",
    siteName: "Syra EduTech",
    locale: "en_IN",
    type: "website",
  },

  robots: {
    index: true,
    follow: true,
  },

  other: {
    "codex-preview": "development",
  },

  icons: {
    icon: { url: "/syra-mark.svg", type: "image/svg+xml" },
    shortcut: "/syra-mark.svg",
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