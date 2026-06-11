# Nextra-Style Content Management System

A documentation system for AstroPaper that automatically generates navigation from your folder structure, inspired by [Nextra](https://nextra.site/).

## Features

- **Automatic navigation** from directory structure
- **Frontmatter metadata** for titles, ordering, and visibility
- **`_meta.json` configuration** for per-directory customization
- **Pagefind search** integration (existing infrastructure)
- **i18n support** via language-code subdirectories
- **Responsive sidebar** with mobile hamburger menu
- **Build-time generation** with caching

## Quick Start

### 1. Add content

Create `.md` or `.mdx` files in `src/data/docs/`:

```
src/data/docs/
├── getting-started.md
└── guides/
    ├── installation.md
    └── configuration.md
```

### 2. Add frontmatter

```yaml
---
title: "My Page"
description: "Page description"
order: 1
---
```

### 3. Use the Sidebar component

```astro
---
import Sidebar from "@/components/Sidebar.astro";
import { buildNavigation } from "@/utils/content/buildNavigation";

const navData = await buildNavigation({ docsPath: "src/data/docs" });
const navigationTree = {
  root: navData.root,
  byPath: new Map(navData.byPath),
};
---

<div class="flex">
  <Sidebar navigationTree={navigationTree} currentPath={Astro.url.pathname} />
  <main>
    <slot />
  </main>
</div>
```

## Frontmatter Fields

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `title` | `string` | filename | Navigation display title |
| `description` | `string` | — | Page description |
| `order` | `number` | — | Sort order (lower = first) |
| `hidden` | `boolean` | `false` | Hide from navigation |
| `icon` | `string` | — | Emoji or icon |
| `translations` | `Record<string, string>` | — | Locale → title |

## `_meta.json` Configuration

Place a `_meta.json` file in any directory to customize that section:

```json
{
  "title": "Section Title",
  "order": {
    "page-one.md": 1,
    "page-two.md": 2,
    "subfolder": 3
  },
  "hidden": ["draft.md"],
  "translations": {
    "page-one.md": {
      "en": "Page One",
      "vi": "Trang Một"
    }
  }
}
```

### Fields

- **`title`** — Override the directory display name in navigation
- **`order`** — Map of filename → order number for custom sorting
- **`hidden`** — Array of filenames to exclude from navigation
- **`translations`** — Per-file locale translations for navigation titles

## i18n Setup

Organize content by language code:

```
src/data/docs/
├── en/
│   ├── getting-started.md
│   └── guides/
└── vi/
    ├── getting-started.md
    └── guides/
```

Then filter by locale in your layout:

```astro
<Sidebar
  navigationTree={navigationTree}
  currentPath={Astro.url.pathname}
  locale="vi"
/>
```

## Ignoring Files

Files and directories are automatically ignored if they:
- Start with `_` (e.g., `_draft.md`, `_meta.json`)
- Start with `.` (e.g., `.gitkeep`, `.DS_Store`)

## Migration from Flat Blog Structure

The docs system works **alongside** the existing blog. Your existing `src/data/blog/` posts are unaffected.

To migrate flat blog posts to the docs system:

1. Move files from `src/data/blog/` to `src/data/docs/`
2. Add `order` and optionally `hidden` fields to frontmatter
3. Create `_meta.json` files for directory-level configuration
4. Update any internal links to use the new paths

## Build Integration

Navigation is generated automatically during `astro build` via the `navigation-builder` integration in `astro.config.ts`. The output is written to `dist/navigation.json`.

For development, call `buildNavigation()` directly in your page components.

## Architecture

```
src/utils/content/
├── directoryScanner.ts    # Scans file system for .md/.mdx files
├── metadataParser.ts      # Parses frontmatter and _meta.json
├── navigationGenerator.ts # Builds NavigationTree from FileNodes
├── errorCollector.ts      # Collects and reports build errors
└── buildNavigation.ts     # Orchestrates the full build pipeline

src/components/
├── Sidebar.astro          # Sidebar navigation component
└── NavigationItem.astro   # Individual navigation item (recursive)

src/types/
└── navigation.ts          # TypeScript interfaces
```
