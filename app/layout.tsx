import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "WhizzyX | Engineering Roadmap & Startup Systems",
  description: "WhizzyX is a personal initiative focused on identifying and solving real-world inefficiencies through technical innovation and non-linear thinking.",
  verification: {
    google: "UN3euhiT2j7M_xtDRxuFbIAzjFlFVhgcW-wTbU6zZZk",
  },
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
