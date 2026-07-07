import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Archivo, Barlow, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const barlow = Barlow({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-barlow",
  display: "swap",
});

const archivo = Archivo({
  subsets: ["latin"],
  weight: "800",
  variable: "--font-archivo",
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-ibm-plex-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "PRELOAD Suspension Supply",
  description: "A near-live specialist storefront demo.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${barlow.variable} ${archivo.variable} ${ibmPlexMono.variable} bg-paper font-sans text-ink antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
