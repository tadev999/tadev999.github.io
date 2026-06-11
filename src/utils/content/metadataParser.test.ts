/**
 * Unit tests for MetadataParser
 * 
 * Tests core functionality of frontmatter parsing, meta file parsing,
 * metadata merging, and validation.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { MetadataParser } from './metadataParser';
import type { Metadata, MetaConfig } from '@/types/navigation';

describe('MetadataParser', () => {
  let parser: MetadataParser;

  beforeEach(() => {
    parser = new MetadataParser();
  });

  describe('parseFrontmatter', () => {
    it('should parse valid YAML frontmatter', () => {
      const content = `---
title: "Test Title"
description: "Test Description"
order: 1
hidden: false
icon: "📚"
---

# Content here`;

      const result = parser.parseFrontmatter(content);

      expect(result).toEqual({
        title: 'Test Title',
        description: 'Test Description',
        order: 1,
        hidden: false,
        icon: '📚',
      });
    });

    it('should handle empty frontmatter', () => {
      const content = `---
---

# Content`;

      const result = parser.parseFrontmatter(content);
      expect(result).toEqual({});
    });

    it('should handle missing frontmatter', () => {
      const content = '# Content without frontmatter';

      const result = parser.parseFrontmatter(content);
      expect(result).toEqual({});
    });

    it('should handle frontmatter with only some fields', () => {
      const content = `---
title: "Partial Metadata"
order: 5
---

# Content`;

      const result = parser.parseFrontmatter(content);

      expect(result).toEqual({
        title: 'Partial Metadata',
        order: 5,
      });
    });

    it('should handle translations in frontmatter', () => {
      const content = `---
title: "English Title"
translations:
  vi: "Tiêu đề Tiếng Việt"
  en: "English Title"
---

# Content`;

      const result = parser.parseFrontmatter(content);

      expect(result.translations).toEqual({
        vi: 'Tiêu đề Tiếng Việt',
        en: 'English Title',
      });
    });

    it('should throw error for invalid YAML', () => {
      const content = `---
title: "Unclosed quote
order: 1
---

# Content`;

      expect(() => parser.parseFrontmatter(content)).toThrow(/Invalid YAML frontmatter/);
    });

    it('should handle Unicode characters in titles', () => {
      const content = `---
title: "Tiếng Việt 中文 日本語 🎉"
---

# Content`;

      const result = parser.parseFrontmatter(content);
      expect(result.title).toBe('Tiếng Việt 中文 日本語 🎉');
    });

    it('should ignore non-standard fields', () => {
      const content = `---
title: "Test"
customField: "Should be ignored"
anotherField: 123
---

# Content`;

      const result = parser.parseFrontmatter(content);

      expect(result).toEqual({
        title: 'Test',
      });
      expect(result).not.toHaveProperty('customField');
      expect(result).not.toHaveProperty('anotherField');
    });

    it('should handle frontmatter with wrong types gracefully', () => {
      const content = `---
title: 123
order: "not a number"
hidden: "not a boolean"
---

# Content`;

      const result = parser.parseFrontmatter(content);

      // Should ignore fields with wrong types
      expect(result).toEqual({});
    });
  });

  describe('mergeMetadata', () => {
    it('should merge frontmatter with meta config', () => {
      const frontmatter: Metadata = {
        title: 'Frontmatter Title',
        description: 'Description',
      };

      const metaConfig: MetaConfig = {
        order: {
          'test.md': 5,
        },
      };

      const result = parser.mergeMetadata(frontmatter, metaConfig, 'test.md');

      expect(result).toEqual({
        title: 'Frontmatter Title',
        description: 'Description',
        order: 5,
        hidden: false, // default value
      });
    });

    it('should apply default values for optional fields', () => {
      const frontmatter: Metadata = {
        title: 'Test',
      };

      const metaConfig: MetaConfig = {};

      const result = parser.mergeMetadata(frontmatter, metaConfig, 'test.md');

      expect(result.hidden).toBe(false);
      expect(result.order).toBeUndefined();
    });

    it('should let meta config override order', () => {
      const frontmatter: Metadata = {
        title: 'Test',
        order: 1,
      };

      const metaConfig: MetaConfig = {
        order: {
          'test.md': 10,
        },
      };

      const result = parser.mergeMetadata(frontmatter, metaConfig, 'test.md');

      expect(result.order).toBe(10);
    });

    it('should let meta config override hidden', () => {
      const frontmatter: Metadata = {
        title: 'Test',
        hidden: false,
      };

      const metaConfig: MetaConfig = {
        hidden: ['test.md'],
      };

      const result = parser.mergeMetadata(frontmatter, metaConfig, 'test.md');

      expect(result.hidden).toBe(true);
    });

    it('should merge translations', () => {
      const frontmatter: Metadata = {
        title: 'Test',
        translations: {
          en: 'English',
        },
      };

      const metaConfig: MetaConfig = {
        translations: {
          'test.md': {
            vi: 'Tiếng Việt',
            fr: 'Français',
          },
        },
      };

      const result = parser.mergeMetadata(frontmatter, metaConfig, 'test.md');

      expect(result.translations).toEqual({
        en: 'English',
        vi: 'Tiếng Việt',
        fr: 'Français',
      });
    });

    it('should not apply meta config for different filename', () => {
      const frontmatter: Metadata = {
        title: 'Test',
      };

      const metaConfig: MetaConfig = {
        order: {
          'other.md': 5,
        },
        hidden: ['other.md'],
      };

      const result = parser.mergeMetadata(frontmatter, metaConfig, 'test.md');

      expect(result.order).toBeUndefined();
      expect(result.hidden).toBe(false);
    });
  });

  describe('validateMetadata', () => {
    it('should validate correct metadata', () => {
      const metadata: Metadata = {
        title: 'Test',
        description: 'Description',
        order: 1,
        hidden: false,
        icon: '📚',
        translations: {
          en: 'English',
          vi: 'Tiếng Việt',
        },
      };

      const result = parser.validateMetadata(metadata);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should detect invalid title type', () => {
      const metadata = {
        title: 123,
      } as unknown as Metadata;

      const result = parser.validateMetadata(metadata);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('title must be a string');
    });

    it('should detect invalid order type', () => {
      const metadata = {
        order: 'not a number',
      } as unknown as Metadata;

      const result = parser.validateMetadata(metadata);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('order must be a number');
    });

    it('should detect invalid hidden type', () => {
      const metadata = {
        hidden: 'not a boolean',
      } as unknown as Metadata;

      const result = parser.validateMetadata(metadata);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('hidden must be a boolean');
    });

    it('should detect invalid translations structure', () => {
      const metadata = {
        translations: 'not an object',
      } as unknown as Metadata;

      const result = parser.validateMetadata(metadata);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('translations must be an object');
    });

    it('should detect invalid translation values', () => {
      const metadata = {
        translations: {
          en: 'Valid',
          vi: 123,
        },
      } as unknown as Metadata;

      const result = parser.validateMetadata(metadata);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('translations.vi must be a string');
    });

    it('should validate empty metadata', () => {
      const metadata: Metadata = {};

      const result = parser.validateMetadata(metadata);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should collect multiple errors', () => {
      const metadata = {
        title: 123,
        order: 'not a number',
        hidden: 'not a boolean',
      } as unknown as Metadata;

      const result = parser.validateMetadata(metadata);

      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(3);
      expect(result.errors).toContain('title must be a string');
      expect(result.errors).toContain('order must be a number');
      expect(result.errors).toContain('hidden must be a boolean');
    });
  });
});
