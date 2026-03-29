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
  title: "Poster Hunt",
  description: "Poster Hunt is an interactive public art installation combining screenprinted posters with a web-based camera experience. Each poster in the series features a QR code that invites passersby to pause, scan, and participate in a small act of joy, like taking a photo of themselves with a printed balloon.The project explores how designed moments of playfulness and presence can reintroduce joy into everyday life. It lives at the intersection of analog craft (screenprinting) and digital interaction, asking: what does it feel like to stop and play, even for a moment?",
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
