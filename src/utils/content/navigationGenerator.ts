/**
 * NavigationGenerator - Generates navigation tree from file structure
 *
 * This module transforms a FileNode array (produced by DirectoryScanner) into
 * a NavigationTree suitable for rendering sidebar navigation. It handles:
 * - Tree generation mirroring directory structure
 * - Sorting by order field or alphabetically
 * - Breadcrumb trail construction
 * - Locale-based filtering for i18n support
 * - Quick lookup via byPath Map
 *
 * Requirements: 2.1, 2.2, 2.3, 2.5, 2.6, 7.1, 7.2
 */

import * as path from 'node:path';
import type {
  FileNode,
  NavItem,
  NavigationTree,
  Breadcrumb,
  MetaConfig,
} from '@/types/navigation';

/**
 * Configuration options for NavigationGenerator
 */
export interface NavigationGeneratorOptions {
  /** Default locale for title resolution (default: undefined) */
  locale?: string;
  /** Whether to sort alphabetically when no order is specified (default: true) */
  sortAlphabetically?: boolean;
  /** Root path used to compute relative URL paths */
  rootPath?: string;
}

/**
 * NavigationGenerator class
 *
 * Converts a FileNode tree into a NavigationTree with sorted items,
 * breadcrumb support, and locale filtering.
 */
export class NavigationGenerator {
  private locale: string | undefined;
  private sortAlphabetically: boolean;
  private rootPath: string;

  /**
   * Create a new NavigationGenerator instance
   *
   * @param options - Generator configuration options
   */
  constructor(options: NavigationGeneratorOptions = {}) {
    this.locale = options.locale;
    this.sortAlphabetically = options.sortAlphabetically ?? true;
    this.rootPath = options.rootPath ?? '';
  }

  /**
   * Generate a NavigationTree from an array of FileNode
   *
   * Converts the flat/hierarchical FileNode structure into NavItems,
   * filters hidden items, sorts items, and builds the byPath lookup map.
   *
   * Requirements: 2.1, 2.2, 2.3, 2.5, 2.6
   *
   * @param files - Array of FileNode from DirectoryScanner
   * @returns Complete NavigationTree with root items and byPath map
   */
  generateTree(files: FileNode[]): NavigationTree {
    const byPath = new Map<string, NavItem>();

    const root = this._buildNavItems(files, byPath);

    return {
      root,
      byPath,
    };
  }

  /**
   * Sort navigation items based on order field or alphabetically
   *
   * Sorting rules (Property 5):
   * - Items with an `order` field come first, sorted ascending by order value
   * - Items without an `order` field come after, sorted alphabetically by title
   *
   * Requirements: 2.3, 4.3
   *
   * @param items - Array of NavItem to sort
   * @param _metaConfig - Optional MetaConfig (reserved for future use)
   * @returns New sorted array of NavItem (does not mutate input)
   */
  sortItems(items: NavItem[], _metaConfig?: MetaConfig): NavItem[] {
    const withOrder = items.filter(item => item.order !== undefined && item.order !== Infinity);
    const withoutOrder = items.filter(item => item.order === undefined || item.order === Infinity);

    // Sort items that have an explicit order ascending
    withOrder.sort((a, b) => a.order - b.order);

    // Sort items without order alphabetically by title
    if (this.sortAlphabetically) {
      withoutOrder.sort((a, b) =>
        a.title.localeCompare(b.title, undefined, { sensitivity: 'base' })
      );
    }

    return [...withOrder, ...withoutOrder];
  }

  /**
   * Build breadcrumb trail for a given path within the navigation tree
   *
   * Traverses the tree from root to the target path, collecting each
   * ancestor node as a breadcrumb entry.
   *
   * Requirements: 2.1, 2.2
   *
   * @param currentPath - The URL path of the current page
   * @param tree - The NavigationTree to search within
   * @returns Array of Breadcrumb items from root to current page (inclusive)
   */
  buildBreadcrumbs(currentPath: string, tree: NavigationTree): Breadcrumb[] {
    const breadcrumbs: Breadcrumb[] = [];

    const found = this._findPathInTree(currentPath, tree.root, breadcrumbs);

    if (!found) {
      // Path not found in tree — return empty breadcrumbs
      return [];
    }

    return breadcrumbs;
  }

  /**
   * Filter navigation tree items by locale
   *
   * When content is organized by language-code subdirectories (e.g. /en, /vi),
   * this returns only the items whose path starts with the given locale prefix.
   *
   * Requirements: 7.1, 7.2
   *
   * @param tree - The full NavigationTree
   * @param locale - Locale code to filter by (e.g. "en", "vi")
   * @returns Array of NavItem belonging to the given locale
   */
  filterByLocale(tree: NavigationTree, locale: string): NavItem[] {
    return tree.root.filter(item => {
      // Match items whose path contains the locale as a path segment.
      // Supports both top-level locale dirs (/en/...) and nested ones (/docs/en/...).
      const segments = item.path.split('/').filter(Boolean);
      return segments.includes(locale);
    });
  }

