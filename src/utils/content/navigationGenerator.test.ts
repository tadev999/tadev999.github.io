/**
 * Unit tests for NavigationGenerator
 *
 * Tests core functionality of tree generation, sorting, breadcrumb building,
 * and locale filtering.
 *
 * Requirements: 2.1, 2.2, 2.3, 2.5, 2.6, 7.1, 7.2
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { NavigationGenerator, generateNavigationTree } from './navigationGenerator';
import type { FileNode, NavItem } from '@/types/navigation';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function makeFile(name: string, overrides: Partial<FileNode> = {}): FileNode {
  return {
    name,
    path: `/docs/${name}`,
    type: 'file',
    ...overrides,
  };
}

function makeDir(name: string, children: FileNode[] = [], overrides: Partial<FileNode> = {}): FileNode {
  return {
    name,
    path: `/docs/${name}`,
    type: 'directory',
    children,
    ...overrides,
  };
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('NavigationGenerator', () => {
  let generator: NavigationGenerator;

  beforeEach(() => {
    generator = new NavigationGenerator();
  });

  // ── generateTree ────────────────────────────────────────────────────────────

  describe('generateTree', () => {
    it('should return empty root for empty file list', () => {
      const tree = generator.generateTree([]);
      expect(tree.root).toEqual([]);
      expect(tree.byPath.size).toBe(0);
    });

    it('should convert a single file node to a NavItem', () => {
      const files: FileNode[] = [
        makeFile('getting-started.md', {
          metadata: { title: 'Getting Started' },
        }),
      ];

      const tree = generator.generateTree(files);

      expect(tree.root).toHaveLength(1);
      expect(tree.root[0].title).toBe('Getting Started');
      expect(tree.root[0].type).toBe('file');
    });

    it('should mirror directory structure (Requirement 2.1, 2.2)', () => {
      const files: FileNode[] = [
        makeDir('guides', [
          makeFile('guides/installation.md', {
            path: '/docs/guides/installation.md',
            metadata: { title: 'Installation' },
          }),
          makeFile('guides/configuration.md', {
            path: '/docs/guides/configuration.md',
            metadata: { title: 'Configuration' },
          }),
        ], { metadata: { title: 'Guides' } }),
      ];

      const tree = generator.generateTree(files);

      expect(tree.root).toHaveLength(1);
      const guidesItem = tree.root[0];
      expect(guidesItem.type).toBe('folder');
      expect(guidesItem.children).toHaveLength(2);
    });

    it('should build byPath map for quick lookup', () => {
      const files: FileNode[] = [
        makeFile('intro.md', { metadata: { title: 'Introduction' } }),
      ];

      const tree = generator.generateTree(files);

      expect(tree.byPath.size).toBe(1);
      const item = tree.byPath.get('/docs/intro');
      expect(item).toBeDefined();
      expect(item?.title).toBe('Introduction');
    });

    it('should populate byPath for nested items', () => {
      const files: FileNode[] = [
        makeDir('guides', [
          makeFile('guides/install.md', {
            path: '/docs/guides/install.md',
            metadata: { title: 'Install' },
          }),
        ]),
      ];

      const tree = generator.generateTree(files);

      expect(tree.byPath.has('/docs/guides')).toBe(true);
      expect(tree.byPath.has('/docs/guides/install')).toBe(true);
    });

    it('should exclude hidden items (Requirement 4.4)', () => {
      const files: FileNode[] = [
        makeFile('visible.md', { metadata: { title: 'Visible', hidden: false } }),
        makeFile('hidden.md', { metadata: { title: 'Hidden', hidden: true } }),
      ];

      const tree = generator.generateTree(files);

      expect(tree.root).toHaveLength(1);
      expect(tree.root[0].title).toBe('Visible');
    });

    it('should exclude hidden items from byPath map', () => {
      const files: FileNode[] = [
        makeFile('hidden.md', { metadata: { hidden: true } }),
      ];

      const tree = generator.generateTree(files);

      expect(tree.byPath.size).toBe(0);
    });
  });

  // ── Title resolution ─────────────────────────────────────────────────────────

  describe('title resolution', () => {
    it('should use frontmatter title when available (Requirement 2.6)', () => {
      const files: FileNode[] = [
        makeFile('my-page.md', { metadata: { title: 'My Custom Title' } }),
      ];

      const tree = generator.generateTree(files);

      expect(tree.root[0].title).toBe('My Custom Title');
    });

    it('should fall back to filename without extension (Requirement 2.5)', () => {
      const files: FileNode[] = [
        makeFile('getting-started.md'),
      ];

      const tree = generator.generateTree(files);

      expect(tree.root[0].title).toBe('getting-started');
    });

    it('should strip .mdx extension when falling back to filename', () => {
      const files: FileNode[] = [
        {
          name: 'overview.mdx',
          path: '/docs/overview.mdx',
          type: 'file',
        },
      ];

      const tree = generator.generateTree(files);

      expect(tree.root[0].title).toBe('overview');
    });

    it('should prefer frontmatter title over filename', () => {
      const files: FileNode[] = [
        makeFile('ugly-slug.md', { metadata: { title: 'Beautiful Title' } }),
      ];

      const tree = generator.generateTree(files);

      expect(tree.root[0].title).toBe('Beautiful Title');
    });
  });

  // ── sortItems ────────────────────────────────────────────────────────────────

  describe('sortItems', () => {
    it('should sort alphabetically when no order is specified (Requirement 2.3)', () => {
      const items: NavItem[] = [
        { id: 'c', title: 'Zebra', path: '/c', order: Infinity, type: 'file' },
        { id: 'a', title: 'Apple', path: '/a', order: Infinity, type: 'file' },
        { id: 'b', title: 'Mango', path: '/b', order: Infinity, type: 'file' },
      ];

      const sorted = generator.sortItems(items);

      expect(sorted.map(i => i.title)).toEqual(['Apple', 'Mango', 'Zebra']);
    });

    it('should sort by order field ascending when present', () => {
      const items: NavItem[] = [
        { id: 'c', title: 'Third', path: '/c', order: 3, type: 'file' },
        { id: 'a', title: 'First', path: '/a', order: 1, type: 'file' },
        { id: 'b', title: 'Second', path: '/b', order: 2, type: 'file' },
      ];

      const sorted = generator.sortItems(items);

      expect(sorted.map(i => i.title)).toEqual(['First', 'Second', 'Third']);
    });

    it('should place ordered items before unordered items (Property 5)', () => {
      const items: NavItem[] = [
        { id: 'z', title: 'Alphabetically First', path: '/z', order: Infinity, type: 'file' },
        { id: 'a', title: 'Has Order', path: '/a', order: 1, type: 'file' },
      ];

      const sorted = generator.sortItems(items);

      expect(sorted[0].title).toBe('Has Order');
      expect(sorted[1].title).toBe('Alphabetically First');
    });

    it('should not mutate the input array', () => {
      const items: NavItem[] = [
        { id: 'b', title: 'B', path: '/b', order: Infinity, type: 'file' },
        { id: 'a', title: 'A', path: '/a', order: Infinity, type: 'file' },
      ];
      const original = [...items];

      generator.sortItems(items);

      expect(items).toEqual(original);
    });

    it('should handle empty array', () => {
      expect(generator.sortItems([])).toEqual([]);
    });

    it('should handle single item', () => {
      const items: NavItem[] = [
        { id: 'a', title: 'Only', path: '/a', order: Infinity, type: 'file' },
      ];
      expect(generator.sortItems(items)).toHaveLength(1);
    });
  });

  // ── buildBreadcrumbs ─────────────────────────────────────────────────────────

  describe('buildBreadcrumbs', () => {
    it('should return empty array when path not found', () => {
      const tree = generator.generateTree([]);
      const crumbs = generator.buildBreadcrumbs('/nonexistent', tree);
      expect(crumbs).toEqual([]);
    });

    it('should return single breadcrumb for top-level item', () => {
      const files: FileNode[] = [
        makeFile('intro.md', { metadata: { title: 'Introduction' } }),
      ];
      const tree = generator.generateTree(files);

      const crumbs = generator.buildBreadcrumbs('/docs/intro', tree);

      expect(crumbs).toHaveLength(1);
      expect(crumbs[0].title).toBe('Introduction');
      expect(crumbs[0].path).toBe('/docs/intro');
    });

    it('should return full breadcrumb trail for nested item', () => {
      const files: FileNode[] = [
        makeDir('guides', [
          makeFile('guides/install.md', {
            path: '/docs/guides/install.md',
            metadata: { title: 'Install' },
          }),
        ], { metadata: { title: 'Guides' } }),
      ];
      const tree = generator.generateTree(files);

      const crumbs = generator.buildBreadcrumbs('/docs/guides/install', tree);

      expect(crumbs).toHaveLength(2);
      expect(crumbs[0].title).toBe('Guides');
      expect(crumbs[1].title).toBe('Install');
    });

    it('should return breadcrumbs in root-to-leaf order', () => {
      const files: FileNode[] = [
        makeDir('a', [
          makeDir('a/b', [
            makeFile('a/b/c.md', {
              path: '/docs/a/b/c.md',
              metadata: { title: 'C' },
            }),
          ], { path: '/docs/a/b', metadata: { title: 'B' } }),
        ], { metadata: { title: 'A' } }),
      ];
      const tree = generator.generateTree(files);

      const crumbs = generator.buildBreadcrumbs('/docs/a/b/c', tree);

      expect(crumbs.map(c => c.title)).toEqual(['A', 'B', 'C']);
    });
  });

  // ── filterByLocale ───────────────────────────────────────────────────────────

  describe('filterByLocale', () => {
    it('should return items matching the given locale (Requirement 7.1, 7.2)', () => {
      const files: FileNode[] = [
        makeDir('en', [
          makeFile('en/intro.md', {
            path: '/docs/en/intro.md',
            metadata: { title: 'Introduction' },
          }),
        ], { metadata: { title: 'English' } }),
        makeDir('vi', [
          makeFile('vi/intro.md', {
            path: '/docs/vi/intro.md',
            metadata: { title: 'Giới thiệu' },
          }),
        ], { metadata: { title: 'Vietnamese' } }),
      ];
      const tree = generator.generateTree(files);

      const enItems = generator.filterByLocale(tree, 'en');
      const viItems = generator.filterByLocale(tree, 'vi');

      expect(enItems).toHaveLength(1);
      expect(enItems[0].title).toBe('English');

      expect(viItems).toHaveLength(1);
      expect(viItems[0].title).toBe('Vietnamese');
    });

    it('should return empty array when locale not found', () => {
      const files: FileNode[] = [
        makeDir('en', [], { metadata: { title: 'English' } }),
      ];
      const tree = generator.generateTree(files);

      const result = generator.filterByLocale(tree, 'fr');
      expect(result).toEqual([]);
    });

    it('should return empty array for empty tree', () => {
      const tree = generator.generateTree([]);
      expect(generator.filterByLocale(tree, 'en')).toEqual([]);
    });
  });

  // ── generateNavigationTree convenience function ──────────────────────────────

  describe('generateNavigationTree (convenience function)', () => {
    it('should produce same result as class instance', () => {
      const files: FileNode[] = [
        makeFile('page.md', { metadata: { title: 'Page' } }),
      ];

      const fromClass = new NavigationGenerator().generateTree(files);
      const fromFn = generateNavigationTree(files);

      expect(fromFn.root.length).toBe(fromClass.root.length);
      expect(fromFn.root[0].title).toBe(fromClass.root[0].title);
    });
  });

  // ── Integration: full tree with ordering ─────────────────────────────────────

  describe('integration: ordering and filtering', () => {
    it('should sort mixed ordered/unordered items correctly', () => {
      const files: FileNode[] = [
        makeFile('zebra.md', { metadata: { title: 'Zebra' } }),
        makeFile('alpha.md', { metadata: { title: 'Alpha', order: 2 } }),
        makeFile('beta.md', { metadata: { title: 'Beta', order: 1 } }),
        makeFile('apple.md', { metadata: { title: 'Apple' } }),
      ];

      const tree = generator.generateTree(files);
      const titles = tree.root.map(i => i.title);

      // Beta (order:1), Alpha (order:2) come first, then Apple, Zebra alphabetically
      expect(titles[0]).toBe('Beta');
      expect(titles[1]).toBe('Alpha');
      expect(titles[2]).toBe('Apple');
      expect(titles[3]).toBe('Zebra');
    });

    it('should exclude hidden items from nested directories', () => {
      const files: FileNode[] = [
        makeDir('guides', [
          makeFile('guides/visible.md', {
            path: '/docs/guides/visible.md',
            metadata: { title: 'Visible' },
          }),
          makeFile('guides/draft.md', {
            path: '/docs/guides/draft.md',
            metadata: { title: 'Draft', hidden: true },
          }),
        ]),
      ];

      const tree = generator.generateTree(files);

      const guidesItem = tree.root[0];
      expect(guidesItem.children).toHaveLength(1);
      expect(guidesItem.children![0].title).toBe('Visible');
    });
  });
});
