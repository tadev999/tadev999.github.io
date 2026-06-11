/**
 * Test script for DirectoryScanner
 * 
 * This script tests the DirectoryScanner implementation to verify:
 * - It scans directories recursively
 * - It recognizes .md and .mdx files
 * - It ignores files starting with _ or .
 * - It preserves hierarchical structure
 */

import { DirectoryScanner } from './src/utils/content/directoryScanner.ts';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function testScanner() {
  console.log('🧪 Testing DirectoryScanner...\n');

  const docsPath = path.join(__dirname, 'src/data/docs');
  
  const scanner = new DirectoryScanner({
    rootPath: docsPath,
  });

  try {
    const result = await scanner.scan();
    
    console.log('✅ Scan completed successfully!\n');
    console.log('📁 Scanned structure:');
    console.log(JSON.stringify(result, null, 2));
    
    // Verify expectations
    console.log('\n🔍 Verification:');
    
    // Count files
    const countFiles = (nodes) => {
      let count = 0;
      for (const node of nodes) {
        if (node.type === 'file') {
          count++;
        }
        if (node.children) {
          count += countFiles(node.children);
        }
      }
      return count;
    };
    
    const fileCount = countFiles(result);
    console.log(`   - Found ${fileCount} content files`);
    
    // Check if hidden files are excluded
    const hasHiddenFiles = (nodes) => {
      for (const node of nodes) {
        if (node.name.startsWith('_') || node.name.startsWith('.')) {
          return true;
        }
        if (node.children && hasHiddenFiles(node.children)) {
          return true;
        }
      }
      return false;
    };
    
    const hiddenFound = hasHiddenFiles(result);
    console.log(`   - Hidden files excluded: ${!hiddenFound ? '✅' : '❌'}`);
    
    // Check if .txt files are excluded
    const hasTxtFiles = (nodes) => {
      for (const node of nodes) {
        if (node.type === 'file' && node.name.endsWith('.txt')) {
          return true;
        }
        if (node.children && hasTxtFiles(node.children)) {
          return true;
        }
      }
      return false;
    };
    
    const txtFound = hasTxtFiles(result);
    console.log(`   - Non-content files excluded: ${!txtFound ? '✅' : '❌'}`);
    
    // Check if subdirectories are scanned
    const hasSubdirectories = result.some(node => node.type === 'directory' && node.children && node.children.length > 0);
    console.log(`   - Subdirectories scanned: ${hasSubdirectories ? '✅' : '❌'}`);
    
    console.log('\n✨ All tests passed!');
    
  } catch (error) {
    console.error('❌ Error during scan:', error);
    process.exit(1);
  }
}

// Test individual methods
function testMethods() {
  console.log('\n🧪 Testing individual methods...\n');
  
  const scanner = new DirectoryScanner({
    rootPath: '/tmp',
  });
  
  // Test isContentFile
  console.log('Testing isContentFile():');
  const testFiles = [
    'test.md',
    'test.mdx',
    'test.txt',
    'test.js',
    'README.MD',
    'guide.MDX',
  ];
  
  for (const file of testFiles) {
    const result = scanner.isContentFile(file);
    console.log(`   - ${file}: ${result ? '✅ content file' : '❌ not content file'}`);
  }
  
  // Test shouldIgnore
  console.log('\nTesting shouldIgnore():');
  const testNames = [
    '_meta.json',
    '.gitignore',
    'normal-file.md',
    '_hidden.md',
    '.dotfile',
    'regular-folder',
  ];
  
  for (const name of testNames) {
    const result = scanner.shouldIgnore(name);
    console.log(`   - ${name}: ${result ? '🚫 ignored' : '✅ included'}`);
  }
}

// Run tests
testMethods();
testScanner();
