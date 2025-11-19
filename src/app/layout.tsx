import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { Navigation } from "@/components/Navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NewsAvatars - News Through Every Perspective",
  description: "Experience news through the unique perspectives of AI avatars - from ancient philosophers to talking chairs, each offering their distinctive take on current events.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-100`}
      >
        <Providers>
          <Navigation />
          <main className="min-h-screen">
            {children}
          </main>
          <footer className="bg-slate-900 text-white py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <p className="text-slate-400">
                NewsAvatars - Where every story has infinite perspectives
              </p>
              <p className="text-sm text-slate-500 mt-2">
                Powered by AI Avatars
              </p>
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
