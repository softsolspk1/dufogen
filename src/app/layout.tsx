import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Footer from "@/components/layout/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DUFOGEN - The Cycle Balance Challenge",
  description: "Educational simulation for healthcare professionals.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <main className="flex-grow flex flex-col relative w-full mx-auto min-h-screen">
          {/* Mobile-first container: max-w-md centered */}
          <div className="flex-grow flex flex-col w-full">
            {children}
          </div>
          <Footer />
        </main>
      </body>
    </html>
  );
}
