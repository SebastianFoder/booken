import type { Metadata } from "next";
import "./globals.css";
import Header from "./header";
import Background from "@/components/background";

export const metadata: Metadata = {
  title: 'Booken',
  description: 'A Neurodivergent Dictionary for Knowledge Discovery',
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/android-chrome-192x192.png', sizes: '192x192' },
      { url: '/android-chrome-512x512.png', sizes: '512x512' },
      { url: '/apple-touch-icon-57x57.png', sizes: '57x57' },
      { url: '/apple-touch-icon-60x60.png', sizes: '60x60' },
      { url: '/apple-touch-icon-72x72.png', sizes: '72x72' },
      { url: '/apple-touch-icon-76x76.png', sizes: '76x76' },
      { url: '/apple-touch-icon-114x114.png', sizes: '114x114' },
      { url: '/apple-touch-icon-120x120.png', sizes: '120x120' },
      { url: '/apple-touch-icon-144x144.png', sizes: '144x144' },
      { url: '/apple-touch-icon-152x152.png', sizes: '152x152' },
      { url: '/apple-touch-icon-180x180.png', sizes: '180x180' },
    ],
    shortcut: '/favicon-16x16.png',
    apple: [
      { url: '/apple-touch-icon.png' },
    ],
    other: [
      { rel: 'apple-touch-icon-precomposed', url: '/apple-touch-icon-precomposed.png' },
    ],
  },
  openGraph: {
    title: 'Booken',
    description: 'A Neurodivergent Dictionary for Knowledge Discovery',
    url: process.env.NEXT_PUBLIC_URL,
    siteName: 'Booken',
    images: [
      {
        url: '/og-image.png',
        width: 800,
        height: 600,
        alt: 'Booken A Neurodivergent Dictionary for Knowledge Discovery',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Booken',
    description: 'A Neurodivergent Dictionary for Knowledge Discovery',
    images: [
      `${process.env.NEXT_PUBLIC_URL}/og-image.png`,
    ],
  },
  manifest: '/site.webmanifest',
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Header />
        {children}
        <Background />
      </body>
    </html>
  );
}
