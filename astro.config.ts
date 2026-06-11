import { defineConfig, envField, fontProviders } from "astro/config";
import type { AstroIntegration } from "astro";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";
import mdx from "@astrojs/mdx";
import remarkToc from "remark-toc";
import remarkCollapse from "remark-collapse";
import {
  transformerNotationDiff,
  transformerNotationHighlight,
  transformerNotationWordHighlight,
} from "@shikijs/transformers";
import { transformerFileName } from "./src/utils/transformers/fileName";
import { SITE } from "./src/config";
import { buildNavigation } from "./src/utils/content/buildNavigation";

/**
 * Custom Astro integration that generates navigation.json at build time.
 * Hooks into astro:build:done to run after all pages are built.
 * Requirements: 8.1, 10.1
 */
function navigationBuilderIntegration(): AstroIntegration {
  return {
    name: "navigation-builder",
    hooks: {
      "astro:build:done": async ({ dir }) => {
        try {
          const outputPath = new URL("navigation.json", dir).pathname;
          await buildNavigation({
            docsPath: "src/data/docs",
            outputPath,
            useCache: false, // Always regenerate on full build
          });
          console.log("[navigation-builder] navigation.json generated.");
        } catch (error) {
          console.error("[navigation-builder] Failed to generate navigation:", error);
        }
      },
    },
  };
}

// https://astro.build/config
export default defineConfig({
  site: SITE.website,
  integrations: [
    mdx(),
    sitemap({
      filter: page => SITE.showArchives || !page.endsWith("/archives"),
    }),
    navigationBuilderIntegration(),
  ],
  markdown: {
    remarkPlugins: [remarkToc, [remarkCollapse, { test: "Table of contents" }]],
    shikiConfig: {
      // For more themes, visit https://shiki.style/themes
      themes: { light: "min-light", dark: "night-owl" },
      defaultColor: false,
      wrap: false,
      transformers: [
        transformerFileName({ style: "v2", hideDot: false }),
        transformerNotationHighlight(),
        transformerNotationWordHighlight(),
        transformerNotationDiff({ matchAlgorithm: "v3" }),
      ],
    },
  },
  vite: {
    // eslint-disable-next-line
    // @ts-ignore
    // This will be fixed in Astro 6 with Vite 7 support
    // See: https://github.com/withastro/astro/issues/14030
    plugins: [tailwindcss()],
    optimizeDeps: {
      exclude: ["@resvg/resvg-js"],
    },
  },
  image: {
    responsiveStyles: true,
    layout: "constrained",
  },
  env: {
    schema: {
      PUBLIC_GOOGLE_SITE_VERIFICATION: envField.string({
        access: "public",
        context: "client",
        optional: true,
      }),
    },
  },
  experimental: {
    preserveScriptOrder: true,
    fonts: [
      {
        name: "Space Grotesk",
        cssVariable: "--font-space-grotesk",
        provider: fontProviders.google(),
        fallbacks: ["sans-serif"],
        weights: [300, 400, 500, 600, 700],
        styles: ["normal"],
      },
    ],
  },
});
