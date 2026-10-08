import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Sitio 100% estático: `next build` genera ./out, que Cloudflare Workers sirve como archivos.
  output: "export",

  // URLs sin barra final (/bodas → out/bodas.html), igual que los canonical y que
  // `html_handling: "drop-trailing-slash"` en wrangler.jsonc.
  trailingSlash: false,

  // Sin optimizador de Next (necesita servidor): las fotos se procesan al compilar
  // con el pipeline propio (scripts/imagenes) y se sirven ya en WebP.
  images: { unoptimized: true },

  // Tailwind v4 vía Turbopack (configuración generada por create-next-app 16.4).
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
