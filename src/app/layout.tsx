import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Recall — Watch less. Remember more.",
    template: "%s | Recall",
  },
  description:
    "Paste any YouTube link and get a summary shaped around what you actually need.",
  metadataBase: new URL("https://getrecall.app"),
  openGraph: {
    type: "website",
    siteName: "Recall",
    title: "Recall — Watch less. Remember more.",
    description:
      "Paste any YouTube link and get a summary shaped around what you actually need.",
    url: "https://getrecall.app",
  },
  twitter: {
    card: "summary_large_image",
    title: "Recall — Watch less. Remember more.",
    description:
      "Paste any YouTube link and get a summary shaped around what you actually need.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#fafafa] text-[#09090b] overflow-x-hidden">
        <ClerkProvider>{children}</ClerkProvider>
      </body>
    </html>
  );
}
