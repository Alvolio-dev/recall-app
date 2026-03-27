import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Support",
  description:
    "Get help with Recall. We typically respond within 24 hours.",
  openGraph: {
    title: "Support | Recall",
    description:
      "Get help with Recall. We typically respond within 24 hours.",
  },
};

export default function SupportLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
