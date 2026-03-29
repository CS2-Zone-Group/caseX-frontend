import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "CaseX — CS2 Skins Marketplace",
    short_name: "CaseX",
    description: "O'zbekistondagi birinchi CS2 skin marketplace",
    start_url: "/",
    display: "standalone",
    background_color: "#0f172a",
    theme_color: "#06b6d4",
    icons: [
      { src: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
      { src: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
