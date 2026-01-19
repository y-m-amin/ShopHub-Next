import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Your Account",
  description: "Join Nexus Marketplace today! Create your free account to start buying and selling premium tech hardware with verified sellers and secure transactions.",
  keywords: [
    "create account",
    "sign up",
    "register",
    "join marketplace",
    "tech marketplace registration",
    "seller account"
  ],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Create Your Account | Nexus Marketplace",
    description: "Join Nexus Marketplace today! Create your free account to start buying and selling premium tech hardware with verified sellers and secure transactions.",
    type: "website",
  },
  twitter: {
    title: "Create Your Account | Nexus Marketplace",
    description: "Join Nexus Marketplace today! Create your free account to start buying and selling premium tech hardware with verified sellers and secure transactions.",
  },
};

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}