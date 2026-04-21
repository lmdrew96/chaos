import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ChaosLengua",
    short_name: "ChaosLengua",
    description:
      "AI-powered Spanish language learning through productive confusion and structured chaos",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    theme_color: "#E76F51",
    background_color: "#E76F51",
    categories: ["education", "productivity"],
    icons: [
      {
        src: "/pwa-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/pwa-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  }
}
