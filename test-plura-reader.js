#!/usr/bin/env node

/**
 * Test script for plura-reader MCP server
 * Run: node test-plura-reader.js
 */

import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pluraReaderPath = path.join(__dirname, 'mcp-servers', 'plura-reader.js');

console.log('🧪 Testing Plura Reader MCP Server...\n');
console.log(`📁 Path: ${pluraReaderPath}\n`);

// Check if file exists
import fs from 'fs';
if (!fs.existsSync(pluraReaderPath)) {
    console.error('❌ plura-reader.js not found!');
    process.exit(1);
}

console.log('✅ File exists\n');

// Test if it starts without errors
const node = spawn('node', [pluraReaderPath], {
    stdio: ['pipe', 'pipe', 'pipe'],
    env: {
        ...process.env,
        GITHUB_TOKEN: process.env.GITHUB_TOKEN || '',
        PLURA_GITHUB_REPO: 'denvudd/plura',
        PLURA_LOCAL_PATH: path.join(__dirname, '..', 'plura'),
    },
});

let output = '';
let errors = '';

node.stdout.on('data', (data) => {
    output += data.toString();
});

node.stderr.on('data', (data) => {
    errors += data.toString();
});

node.on('close', (code) => {
    if (code === 0 || output.includes('plura-reader')) {
        console.log('✅ MCP Server started successfully!\n');
        console.log('📤 Output:', output.substring(0, 200));
        if (errors) {
            console.log('\n⚠️  Warnings:', errors.substring(0, 200));
        }
        console.log('\n💡 The server is running and ready for Cursor MCP connection.');
    } else {
        console.error('❌ MCP Server failed to start\n');
        if (errors) {
            console.error('Errors:', errors);
        }
        process.exit(1);
    }
});

// Kill after 3 seconds (just testing startup)
setTimeout(() => {
    node.kill();
    console.log('\n✅ Test complete - server can start successfully!');
    process.exit(0);
}, 3000);

