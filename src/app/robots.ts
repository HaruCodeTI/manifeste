import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/", "/checkout/", "/sucesso/"],
      },
    ],
    sitemap: "https://manifestecg.com.br/sitemap.xml",
  };
}
