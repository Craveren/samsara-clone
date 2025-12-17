#!/usr/bin/env node

/**
 * Helper script to fetch Plura files from GitHub
 * Run: node fetch-plura.js <file-path>
 * Example: node fetch-plura.js package.json
 */

import { Octokit } from 'octokit';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PLURA_REPO = 'denvudd/plura';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

if (!GITHUB_TOKEN) {
  console.error('❌ GITHUB_TOKEN not set in environment variables');
  console.log('Set it with: $env:GITHUB_TOKEN="ghp_your_token" (PowerShell)');
  process.exit(1);
}

const octokit = new Octokit({ auth: GITHUB_TOKEN });
const [owner, repo] = PLURA_REPO.split('/');

async function fetchFile(filePath) {
  try {
    console.log(`📥 Fetching: ${filePath}...`);
    
    const { data: file } = await octokit.rest.repos.getContent({
      owner,
      repo,
      path: filePath,
      mediaType: { format: 'raw' },
    });

    const content = Buffer.from(file.content, 'base64').toString('utf-8');
    
    // Save to woodpecker/plura-files/
    const outputDir = path.join(__dirname, 'woodpecker', 'plura-files');
    await fs.mkdir(outputDir, { recursive: true });
    
    const outputPath = path.join(outputDir, filePath.replace(/\//g, '-'));
    await fs.writeFile(outputPath, content, 'utf-8');
    
    console.log(`✅ Saved to: ${outputPath}`);
    console.log(`\n--- Content Preview (first 500 chars) ---\n`);
    console.log(content.substring(0, 500));
    console.log(`\n--- End Preview ---\n`);
    
    return content;
  } catch (error) {
    if (error.status === 404) {
      console.error(`❌ File not found: ${filePath}`);
    } else {
      console.error(`❌ Error: ${error.message}`);
    }
    return null;
  }
}

async function listDirectory(dirPath = '') {
  try {
    console.log(`📁 Listing: ${dirPath || 'root'}...`);
    
    const { data: contents } = await octokit.rest.repos.getContent({
      owner,
      repo,
      path: dirPath || '.',
    });

    const items = Array.isArray(contents) ? contents : [contents];
    
    console.log(`\n📋 Contents:\n`);
    items.forEach(item => {
      const icon = item.type === 'dir' ? '📁' : '📄';
      console.log(`${icon} ${item.name}${item.type === 'file' ? ` (${item.size} bytes)` : ''}`);
    });
    
    return items;
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    return [];
  }
}

// Main
const command = process.argv[2];
const arg = process.argv[3];

if (!command) {
  console.log(`
📖 Plura File Fetcher

Usage:
  node fetch-plura.js read <file-path>     # Read a file
  node fetch-plura.js list [directory]      # List directory contents
  node fetch-plura.js structure             # Get full structure

Examples:
  node fetch-plura.js read package.json
  node fetch-plura.js read src/app/layout.tsx
  node fetch-plura.js list src/components
  node fetch-plura.js structure
  `);
  process.exit(0);
}

if (command === 'read' && arg) {
  await fetchFile(arg);
} else if (command === 'list') {
  await listDirectory(arg || '');
} else if (command === 'structure') {
  console.log('📁 Fetching Plura structure...\n');
  await listDirectory('');
  console.log('\n💡 Use "read <file-path>" to fetch specific files');
} else {
  console.error(`❌ Unknown command: ${command}`);
  process.exit(1);
}

