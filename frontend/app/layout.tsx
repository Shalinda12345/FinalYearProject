import type { Metadata } from "next";
import { Playfair_Display, Manrope } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const display = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
});

const body = Manrope({
  variable: "--font-body",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Heshan Products | Smart Business Management",
  description:
    "Smart Business Management and Sales Forecasting System for food production SMEs.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${display.variable} ${body.variable} antialiased font-[var(--font-body)] bg-slate-50 text-slate-900`}
      >
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
