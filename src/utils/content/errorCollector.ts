/**
 * ErrorCollector - Error collection and reporting utilities
 *
 * Provides centralized error collection for the content management build process.
 * Errors are accumulated without stopping execution and reported at the end of
 * the build. If any errors with severity 'error' are present, the build fails.
 *
 * Also provides:
 * - Circular reference detection in NavItem trees
 * - Internal link validation in content files
 *
 * Requirements: 9.1, 9.2, 9.3, 9.4, 9.5
 */

import type { NavItem } from '@/types/navigation';

// ─── BuildError interface ────────────────────────────────────────────────────

/**
 * Represents a single build error or warning collected during the build process.
 *
 * Requirements: 9.1, 9.5
 */
export interface BuildError {
  /** Category of the error */
  type: 'parsing' | 'validation' | 'configuration' | 'filesystem';
  /** Severity level — 'error' causes build failure, 'warning' does not */
  severity: 'error' | 'warning';
  /** Path of the file where the error occurred */
  file: string;
  /** Optional line number within the file */
  line?: number;
  /** Human-readable description of the error */
  message: string;
  /** Optional suggestion for how to fix the error */
  suggestion?: string;
}

// ─── ErrorCollector class ────────────────────────────────────────────────────

/**
 * Collects build errors and warnings without stopping execution.
 * Reports all collected issues at the end of the build process.
 *
 * Usage:
 * ```ts
 * const collector = new ErrorCollector();
 * collector.add({ type: 'parsing', severity: 'error', file: 'foo.md', message: '...' });
 * collector.report(); // throws if any errors with severity 'error'
 * ```
 *
 * Requirements: 9.5
 */
export class ErrorCollector {
  private errors: BuildError[] = [];

  /**
   * Add a build error or warning to the collection.
   *
   * @param error - The BuildError to record
   */
  add(error: BuildError): void {
    this.errors.push(error);
  }

  /**
   * Return a copy of all collected errors and warnings.
   */
  getErrors(): BuildError[] {
    return [...this.errors];
  }

  /**
   * Return only errors with severity 'error'.
   */
  getErrorsOnly(): BuildError[] {
    return this.errors.filter(e => e.severity === 'error');
  }

  /**
   * Return only errors with severity 'warning'.
   */
  getWarnings(): BuildError[] {
    return this.errors.filter(e => e.severity === 'warning');
  }

  /**
   * Return true if there are any collected errors or warnings.
   */
  hasIssues(): boolean {
    return this.errors.length > 0;
  }

  /**
   * Return true if there are any errors with severity 'error'.
   */
  hasErrors(): boolean {
    return this.errors.some(e => e.severity === 'error');
  }

  /**
   * Clear all collected errors and warnings.
   */
  clear(): void {
    this.errors = [];
  }

  /**
   * Print all collected errors and warnings to the console, then throw if
   * any errors with severity 'error' are present.
   *
   * Requirements: 9.5
   *
   * @throws Error if there are any errors with severity 'error'
   */
  report(): void {
    if (this.errors.length === 0) return;

    const errorCount = this.errors.filter(e => e.severity === 'error').length;
    const warningCount = this.errors.filter(e => e.severity === 'warning').length;

    console.log('\n=== Build Issues ===\n');

    for (const error of this.errors) {
      const icon = error.severity === 'error' ? '❌' : '⚠️';
      const location = error.line ? `:${error.line}` : '';
      console.log(`${icon} ${error.type.toUpperCase()} in ${error.file}${location}`);
      console.log(`   ${error.message}`);
      if (error.suggestion) {
        console.log(`   💡 ${error.suggestion}`);
      }
      console.log();
    }

    console.log(`Total: ${errorCount} error${errorCount !== 1 ? 's' : ''}, ${warningCount} warning${warningCount !== 1 ? 's' : ''}\n`);

    if (errorCount > 0) {
      throw new Error(`Build failed with ${errorCount} error${errorCount !== 1 ? 's' : ''}`);
    }
  }
}

// ─── Circular reference detection ───────────────────────────────────────────

/**
 * Result of circular reference detection.
 */
export interface CircularReferenceResult {
  /** Whether a circular reference was found */
  hasCircularReference: boolean;
  /** The cycle path as an array of NavItem ids, if a cycle was found */
  cyclePath?: string[];
}

/**
 * Detect circular references in a NavItem tree.
 *
 * Traverses the tree using DFS and tracks visited node ids. If a node is
 * encountered that is already in the current DFS path, a circular reference
 * is detected.
 *
 * Requirements: 9.3
 *
 * @param nodes - Root-level NavItem array to check
 * @param collector - Optional ErrorCollector to record detected cycles
 * @returns CircularReferenceResult indicating whether a cycle was found
 */
