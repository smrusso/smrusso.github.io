#!/usr/bin/env node
const fs = require('fs').promises;
const path = require('path');

const distDir = path.join(__dirname, '../dist');
const assetsToCopy = [
    'android-chrome-192x192.png',
    'android-chrome-256x256.png',
    'apple-touch-icon.png',
    'CNAME',
    'favicon.ico',
    'favicon-16x16.png',
    'favicon-32x32.png',
    'index.html',
    'manifest.json',
    'img',
    'safari-pinned-tab.svg',
    'js/decrypt.js',
];

async function copyAsset(sourcePath, destPath) {
    const stat = await fs.stat(sourcePath);
    if (stat.isDirectory()) {
        await fs.cp(sourcePath, destPath, { recursive: true });
    } else {
        await fs.mkdir(path.dirname(destPath), { recursive: true });
        await fs.copyFile(sourcePath, destPath);
    }
}

async function build() {
    console.log('Cleaning dist directory...');
    await fs.rm(distDir, { recursive: true, force: true });
    await fs.mkdir(distDir, { recursive: true });

    console.log('Copying assets...');
    for (const asset of assetsToCopy) {
        const sourcePath = path.join(__dirname, '..', asset);
        const destPath = path.join(distDir, asset);

        try {
            await fs.access(sourcePath);
            await copyAsset(sourcePath, destPath);
            console.log(`Copied: ${asset}`);
        } catch (err) {
            if (err.code === 'ENOENT') {
                console.error(`Missing required asset: ${asset}`);
                process.exit(1); // fail the pipeline
            } else {
                console.error(`⚠Error copying ${asset}:`, err);
                process.exit(1);
            }
        }
    }

    console.log('Build complete: dist directory prepared and assets copied.');
}

build().catch(err => {
    console.error('Build failed:', err);
    process.exit(1);
});
