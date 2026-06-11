/**
 * MetadataParser - Parses frontmatter and _meta.json files
 * 
 * This module provides functionality to extract and merge metadata from:
 * - YAML frontmatter in markdown/MDX files
 * - _meta.json configuration files
 * 
 * Requirements: 4.1, 4.2, 4.5, 6.1, 6.2
 */

import { parse as parseYAML } from 'yaml';
import { readFile } from 'node:fs/promises';
import type { Metadata, MetaConfig } from '@/types/navigation';

/**
 * Validation result for metadata
 */
export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

/**
 * MetadataParser class for parsing frontmatter and meta configuration files
 */
export class MetadataParser {
  /**
   * Parse YAML frontmatter from markdown content
   * 
   * Extracts frontmatter delimited by --- markers and parses it as YAML.
   * Returns empty object if no frontmatter is found.
   * 
   * @param content - The full markdown content including frontmatter
   * @returns Parsed metadata object
   * @throws Error if YAML parsing fails (with line number information)
   * 
   * Requirements: 4.1
   */
  parseFrontmatter(content: string): Metadata {
    // Match frontmatter between --- delimiters at the start of the file
    const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n/;
    const match = content.match(frontmatterRegex);

    if (!match) {
      // No frontmatter found, return empty metadata
      return {};
    }

    const frontmatterContent = match[1];

    if (!frontmatterContent.trim()) {
      // Empty frontmatter
      return {};
    }

    try {
      const parsed = parseYAML(frontmatterContent);
      
      // Ensure we return an object (YAML can parse to primitives)
      if (typeof parsed !== 'object' || parsed === null) {
        return {};
      }

      // Extract only the fields we care about for Metadata
      const metadata: Metadata = {};

      if (typeof parsed.title === 'string') {
        metadata.title = parsed.title;
      }

      if (typeof parsed.description === 'string') {
        metadata.description = parsed.description;
      }

      if (typeof parsed.order === 'number') {
        metadata.order = parsed.order;
      }

      if (typeof parsed.hidden === 'boolean') {
        metadata.hidden = parsed.hidden;
      }

      if (typeof parsed.icon === 'string') {
        metadata.icon = parsed.icon;
      }

      if (parsed.translations && typeof parsed.translations === 'object') {
        metadata.translations = parsed.translations as Record<string, string>;
      }

      return metadata;
    } catch (error) {
      // Enhance error message with line number information
      if (error instanceof Error) {
        const lineInfo = this.extractLineNumber(error.message);
        throw new Error(
          `Invalid YAML frontmatter${lineInfo ? ` at line ${lineInfo}` : ''}: ${error.message}`
        );
      }
      throw error;
    }
  }

