import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Todo Categories",
  description: "Full-stack Todo with Categories"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
