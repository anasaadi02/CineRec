import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/hooks/useAuth";
import { TrailerProvider } from "@/contexts/TrailerContext";
import { SearchProvider } from "@/contexts/SearchContext";
import { HydrationSuppressor } from "@/components/HydrationSuppressor";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CineRec",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <HydrationSuppressor />
        <AuthProvider>
          <TrailerProvider>
            <SearchProvider>
              {children}
            </SearchProvider>
          </TrailerProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
