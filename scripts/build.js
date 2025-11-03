#!/usr/bin/env node
const fs = require('fs').promises;
const path = require('path');

const distDir = path.join(__dirname, '../dist');
const assetsToCopy = [
    'img',
    'index.html',
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

    console.log('Processing favicon directory...');
    const faviconSourceDir = path.join(__dirname, '../favicon');
    const faviconDestDir = path.join(distDir, 'favicon');
    try {
        await fs.mkdir(faviconDestDir, { recursive: true });
        const files = await fs.readdir(faviconSourceDir);
        for (const file of files) {
            const sourceFile = path.join(faviconSourceDir, file);
            if (file === 'favicon.ico') {
                const destFile = path.join(distDir, 'favicon.ico');
                await fs.copyFile(sourceFile, destFile);
                console.log('Copied favicon.ico to dist root');
            } else {
                const destFile = path.join(faviconDestDir, file);
                await fs.copyFile(sourceFile, destFile);
                console.log(`Copied ${file} to dist/favicon`);
            }
        }
    } catch (err) {
        console.error(`⚠Error processing favicon directory:`, err);
        process.exit(1);
    }

    console.log('Build complete: dist directory prepared and assets copied.');
}

build().catch(err => {
    console.error('Build failed:', err);
    process.exit(1);
});
