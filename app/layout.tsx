import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { PatternFormProvider } from "@/lib/store";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Malina — Knitting Pattern Generator",
  description: "Generate custom knitting patterns in 4 simple steps",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        <PatternFormProvider>{children}</PatternFormProvider>
      </body>
    </html>
  );
}
