import { supabase } from "@/lib/supabaseClient";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const { data: product } = await supabase
    .from("products")
    .select("name, description")
    .eq("id", id)
    .single();

  if (!product) {
    return {
      title: "Produto não encontrado",
      description: "O produto solicitado não foi encontrado.",
    };
  }

  return {
    title: product.name,
    description:
      product.description ||
      `Descubra ${product.name} - qualidade e discrição garantidas.`,
    keywords: [product.name, "bem-estar", "prazer", "qualidade", "discrição"],
    openGraph: {
      title: `${product.name} | Manifeste`,
      description:
        product.description ||
        `Descubra ${product.name} - qualidade e discrição garantidas.`,
      url: `https://manifestecg.com.br/produto/${id}`,
      type: "website",
      locale: "pt_BR",
      siteName: "Manifeste",
    },
    alternates: {
      canonical: `/produto/${id}`,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default function ProdutoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
