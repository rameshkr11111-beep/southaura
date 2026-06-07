import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import "@/app/globals.css";
import { StoreProvider } from "@/components/store-provider";
import { SiteChrome } from "@/components/site-chrome";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap"
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  display: "swap",
  weight: ["400", "500", "600", "700"]
});

export const metadata: Metadata = {
  metadataBase: new URL("https://southaura.in"),
  title: {
    default: "southAura | Authentic South India, Delivered Everywhere",
    template: "%s | southAura"
  },
  description:
    "Discover premium South Indian food, handloom, wellness and home rituals, thoughtfully sourced and delivered across India and worldwide.",
  keywords: [
    "South Indian products online",
    "filter coffee",
    "South Indian snacks",
    "handloom sarees",
    "Ayurvedic products",
    "Indian gifts"
  ],
  openGraph: {
    title: "southAura | The South, beautifully sourced",
    description:
      "Authentic South Indian food, craft and rituals delivered everywhere.",
    type: "website",
    siteName: "southAura",
    url: "https://southaura.in"
  },
  twitter: {
    card: "summary_large_image",
    title: "southAura",
    description: "Authentic South India, Delivered Everywhere"
  },
  robots: {
    index: true,
    follow: true
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#17231d"
};

export default function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${manrope.variable} ${cormorant.variable}`}
    >
      <body>
        <StoreProvider>
          <SiteChrome>{children}</SiteChrome>
        </StoreProvider>
      </body>
    </html>
  );
}
