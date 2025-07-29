import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Produtos Selecionados",
  description:
    "Descubra nossa curadoria de produtos selecionados para bem-estar e prazer. Qualidade, discrição e entrega rápida garantidas.",
  keywords: [
    "produtos",
    "bem-estar",
    "prazer",
    "qualidade",
    "entrega rápida",
    "discrição",
  ],
  openGraph: {
    title: "Produtos Selecionados | Manifeste",
    description:
      "Descubra nossa curadoria de produtos selecionados para bem-estar e prazer.",
    url: "https://manifestecg.com.br/produtos",
    type: "website",
    locale: "pt_BR",
    siteName: "Manifeste",
  },
  alternates: {
    canonical: "/produtos",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ProdutosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
