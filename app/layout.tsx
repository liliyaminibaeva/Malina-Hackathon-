import type { Metadata } from "next";
import { Inter, Cormorant_Garamond, Source_Serif_4 } from "next/font/google";
import { PatternFormProvider } from "@/lib/store";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
});

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  weight: ["400", "600"],
  style: ["normal", "italic"],
  variable: "--font-source-serif",
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
      <body className={`${inter.variable} ${cormorant.variable} ${sourceSerif.variable} antialiased`}>
        <PatternFormProvider>{children}</PatternFormProvider>
      </body>
    </html>
  );
}
