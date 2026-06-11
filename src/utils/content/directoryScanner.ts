/**
 * Directory Scanner Module
 * 
 * Scans file system to detect content files (.md, .mdx) and builds a hierarchical
 * file tree structure. Implements filtering logic to ignore files/folders starting
 * with underscore (_) or dot (.).
 * 
 * Requirements: 1.1, 1.3, 1.4, 1.5
 */

import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import type { FileNode } from '@/types/navigation';

/**
 * Configuration options for DirectoryScanner
 */
export interface DirectoryScannerOptions {
  /** Root path to scan */
  rootPath: string;
  /** Maximum depth to scan (default: 10) */
  maxDepth?: number;
  /** File extensions to recognize as content files (default: ['.md', '.mdx']) */
  extensions?: string[];
  /** Patterns to ignore (default: ['_*', '.*']) */
  ignorePatterns?: string[];
}

/**
 * DirectoryScanner class
 * 
 * Scans directory structure and identifies content files while filtering
 * out ignored files and directories.
 */
export class DirectoryScanner {
  private rootPath: string;
  private maxDepth: number;
  private extensions: string[];
  private ignorePatterns: string[];

  /**
   * Create a new DirectoryScanner instance
   * 
   * @param options - Scanner configuration options
   */
  constructor(options: DirectoryScannerOptions) {
    this.rootPath = options.rootPath;
    this.maxDepth = options.maxDepth ?? 10;
    this.extensions = options.extensions ?? ['.md', '.mdx'];
    this.ignorePatterns = options.ignorePatterns ?? ['_*', '.*'];
  }

  /**
   * Scan directory and return file tree
   * 
   * Recursively scans the configured root directory up to maxDepth levels,
   * building a hierarchical FileNode structure.
   * 
   * @returns Promise resolving to array of FileNode representing the directory tree
   * @throws Error if root directory doesn't exist or is not accessible
   */
  async scan(): Promise<FileNode[]> {
    try {
      // Verify root path exists
      const stats = await fs.stat(this.rootPath);
      if (!stats.isDirectory()) {
        throw new Error(`Root path is not a directory: ${this.rootPath}`);
      }
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        throw new Error(`Root directory not found: ${this.rootPath}`);
      }
      if ((error as NodeJS.ErrnoException).code === 'EACCES') {
        throw new Error(`Permission denied accessing: ${this.rootPath}`);
      }
      throw error;
    }

    return this.scanDirectory(this.rootPath, 0);
  }

  /**
   * Recursively scan a directory
   * 
   * @param dirPath - Absolute path to directory to scan
   * @param currentDepth - Current depth level (0-indexed)
   * @returns Promise resolving to array of FileNode
   */
  private async scanDirectory(
    dirPath: string,
    currentDepth: number
  ): Promise<FileNode[]> {
    // Check depth limit
    if (currentDepth >= this.maxDepth) {
      return [];
    }

    const nodes: FileNode[] = [];

    try {
      const entries = await fs.readdir(dirPath, { withFileTypes: true });

      for (const entry of entries) {
        const entryName = entry.name;
        const entryPath = path.join(dirPath, entryName);

        // Skip ignored files/directories
        if (this.shouldIgnore(entryName)) {
          continue;
        }

        if (entry.isDirectory()) {
          // Recursively scan subdirectory
          const children = await this.scanDirectory(entryPath, currentDepth + 1);
          
          nodes.push({
            name: entryName,
            path: entryPath,
            type: 'directory',
            children,
          });
        } else if (entry.isFile() && this.isContentFile(entryName)) {
          // Add content file
          nodes.push({
            name: entryName,
            path: entryPath,
            type: 'file',
          });
        }
      }
    } catch (error) {
      // Log error but continue processing other directories
      console.error(`Error scanning directory ${dirPath}:`, error);
    }

    return nodes;
  }

  /**
   * Check if file should be processed as content file
   * 
   * A file is considered a content file if it has one of the configured
   * extensions (.md or .mdx by default).
   * 
   * Requirement 1.3: Recognize files with .md and .mdx extensions
   * 
   * @param filename - Name of the file to check
   * @returns true if file is a content file, false otherwise
   */
  isContentFile(filename: string): boolean {
    const ext = path.extname(filename).toLowerCase();
    return this.extensions.includes(ext);
  }

  /**
   * Check if file/directory should be ignored
   * 
   * Files and directories are ignored if they start with underscore (_) or dot (.).
   * 
   * Requirement 1.4: Ignore files and directories starting with _ or .
   * 
   * @param filename - Name of the file or directory to check
   * @returns true if should be ignored, false otherwise
   */
  shouldIgnore(filename: string): boolean {
    // Check if filename starts with _ or .
    return filename.startsWith('_') || filename.startsWith('.');
  }
}

/**
 * Convenience function to create and run a scanner
 * 
 * @param rootPath - Root directory to scan
 * @param options - Optional scanner configuration
 * @returns Promise resolving to array of FileNode
 */
export async function scanContentDirectory(
  rootPath: string,
  options?: Omit<DirectoryScannerOptions, 'rootPath'>
): Promise<FileNode[]> {
  const scanner = new DirectoryScanner({
    rootPath,
    ...options,
  });
  return scanner.scan();
}
