import type { Metadata } from "next";

import LayoutWrapper from "@/components/template/layout-wrapper";
import "@/styles/globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://xylkit.vercel.app/"),
  title: "Xylkit",
  icons: "/xylkit-logo-box.png",
  description: "",
  openGraph: {
    images: "xylkit-og.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <LayoutWrapper>{children}</LayoutWrapper>;
}
