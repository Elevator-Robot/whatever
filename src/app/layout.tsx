import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "EDC System - Electronic Data Capture",
  description: "Electronic Data Capture system for forms and data management with PWA capabilities",
  manifest: "/manifest.json",
  keywords: ["EDC", "Electronic Data Capture", "Forms", "Data Management", "PWA"],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#4F46E5",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#4F46E5" />
      </head>
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
