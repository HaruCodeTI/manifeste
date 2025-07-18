import { Footer } from "@/components/Footer";
import { StagewiseDevToolbar } from "@/components/StagewiseDevToolbar";
import { CartProvider } from "@/contexts/CartContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import "@fontsource/poppins/400.css";
import "@fontsource/poppins/700.css";
import type { Metadata } from "next";
import "./globals.css";

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
        className="antialiased"
        style={{ fontFamily: "Poppins, Arial, sans-serif" }}
      >
        <ThemeProvider>
          <CartProvider>{children}</CartProvider>
          <Footer />
          <StagewiseDevToolbar />
        </ThemeProvider>
      </body>
    </html>
  );
}
