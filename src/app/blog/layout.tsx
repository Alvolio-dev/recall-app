import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Tips, research, and ideas on getting more from what you watch.",
  openGraph: {
    title: "Blog | Recall",
    description:
      "Tips, research, and ideas on getting more from what you watch.",
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
