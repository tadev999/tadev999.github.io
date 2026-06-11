/**
 * Build-time Navigation Generation Script
 *
 * Integrates DirectoryScanner, MetadataParser, and NavigationGenerator to
 * produce a navigation.json file at build time. Includes caching logic to
 * skip regeneration when content has not changed.
 *
 * Requirements: 8.1, 8.2
 */

import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import * as crypto from 'node:crypto';
import { DirectoryScanner } from './directoryScanner';
import { MetadataParser } from './metadataParser';
import { NavigationGenerator } from './navigationGenerator';
import { ErrorCollector } from './errorCollector';
import type { FileNode, NavigationTree, NavItem } from '@/types/navigation';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface BuildNavigationOptions {
  /** Root directory containing docs content (default: "src/data/docs") */
  docsPath?: string;
  /** Output path for navigation.json (default: "dist/navigation.json") */
  outputPath?: string;
  /** Cache file path (default: ".astro/navigation-cache.json") */
  cachePath?: string;
  /** Whether to use caching (default: true) */
  useCache?: boolean;
  /** Maximum directory scan depth (default: 10) */
  maxDepth?: number;
}

interface CacheEntry {
  /** Hash of the content structure at time of last build */
  contentHash: string;
  /** ISO timestamp of last build */
  builtAt: string;
}

// ─── Serializable NavigationTree ─────────────────────────────────────────────

/**
 * JSON-serializable version of NavigationTree (Map replaced with array of entries)
 */
interface SerializableNavigationTree {
  root: NavItem[];
  byPath: Array<[string, NavItem]>;
  byLocale?: Record<string, NavItem[]>;
}

// ─── Main build function ──────────────────────────────────────────────────────

/**
 * Build the navigation tree and write it to navigation.json.
 *
 * Steps:
 * 1. Compute a hash of the content directory structure
 * 2. Compare with cached hash — skip if unchanged
 * 3. Scan directory tree
 * 4. Parse metadata (frontmatter + _meta.json) for each file
 * 5. Generate navigation tree
 * 6. Write navigation.json to output path
 * 7. Update cache
 *
 * Requirements: 8.1, 8.2
 */
export async function buildNavigation(
  options: BuildNavigationOptions = {}
): Promise<SerializableNavigationTree> {
  const {
    docsPath = 'src/data/docs',
    outputPath = 'dist/navigation.json',
    cachePath = '.astro/navigation-cache.json',
    useCache = true,
    maxDepth = 10,
  } = options;

  const collector = new ErrorCollector();

  // Resolve absolute paths
  const absoluteDocsPath = path.resolve(process.cwd(), docsPath);
  const absoluteOutputPath = path.resolve(process.cwd(), outputPath);
  const absoluteCachePath = path.resolve(process.cwd(), cachePath);

  console.log(`[buildNavigation] Scanning: ${absoluteDocsPath}`);

  // 1. Check if docs directory exists
  try {
    await fs.stat(absoluteDocsPath);
  } catch {
    collector.add({
      type: 'filesystem',
      severity: 'error',
      file: absoluteDocsPath,
      message: `Docs directory not found: ${absoluteDocsPath}`,
      suggestion: `Create the directory at ${docsPath} and add content files.`,
    });
    collector.report();
    // Return empty tree
    return { root: [], byPath: [] };
  }

  // 2. Compute content hash for caching
  const contentHash = await computeContentHash(absoluteDocsPath);

  // 3. Check cache
  if (useCache) {
    const cached = await readCache(absoluteCachePath);
    if (cached && cached.contentHash === contentHash) {
      console.log('[buildNavigation] Content unchanged — using cached navigation.');
      // Read and return existing output
      try {
        const existing = await fs.readFile(absoluteOutputPath, 'utf-8');
        return JSON.parse(existing) as SerializableNavigationTree;
      } catch {
        // Cache hit but output missing — regenerate
        console.log('[buildNavigation] Cache valid but output missing — regenerating.');
      }
    }
  }

  // 4. Scan directory tree
  const scanner = new DirectoryScanner({ rootPath: absoluteDocsPath, maxDepth });
  let fileNodes: FileNode[];
  try {
    fileNodes = await scanner.scan();
  } catch (error) {
    collector.add({
      type: 'filesystem',
      severity: 'error',
      file: absoluteDocsPath,
      message: `Failed to scan docs directory: ${(error as Error).message}`,
    });
    collector.report();
    return { root: [], byPath: [] };
  }

  // 5. Enrich file nodes with metadata
  const parser = new MetadataParser();
  fileNodes = await enrichWithMetadata(fileNodes, parser, collector, absoluteDocsPath);

  // 6. Generate navigation tree
  const generator = new NavigationGenerator({ rootPath: absoluteDocsPath });
  const tree: NavigationTree = generator.generateTree(fileNodes);

  // 7. Serialize (Map → array of entries for JSON)
  const serializable: SerializableNavigationTree = {
    root: tree.root,
    byPath: Array.from(tree.byPath.entries()),
    byLocale: tree.byLocale,
  };

  // 8. Write output
  try {
    await fs.mkdir(path.dirname(absoluteOutputPath), { recursive: true });
    await fs.writeFile(absoluteOutputPath, JSON.stringify(serializable, null, 2), 'utf-8');
    console.log(`[buildNavigation] Written: ${absoluteOutputPath}`);
  } catch (error) {
    collector.add({
      type: 'filesystem',
      severity: 'error',
      file: absoluteOutputPath,
      message: `Failed to write navigation.json: ${(error as Error).message}`,
    });
  }

  // 9. Update cache
  if (useCache) {
    await writeCache(absoluteCachePath, { contentHash, builtAt: new Date().toISOString() });
  }

  // 10. Report any collected errors/warnings
  if (collector.hasIssues()) {
    collector.report();
  }

  return serializable;
}

