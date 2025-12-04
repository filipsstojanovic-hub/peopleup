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

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#3B82F6',
};

export const metadata: Metadata = {
  metadataBase: new URL('https://peopleup.ch'),
  title: "PeopleUp - Swiss-Standard Recruitment Excellence | Executive Search & Talent Placement",
  description: "Premium recruitment agency in Switzerland. 7-21 day placements, 95% retention rate. Specializing in Tech & Finance executive search. Find your next hire with PeopleUp.",
  keywords: ["recruitment Switzerland", "executive search", "tech recruitment", "finance recruitment", "Swiss recruitment", "talent placement", "headhunting Switzerland", "PeopleUp"],
  authors: [{ name: "PeopleUp" }],
  creator: "PeopleUp",
  publisher: "PeopleUp",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_CH",
    url: "https://peopleup.ch",
    siteName: "PeopleUp",
    title: "PeopleUp - Swiss-Standard Recruitment Excellence",
    description: "Premium recruitment in Switzerland. 7-21 day placements, 95% retention. Executive search for Tech & Finance.",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "PeopleUp - Swiss Recruitment Excellence",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PeopleUp - Swiss Recruitment Excellence",
    description: "7-21 day placements, 95% retention. Premium executive search for Tech & Finance in Switzerland.",
    images: ["/images/twitter-image.jpg"],
    creator: "@peopleup",
  },
  alternates: {
    canonical: "https://peopleup.ch",
  },
  category: "business",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
