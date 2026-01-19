import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop Premium Tech Hardware",
  description: "Browse our extensive collection of premium tech hardware including laptops, smartphones, audio equipment, smart home devices, and gaming gear from verified sellers.",
  keywords: [
    "tech products",
    "electronics shopping",
    "premium hardware",
    "verified sellers",
    "tech deals",
    "gadgets",
    "technology store"
  ],
  openGraph: {
    title: "Shop Premium Tech Hardware | Nexus Marketplace",
    description: "Browse our extensive collection of premium tech hardware including laptops, smartphones, audio equipment, smart home devices, and gaming gear from verified sellers.",
    type: "website",
  },
  twitter: {
    title: "Shop Premium Tech Hardware | Nexus Marketplace",
    description: "Browse our extensive collection of premium tech hardware including laptops, smartphones, audio equipment, smart home devices, and gaming gear from verified sellers.",
  },
};

export default function ItemsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}