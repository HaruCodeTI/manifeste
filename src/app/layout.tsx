import { Footer } from "@/components/Footer";
import { CartProvider } from "@/contexts/CartContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Manifeste - Produtos Selecionados",
  description:
    "Curadoria cuidadosa de produtos que transformam sua experiência diária",
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
        className={`${inter.variable} ${playfair.variable} antialiased`}
        style={{ fontFamily: "Inter, Helvetica Neue, Arial, sans-serif" }}
      >
        <ThemeProvider>
          <CartProvider>{children}</CartProvider>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
