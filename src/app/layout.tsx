import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MoonTzu | Multi-Tenant Scheduling Platform",
  description: "Enterprise-grade white-labeled booking system with subdomain routing, Stripe Connect integration, and robust data isolation.",
  keywords: ["SaaS", "Booking", "Scheduling", "Multi-Tenant", "Stripe Connect", "Next.js"],
  authors: [{ name: "MoonTzu Team" }],
  openGraph: {
    title: "MoonTzu | Multi-Tenant Scheduling Platform",
    description: "The ultimate white-labeled booking engine for modern businesses.",
    type: "website",
    locale: "en_US",
    url: "https://moontzu.example.com",
    siteName: "MoonTzu",
  },
  twitter: {
    card: "summary_large_image",
    title: "MoonTzu | Multi-Tenant Scheduling Platform",
    description: "Enterprise-grade booking engine with robust data isolation.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