// ─── Metadata enrichment ──────────────────────────────────────────────────────

/**
 * Recursively enrich FileNode tree with metadata from frontmatter and _meta.json.
 */
async function enrichWithMetadata(
  nodes: FileNode[],
  parser: MetadataParser,
  collector: ErrorCollector,
  dirPath: string
): Promise<FileNode[]> {
  // Load _meta.json for this directory level
  const metaFilePath = path.join(dirPath, '_meta.json');
  const metaConfig = await parser.parseMetaFile(metaFilePath);

  const enriched: FileNode[] = [];

  for (const node of nodes) {
    if (node.type === 'file') {
      // Parse frontmatter
      let frontmatter = {};
      try {
        const content = await fs.readFile(node.path, 'utf-8');
        frontmatter = parser.parseFrontmatter(content);
      } catch (error) {
        if (error instanceof Error) {
          const lineMatch = error.message.match(/line (\d+)/i);
          collector.add({
            type: 'parsing',
            severity: 'error',
            file: node.path,
            line: lineMatch ? parseInt(lineMatch[1], 10) : undefined,
            message: error.message,
            suggestion: 'Check the YAML frontmatter syntax in this file.',
          });
        }
      }

      const merged = parser.mergeMetadata(frontmatter, metaConfig, node.name);
      enriched.push({ ...node, metadata: merged });
    } else if (node.type === 'directory') {
      // Recursively enrich children
      const children = await enrichWithMetadata(
        node.children ?? [],
        parser,
        collector,
        node.path
      );

      // Apply directory-level metadata from parent _meta.json
      const dirMeta = parser.mergeMetadata({}, metaConfig, node.name);
      enriched.push({ ...node, children, metadata: dirMeta });
    }
  }

  return enriched;
}

// ─── Caching helpers ──────────────────────────────────────────────────────────

/**
 * Compute a hash of the content directory structure (file names + mtimes).
 * This is fast and doesn't require reading file contents.
 */
async function computeContentHash(dirPath: string): Promise<string> {
  const hash = crypto.createHash('sha256');

  async function hashDir(p: string): Promise<void> {
    let entries: string[];
    try {
      const dirents = await fs.readdir(p, { withFileTypes: true });
      entries = dirents.map(d => d.name).sort();
    } catch {
      return;
    }

    for (const name of entries) {
      const fullPath = path.join(p, name);
      hash.update(name);
      try {
        const stat = await fs.stat(fullPath);
        if (stat.isDirectory()) {
          await hashDir(fullPath);
        } else {
          hash.update(String(stat.mtimeMs));
        }
      } catch {
        // ignore
      }
    }
  }

  await hashDir(dirPath);
  return hash.digest('hex');
}

/**
 * Read the cache file, returning null if it doesn't exist or is invalid.
 */
async function readCache(cachePath: string): Promise<CacheEntry | null> {
  try {
    const content = await fs.readFile(cachePath, 'utf-8');
    return JSON.parse(content) as CacheEntry;
  } catch {
    return null;
  }
}

/**
 * Write the cache file.
 */
async function writeCache(cachePath: string, entry: CacheEntry): Promise<void> {
  try {
    await fs.mkdir(path.dirname(cachePath), { recursive: true });
    await fs.writeFile(cachePath, JSON.stringify(entry, null, 2), 'utf-8');
  } catch {
    // Non-critical — cache write failure should not fail the build
  }
}

export default buildNavigation;
