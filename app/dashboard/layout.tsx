import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Your Dashboard",
  description: "Manage your Nexus Marketplace account, view your orders, track wishlist items, and access seller tools from your personalized dashboard.",
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: "Your Dashboard | Nexus Marketplace",
    description: "Manage your Nexus Marketplace account, view your orders, track wishlist items, and access seller tools from your personalized dashboard.",
    type: "website",
  },
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}