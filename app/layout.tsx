import type { Metadata } from "next";
import { Bebas_Neue, Montserrat, Inter } from "next/font/google";
import "./globals.css";
import { CMSProvider } from "@/components/cms/CMSContext";
import { CMSBar } from "@/components/cms/CMSBar";

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-montserrat",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Trash It Bros | Construction Site Clean-Ups & Rubbish Removal",
  description:
    "Fast, reliable rubbish removal and construction site clean-ups across the Sunshine Coast, QLD. You build it, we take it.",
  icons: {
    icon: "/brand/logo-icon.jpg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${bebasNeue.variable} ${montserrat.variable} ${inter.variable}`}
    >
      <body className="bg-charcoal text-white font-inter antialiased min-h-screen flex flex-col">
        <CMSProvider>
          <CMSBar />
          {children}
        </CMSProvider>
      </body>
    </html>
  );
}