  // ─── Private helpers ────────────────────────────────────────────────────────

  /**
   * Recursively build NavItem array from FileNode array
   *
   * @param nodes - FileNode array to convert
   * @param byPath - Map to populate with path → NavItem entries
   * @returns Sorted array of NavItem
   */
  private _buildNavItems(
    nodes: FileNode[],
    byPath: Map<string, NavItem>
  ): NavItem[] {
    const items: NavItem[] = [];

    for (const node of nodes) {
      const metadata = node.metadata ?? {};

      // Skip hidden items (Requirement 4.4 / Property 11)
      if (metadata.hidden === true) {
        continue;
      }

      // Resolve title: frontmatter title > filename without extension
      const title = this._resolveTitle(node, metadata.title);

      // Resolve URL path from file system path
      const urlPath = this._resolveUrlPath(node);

      // Resolve order: use metadata.order if present, otherwise Infinity (no order)
      const order = typeof metadata.order === 'number' ? metadata.order : Infinity;

      const navItem: NavItem = {
        id: urlPath,
        title,
        path: urlPath,
        order,
        type: node.type === 'directory' ? 'folder' : 'file',
        icon: metadata.icon,
        locale: this.locale,
      };

      // Recursively process children for directories
      if (node.type === 'directory' && node.children) {
        const childItems = this._buildNavItems(node.children, byPath);
        navItem.children = childItems;
      }

      // Register in byPath map for quick lookup
      byPath.set(urlPath, navItem);

      items.push(navItem);
    }

    // Sort items at this level
    return this.sortItems(items);
  }

  /**
   * Resolve the display title for a FileNode
   *
   * Priority (Property 7):
   * 1. Frontmatter title (if present)
   * 2. Filename without extension
   *
   * Requirements: 2.5, 2.6
   *
   * @param node - The FileNode
   * @param frontmatterTitle - Title from frontmatter metadata (if any)
   * @returns Resolved display title
   */
  private _resolveTitle(node: FileNode, frontmatterTitle?: string): string {
    if (frontmatterTitle) {
      return frontmatterTitle;
    }

    // Fall back to filename without extension
    const basename = path.basename(node.name, path.extname(node.name));
    return basename;
  }

  /**
   * Resolve the URL path for a FileNode
   *
   * Converts the absolute file system path to a URL-friendly path by
   * stripping the rootPath prefix and removing file extensions.
   *
   * @param node - The FileNode
   * @returns URL path string (e.g. "/docs/guides/installation")
   */
  private _resolveUrlPath(node: FileNode): string {
    let filePath = node.path;

    // Strip rootPath prefix if configured
    if (this.rootPath && filePath.startsWith(this.rootPath)) {
      filePath = filePath.slice(this.rootPath.length);
    }

    // Remove file extension for files
    if (node.type === 'file') {
      filePath = filePath.replace(/\.(md|mdx)$/, '');
    }

    // Normalize path separators to forward slashes
    filePath = filePath.replace(/\\/g, '/');

    // Ensure leading slash
    if (!filePath.startsWith('/')) {
      filePath = '/' + filePath;
    }

    return filePath;
  }

  /**
   * Recursively search for a path in the navigation tree, building breadcrumbs
   *
   * @param targetPath - The URL path to find
   * @param items - Current level of NavItem array to search
   * @param breadcrumbs - Accumulator for breadcrumb trail
   * @returns true if the path was found, false otherwise
   */
  private _findPathInTree(
    targetPath: string,
    items: NavItem[],
    breadcrumbs: Breadcrumb[]
  ): boolean {
    for (const item of items) {
      if (item.path === targetPath) {
        breadcrumbs.push({ title: item.title, path: item.path });
        return true;
      }

      if (item.children && item.children.length > 0) {
        // Check if target is under this folder
        if (targetPath.startsWith(item.path + '/') || targetPath === item.path) {
          breadcrumbs.push({ title: item.title, path: item.path });
          const found = this._findPathInTree(targetPath, item.children, breadcrumbs);
          if (found) {
            return true;
          }
          // Not found in this subtree — remove the breadcrumb we just added
          breadcrumbs.pop();
        }
      }
    }

    return false;
  }
}

/**
 * Convenience function to generate a navigation tree from FileNode array
 *
 * @param files - Array of FileNode from DirectoryScanner
 * @param options - Optional generator configuration
 * @returns NavigationTree
 */
export function generateNavigationTree(
  files: FileNode[],
  options?: NavigationGeneratorOptions
): NavigationTree {
  const generator = new NavigationGenerator(options);
  return generator.generateTree(files);
}

export default NavigationGenerator;
