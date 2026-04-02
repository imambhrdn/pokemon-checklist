import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TCG Checklist Generator",
  description: "Generate print-ready Pokémon TCG checklists",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
