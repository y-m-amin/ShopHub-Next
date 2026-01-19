
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Providers } from "../components/Providers";
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Nexus Marketplace - Premium Tech Hardware Store",
    template: "%s | Nexus Marketplace"
  },
  description: "Discover premium tech hardware at Nexus Marketplace. Shop laptops, smartphones, audio gear, smart home devices and more from verified sellers. Fast shipping, secure payments.",
  keywords: [
    "tech marketplace",
    "electronics store",
    "premium hardware",
    "laptops",
    "smartphones", 
    "audio equipment",
    "smart home",
    "gaming gear",
    "verified sellers",
    "tech deals"
  ],
  authors: [{ name: "Nexus Marketplace" }],
  creator: "Nexus Marketplace",
  publisher: "Nexus Marketplace",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://nexus-techhub.vercel.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://nexus-techhub.vercel.app",
    title: "Nexus Marketplace - Premium Tech Hardware Store",
    description: "Discover premium tech hardware at Nexus Marketplace. Shop laptops, smartphones, audio gear, smart home devices and more from verified sellers.",
    siteName: "Nexus Marketplace",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Nexus Marketplace - Premium Tech Hardware",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nexus Marketplace - Premium Tech Hardware Store",
    description: "Discover premium tech hardware at Nexus Marketplace. Shop laptops, smartphones, audio gear, smart home devices and more from verified sellers.",
    images: ["/og-image.jpg"],
    creator: "@nexusmarketplace",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
    yahoo: "your-yahoo-verification-code",
  },
  category: "technology",
  classification: "Business",
  icons: {
    icon: [
      {
        url: "/favicon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-touch-icon.png",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Nexus Marketplace",
    "description": "Premium tech hardware marketplace with verified sellers",
    "url": "https://nexus-techhub.vercel.app",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://nexus-techhub.vercel.app/items?search={search_term_string}",
      "query-input": "required name=search_term_string"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Nexus Marketplace",
      "url": "https://nexus-techhub.vercel.app",
      "logo": {
        "@type": "ImageObject",
        "url": "https://nexus-techhub.vercel.app/favicon.svg"
      }
    }
  };

  return (
    <html lang="en" className="antialiased">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#6366f1" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className={`${inter.className} min-h-screen flex flex-col bg-white dark:bg-zinc-950 transition-colors`}>
        <Providers>
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: 'var(--toast-bg)',
                color: 'var(--toast-color)',
                border: '1px solid var(--toast-border)',
              },
              success: {
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#ffffff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#ffffff',
                },
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
