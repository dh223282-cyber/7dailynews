
import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { AppProviders } from "@/components/AppProviders";

const outfit = Outfit({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "7DailyNews | Premium Global News",
  description: "Breaking news, in-depth analysis and localized updates.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${outfit.className} antialiased bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 transition-colors duration-300 min-h-screen flex flex-col selection:bg-rose-500 selection:text-white`}>
        <AppProviders>
          {children}
        </AppProviders>
      </body>
    </html>
  );
}
