import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dhaka Chronicles | The Gen-Z News Source",
  description: "Bold, Concise, and Edgy. Real-time news from the heart of Bangladesh.",
  icons: {
    icon: '/logomark 2.svg',
    apple: '/logomark 2.svg',
  }
};

export const runtime = 'edge';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-black selection:bg-brand-red selection:text-white">
        {children}
      </body>
    </html>
  );
}
