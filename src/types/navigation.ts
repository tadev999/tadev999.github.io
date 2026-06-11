/**
 * Type definitions for Nextra-style content management system
 */

/**
 * Represents a file or directory node in the content structure
 */
export interface FileNode {
  name: string;
  path: string;
  type: 'file' | 'directory';
  children?: FileNode[];
  metadata?: Metadata;
}

/**
 * Metadata extracted from frontmatter or _meta.json
 */
export interface Metadata {
  title?: string;
  description?: string;
  order?: number;
  hidden?: boolean;
  icon?: string;
  translations?: Record<string, string>; // locale -> translated title
}

/**
 * Configuration from _meta.json file
 */
export interface MetaConfig {
  title?: string;
  order?: Record<string, number>; // filename -> order
  hidden?: string[]; // list of filenames to hide
  translations?: Record<string, Record<string, string>>; // filename -> locale -> title
}

/**
 * Navigation tree item
 */
export interface NavItem {
  id: string; // unique identifier (path-based)
  title: string;
  path: string;
  order: number;
  type: 'file' | 'folder';
  children?: NavItem[];
  icon?: string;
  locale?: string;
}

/**
 * Complete navigation tree structure
 */
export interface NavigationTree {
  root: NavItem[];
  byPath: Map<string, NavItem>; // for quick lookup
  byLocale?: Record<string, NavItem[]>; // for i18n support
}

/**
 * Breadcrumb item for navigation
 */
export interface Breadcrumb {
  title: string;
  path: string;
}

/**
 * Search result item (Pagefind format)
 */
export interface SearchResult {
  id: string;
  url: string;
  title: string;
  excerpt: string;
  meta?: {
    title: string;
    description?: string;
  };
}