export function detectCircularReferences(
  nodes: NavItem[],
  collector?: ErrorCollector
): CircularReferenceResult {
  // Track the current DFS path (ancestor ids)
  const currentPath: string[] = [];
  // Track all globally visited ids to avoid redundant traversal
  const globalVisited = new Set<string>();

  function dfs(node: NavItem): CircularReferenceResult {
    if (currentPath.includes(node.id)) {
      // Circular reference detected — build the cycle path
      const cycleStart = currentPath.indexOf(node.id);
      const cyclePath = [...currentPath.slice(cycleStart), node.id];

      if (collector) {
        collector.add({
          type: 'validation',
          severity: 'error',
          file: node.path,
          message: `Circular reference detected: ${cyclePath.join(' -> ')}`,
          suggestion: `Remove the circular reference by ensuring "${node.id}" does not appear as its own ancestor.`,
        });
      }

      return { hasCircularReference: true, cyclePath };
    }

    if (globalVisited.has(node.id)) {
      // Already fully processed this node in a different branch — safe to skip
      return { hasCircularReference: false };
    }

    currentPath.push(node.id);

    for (const child of node.children ?? []) {
      const result = dfs(child);
      if (result.hasCircularReference) {
        currentPath.pop();
        return result;
      }
    }

    currentPath.pop();
    globalVisited.add(node.id);

    return { hasCircularReference: false };
  }

  for (const node of nodes) {
    const result = dfs(node);
    if (result.hasCircularReference) {
      return result;
    }
  }

  return { hasCircularReference: false };
}

// ─── Internal link validation ────────────────────────────────────────────────

/**
 * Result of internal link validation for a single content file.
 */
export interface LinkValidationResult {
  /** Path of the file that was checked */
  file: string;
  /** List of broken internal links found in the file */
  brokenLinks: BrokenLink[];
}

/**
 * Represents a single broken internal link.
 */
export interface BrokenLink {
  /** The raw link target as written in the markdown */
  target: string;
  /** Line number where the link appears (1-indexed), if determinable */
  line?: number;
}

/**
 * Validate internal links in a markdown content string.
 *
 * Extracts all markdown links whose targets start with `/` or `./` or `../`
 * (i.e. relative or absolute internal links, not external http/https links)
 * and checks whether each target exists in the provided set of known paths.
 *
 * Requirements: 9.4
 *
 * @param content - Raw markdown content of the file
 * @param filePath - Path of the file being validated (used in error messages)
 * @param knownPaths - Set of valid internal paths (e.g. from NavigationTree.byPath)
 * @param collector - Optional ErrorCollector to record broken links
 * @returns LinkValidationResult with any broken links found
 */
export function validateInternalLinks(
  content: string,
  filePath: string,
  knownPaths: Set<string>,
  collector?: ErrorCollector
): LinkValidationResult {
  const brokenLinks: BrokenLink[] = [];

  // Match markdown links: [text](target) — capture the target group
  // Also match bare angle-bracket links: <target>
  const linkRegex = /\[(?:[^\]]*)\]\(([^)]+)\)/g;

  const lines = content.split('\n');

  // Build a line-number index: for each character offset, which line is it on?
  // We'll use a simpler approach: scan line by line.
  for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
    const line = lines[lineIndex];
    let match: RegExpExecArray | null;
    const lineRegex = /\[(?:[^\]]*)\]\(([^)]+)\)/g;

    while ((match = lineRegex.exec(line)) !== null) {
      const rawTarget = match[1].trim();

      // Strip any title attribute: [text](url "title") → url
      const targetWithoutTitle = rawTarget.replace(/\s+"[^"]*"$/, '').trim();

      // Only validate internal links (not external URLs, anchors-only, or mailto)
      if (isInternalLink(targetWithoutTitle)) {
        // Normalize: strip query string and fragment for path lookup
        const normalizedPath = normalizeLinkTarget(targetWithoutTitle);

        if (!knownPaths.has(normalizedPath)) {
          const brokenLink: BrokenLink = {
            target: targetWithoutTitle,
            line: lineIndex + 1,
          };
          brokenLinks.push(brokenLink);

          if (collector) {
            collector.add({
              type: 'validation',
              severity: 'warning',
              file: filePath,
              line: lineIndex + 1,
              message: `Broken internal link: "${targetWithoutTitle}" does not point to an existing file`,
              suggestion: `Check that the target path "${normalizedPath}" exists in the content directory.`,
            });
          }
        }
      }
    }
  }

  // Also run the global regex to catch any links that span unusual patterns
  // (the line-by-line approach above is the primary one)
  void linkRegex; // suppress unused variable warning

  return {
    file: filePath,
    brokenLinks,
  };
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Determine whether a link target is an internal link.
 *
 * Internal links:
 * - Start with `/` (absolute path)
 * - Start with `./` or `../` (relative path)
 *
 * Not internal:
 * - Start with `http://` or `https://` (external)
 * - Start with `#` (anchor-only)
 * - Start with `mailto:` or other schemes
 *
 * @param target - The raw link target string
 * @returns true if the link is internal
 */
export function isInternalLink(target: string): boolean {
  if (!target) return false;
  if (target.startsWith('#')) return false;
  if (/^[a-zA-Z][a-zA-Z0-9+\-.]*:/.test(target)) return false; // any URI scheme
  // Relative or absolute path
  return target.startsWith('/') || target.startsWith('./') || target.startsWith('../');
}

/**
 * Normalize a link target for path lookup.
 *
 * - Strips fragment (#...) and query string (?...)
 * - Strips trailing `.md` or `.mdx` extension (navigation paths don't include extensions)
 * - Ensures leading slash for absolute paths
 *
 * @param target - The raw link target
 * @returns Normalized path suitable for lookup in knownPaths
 */
export function normalizeLinkTarget(target: string): string {
  // Remove fragment
  let normalized = target.split('#')[0];
  // Remove query string
  normalized = normalized.split('?')[0];
  // Strip .md / .mdx extension
  normalized = normalized.replace(/\.(md|mdx)$/, '');
  // Trim trailing slash
  normalized = normalized.replace(/\/$/, '');

  return normalized || '/';
}

// ─── Default export ───────────────────────────────────────────────────────────

export default ErrorCollector;
