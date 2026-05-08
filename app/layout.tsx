import type { Metadata } from "next";
import "./globals.css";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Whizzyx — Engineering Innovation & Startup Systems",
  description:
    "Whizzyx is a personal innovation lab solving real-world inefficiencies through technical engineering. Explore Whizzyx projects, roadmaps, and systems.",
  keywords: ["Whizzyx", "WhizzyX", "engineering projects", "startup systems", "technical innovation", "Manas WhizzyX"],
  authors: [{ name: "Whizzyx" }],
  creator: "Whizzyx",
  metadataBase: new URL("https://whizzyx.vercel.app"),
  alternates: {
    canonical: "https://whizzyx.vercel.app",
  },
  openGraph: {
    title: "Whizzyx — Engineering Innovation & Startup Systems",
    description:
      "Whizzyx is a personal innovation lab solving real-world inefficiencies through technical engineering. Explore Whizzyx projects, roadmaps, and systems.",
    url: "https://whizzyx.vercel.app",
    siteName: "Whizzyx",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Whizzyx — Engineering Innovation & Startup Systems",
    description:
      "Whizzyx is a personal innovation lab solving real-world inefficiencies through technical engineering.",
    creator: "@whizzyx",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "UN3euhiT2j7M_xtDRxuFbIAzjFlFVhgcW-wTbU6zZZk",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://whizzyx.vercel.app/#organization",
      name: "Whizzyx",
      url: "https://whizzyx.vercel.app",
      logo: {
        "@type": "ImageObject",
        url: "https://whizzyx.vercel.app/logo.png",
      },
      description:
        "Whizzyx is a personal innovation lab solving real-world inefficiencies through technical engineering and non-linear thinking.",
      sameAs: [],
    },
    {
      "@type": "WebSite",
      "@id": "https://whizzyx.vercel.app/#website",
      url: "https://whizzyx.vercel.app",
      name: "Whizzyx",
      description:
        "Explore Whizzyx — projects, roadmaps, engineering systems, and startup innovation.",
      publisher: {
        "@id": "https://whizzyx.vercel.app/#organization",
      },
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: "https://whizzyx.vercel.app/?q={search_term_string}",
        },
        "query-input": "required name=search_term_string",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
        <Script
          id="json-ld-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
