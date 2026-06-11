import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";
import { SITE } from "@/config";

export const BLOG_PATH = "src/data/blog";

const blog = defineCollection({
  loader: glob({ pattern: "**/[^_]*.md", base: `./${BLOG_PATH}` }),
  schema: ({ image }) =>
    z.object({
      author: z.string().default(SITE.author),
      pubDatetime: z.date(),
      modDatetime: z.date().optional().nullable(),
      title: z.string(),
      featured: z.boolean().optional(),
      draft: z.boolean().optional(),
      tags: z.array(z.string()).default(["others"]),
      ogImage: image().or(z.string()).optional(),
      description: z.string(),
      canonicalURL: z.string().optional(),
      hideEditPost: z.boolean().optional(),
      timezone: z.string().optional(),
    }),
});

// New docs collection for hierarchical content (Nextra-style)
// Requirements: 10.1, 10.3, 10.4, 10.5
export const DOCS_PATH = "src/data/docs";

const docs = defineCollection({
  loader: glob({
    pattern: "**/[^_]*.{md,mdx}",
    base: `./${DOCS_PATH}`,
  }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string().optional(),
      order: z.number().optional(),
      hidden: z.boolean().optional().default(false),
      icon: z.string().optional(),
      translations: z.record(z.string()).optional(),
      // Fields inherited from blog schema for compatibility (Requirement 10.4)
      author: z.string().optional(),
      pubDatetime: z.date().optional(),
      modDatetime: z.date().optional().nullable(),
      tags: z.array(z.string()).optional(),
      ogImage: image().or(z.string()).optional(),
    }),
});

export const collections = { blog, docs };