  /**
   * Parse _meta.json configuration file
   * 
   * Reads and parses a _meta.json file from the file system.
   * Returns empty object if file doesn't exist or contains invalid JSON.
   * 
   * @param path - Absolute path to the _meta.json file
   * @returns Parsed meta configuration object
   * 
   * Requirements: 6.1, 6.2
   */
  async parseMetaFile(path: string): Promise<MetaConfig> {
    try {
      const content = await readFile(path, 'utf-8');
      const parsed = JSON.parse(content);

      // Validate structure
      if (typeof parsed !== 'object' || parsed === null) {
        console.warn(`Invalid _meta.json at ${path}: root must be an object`);
        return {};
      }

      // Extract and validate fields
      const metaConfig: MetaConfig = {};

      if (typeof parsed.title === 'string') {
        metaConfig.title = parsed.title;
      }

      if (parsed.order && typeof parsed.order === 'object') {
        // Validate that all values are numbers
        const order: Record<string, number> = {};
        for (const [key, value] of Object.entries(parsed.order)) {
          if (typeof value === 'number') {
            order[key] = value;
          } else {
            console.warn(
              `Invalid order value in ${path}: ${key} should be a number, got ${typeof value}`
            );
          }
        }
        if (Object.keys(order).length > 0) {
          metaConfig.order = order;
        }
      }

      if (Array.isArray(parsed.hidden)) {
        // Validate that all items are strings
        const hidden = parsed.hidden.filter((item: unknown) => {
          if (typeof item !== 'string') {
            console.warn(
              `Invalid hidden item in ${path}: expected string, got ${typeof item}`
            );
            return false;
          }
          return true;
        });
        if (hidden.length > 0) {
          metaConfig.hidden = hidden;
        }
      }

      if (parsed.translations && typeof parsed.translations === 'object') {
        // Validate nested structure: filename -> locale -> title
        const translations: Record<string, Record<string, string>> = {};
        for (const [filename, localeMap] of Object.entries(parsed.translations)) {
          if (typeof localeMap === 'object' && localeMap !== null) {
            const validLocales: Record<string, string> = {};
            for (const [locale, title] of Object.entries(localeMap)) {
              if (typeof title === 'string') {
                validLocales[locale] = title;
              } else {
                console.warn(
                  `Invalid translation in ${path}: ${filename}.${locale} should be a string`
                );
              }
            }
            if (Object.keys(validLocales).length > 0) {
              translations[filename] = validLocales;
            }
          }
        }
        if (Object.keys(translations).length > 0) {
          metaConfig.translations = translations;
        }
      }

      return metaConfig;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        // File doesn't exist, return empty config
        return {};
      }

      if (error instanceof SyntaxError) {
        // JSON parsing error
        console.warn(`Invalid JSON in ${path}: ${error.message}`);
        return {};
      }

      // Other errors
      console.error(`Error reading _meta.json at ${path}:`, error);
      return {};
    }
  }

  /**
   * Merge frontmatter metadata with meta configuration
   * 
   * Meta configuration takes precedence for order and hidden fields.
   * Frontmatter title is used if meta config doesn't specify a title.
   * 
   * @param frontmatter - Metadata from file's frontmatter
   * @param metaConfig - Configuration from _meta.json
   * @param filename - Name of the file (used to look up config)
   * @returns Merged metadata object
   * 
   * Requirements: 4.5, 6.3, 6.4, 6.5
   */
  mergeMetadata(
    frontmatter: Metadata,
    metaConfig: MetaConfig,
    filename: string
  ): Metadata {
    const merged: Metadata = { ...frontmatter };

    // Apply default values for optional fields (Requirement 4.5)
    if (merged.hidden === undefined) {
      merged.hidden = false;
    }

    // Meta config order takes precedence
    if (metaConfig.order && filename in metaConfig.order) {
      merged.order = metaConfig.order[filename];
    }

    // Meta config hidden takes precedence
    if (metaConfig.hidden && metaConfig.hidden.includes(filename)) {
      merged.hidden = true;
    }

    // Meta config translations can override or extend frontmatter translations
    if (metaConfig.translations && filename in metaConfig.translations) {
      merged.translations = {
        ...merged.translations,
        ...metaConfig.translations[filename],
      };
    }

    // Meta config title for directory (if this is being used for a directory)
    if (metaConfig.title && !merged.title) {
      merged.title = metaConfig.title;
    }

    return merged;
  }

  /**
   * Validate metadata structure
   * 
   * Checks that metadata fields have correct types and valid values.
   * 
   * @param metadata - Metadata object to validate
   * @returns Validation result with any errors found
   * 
   * Requirements: 4.2
   */
  validateMetadata(metadata: Metadata): ValidationResult {
    const errors: string[] = [];

    if (metadata.title !== undefined && typeof metadata.title !== 'string') {
      errors.push('title must be a string');
    }

    if (metadata.description !== undefined && typeof metadata.description !== 'string') {
      errors.push('description must be a string');
    }

    if (metadata.order !== undefined && typeof metadata.order !== 'number') {
      errors.push('order must be a number');
    }

    if (metadata.hidden !== undefined && typeof metadata.hidden !== 'boolean') {
      errors.push('hidden must be a boolean');
    }

    if (metadata.icon !== undefined && typeof metadata.icon !== 'string') {
      errors.push('icon must be a string');
    }

    if (metadata.translations !== undefined) {
      if (typeof metadata.translations !== 'object' || metadata.translations === null) {
        errors.push('translations must be an object');
      } else {
        for (const [locale, title] of Object.entries(metadata.translations)) {
          if (typeof title !== 'string') {
            errors.push(`translations.${locale} must be a string`);
          }
        }
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Extract line number from YAML error message
   * 
   * @param errorMessage - Error message from YAML parser
   * @returns Line number if found, null otherwise
   */
  private extractLineNumber(errorMessage: string): number | null {
    const lineMatch = errorMessage.match(/line (\d+)/i);
    if (lineMatch) {
      return parseInt(lineMatch[1], 10);
    }
    return null;
  }
}

/**
 * Default export for convenience
 */
export default MetadataParser;
