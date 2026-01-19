import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login to Your Account",
  description: "Sign in to your Nexus Marketplace account to access your dashboard, manage listings, track orders, and enjoy personalized shopping experience.",
  robots: {
    index: false,
    follow: true,
  },
  openGraph: {
    title: "Login to Your Account | Nexus Marketplace",
    description: "Sign in to your Nexus Marketplace account to access your dashboard, manage listings, track orders, and enjoy personalized shopping experience.",
    type: "website",
  },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}