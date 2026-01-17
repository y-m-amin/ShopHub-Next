import { AuthProvider } from '@/components/auth/AuthProvider';
import NextAuthProvider from '@/components/auth/NextAuthProvider';
import { ClientLayout } from '@/components/client-layout';
import ErrorBoundary from '@/components/error-boundary';
import { Footer } from '@/components/navigation/Footer';
import { Navbar } from '@/components/navigation/Navbar';
import { ThemeProvider } from '@/components/theme-provider';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata = {
  title: 'ShopHub - Modern E-Commerce Platform',
  description:
    'A modern e-commerce platform built with Next.js, featuring authentication, product browsing, and item management capabilities.',
};

export default function RootLayout({ children }) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ErrorBoundary>
          <ThemeProvider
            attribute='class'
            defaultTheme='system'
            enableSystem
            disableTransitionOnChange
          >
            <NextAuthProvider>
              <AuthProvider>
                <ClientLayout>
                  <div className='flex flex-col min-h-screen'>
                    <Navbar />
                    <main className='flex-1'>{children}</main>
                    <Footer />
                  </div>
                </ClientLayout>
              </AuthProvider>
            </NextAuthProvider>
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
