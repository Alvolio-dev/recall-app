import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Frequently asked questions about Recall — AI-powered YouTube summaries.",
  openGraph: {
    title: "FAQ | Recall",
    description:
      "Frequently asked questions about Recall — AI-powered YouTube summaries.",
  },
};

export default function FaqLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
