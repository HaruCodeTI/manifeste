import { Footer } from "@/components/Footer";
import { StagewiseDevToolbar } from "@/components/StagewiseDevToolbar";
import { StructuredData } from "@/components/StructuredData";
import { CartProvider } from "@/contexts/CartContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import "@fontsource/poppins/400.css";
import "@fontsource/poppins/700.css";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Manifeste - Produtos Selecionados para Bem-estar e Prazer",
    template: "%s | Manifeste",
  },
  description:
    "Curadoria cuidadosa de produtos que transformam sua experiência diária. Encontre os melhores produtos para seu bem-estar e prazer com qualidade e discrição garantidas.",
  keywords: [
    "produtos selecionados",
    "bem-estar",
    "prazer",
    "qualidade",
    "discrição",
    "curadoria",
  ],
  authors: [{ name: "Manifeste" }],
  creator: "Manifeste",
  publisher: "Manifeste",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://manifestecg.com.br"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://manifestecg.com.br",
    title: "Manifeste - Produtos Selecionados para Bem-estar e Prazer",
    description:
      "Curadoria cuidadosa de produtos que transformam sua experiência diária. Encontre os melhores produtos para seu bem-estar e prazer.",
    siteName: "Manifeste",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Manifeste - Produtos Selecionados",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Manifeste - Produtos Selecionados para Bem-estar e Prazer",
    description:
      "Curadoria cuidadosa de produtos que transformam sua experiência diária.",
    images: ["/logo.png"],
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
    google: "google-site-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=G-JBYFQVJG82`}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-JBYFQVJG82');
            `,
          }}
        />
      </head>
      <body
        className="antialiased"
        style={{ fontFamily: "Poppins, Arial, sans-serif" }}
      >
        <StructuredData type="website" />
        <StructuredData type="organization" />
        <ThemeProvider>
          <CartProvider>{children}</CartProvider>
          <Footer />
          <StagewiseDevToolbar />
        </ThemeProvider>
      </body>
    </html>
  );
}
