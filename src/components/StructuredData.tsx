"use client";

import { Product } from "@/lib/supabaseClient";

interface StructuredDataProps {
  type: "website" | "product" | "organization";
  product?: Product;
}

export function StructuredData({ type, product }: StructuredDataProps) {
  const generateStructuredData = () => {
    switch (type) {
      case "website":
        return {
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "Manifeste",
          description:
            "Curadoria cuidadosa de produtos que transformam sua experiência diária",
          url: "https://manifestecg.com.br",
          potentialAction: {
            "@type": "SearchAction",
            target:
              "https://manifestecg.com.br/produtos?search={search_term_string}",
            "query-input": "required name=search_term_string",
          },
        };

      case "organization":
        return {
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Manifeste",
          description:
            "Curadoria cuidadosa de produtos para bem-estar e prazer",
          url: "https://manifestecg.com.br",
          logo: "https://manifestecg.com.br/logo.png",
          sameAs: [
            "https://instagram.com/manifeste.cg",
            "https://facebook.com/manifeste.cg",
          ],
          contactPoint: {
            "@type": "ContactPoint",
            contactType: "customer service",
            availableLanguage: "Portuguese",
          },
        };

      case "product":
        if (!product) return null;

        const mainVariant = product.variants?.[0];
        return {
          "@context": "https://schema.org",
          "@type": "Product",
          name: product.name,
          description: product.description,
          image: mainVariant?.image_urls?.[0]
            ? `https://manifestecg.com.br${mainVariant.image_urls[0]}`
            : undefined,
          offers: mainVariant
            ? {
                "@type": "Offer",
                price: mainVariant.price,
                priceCurrency: "BRL",
                availability:
                  mainVariant.stock_quantity > 0
                    ? "https://schema.org/InStock"
                    : "https://schema.org/OutOfStock",
                seller: {
                  "@type": "Organization",
                  name: "Manifeste",
                },
              }
            : undefined,
          brand: {
            "@type": "Brand",
            name: "Manifeste",
          },
        };

      default:
        return null;
    }
  };

  const structuredData = generateStructuredData();
  if (!structuredData) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData),
      }}
    />
  );
}
