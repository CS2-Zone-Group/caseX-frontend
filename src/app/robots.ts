import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/admin/*",
          "/profile",
          "/profile/*",
          "/cart",
          "/checkout",
          "/checkout/*",
          "/inventory",
          "/transactions",
          "/targets",
          "/on-sale",
          "/favorites",
          "/auth/callback",
          "/auth/verify-email",
          "/auth/set-password",
          "/auth/phone",
        ],
      },
    ],
    sitemap: "https://casex.uz/sitemap.xml",
  };
}
