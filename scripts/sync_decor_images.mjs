import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Candidates for sample images folder
const customArgPath = process.argv[2];
const candidateDirs = [
  customArgPath ? path.resolve(customArgPath) : null,
  path.join(rootDir, 'sample_images'),
  path.join(rootDir, 'sameple_images'),
  path.join(rootDir, 'frontend', 'public', 'images', 'decor'),
].filter(Boolean);

let sourceDir = candidateDirs.find(d => fs.existsSync(d) && fs.readdirSync(d).filter(f => !f.startsWith('.')).length > 0);

const targetDir = path.join(rootDir, 'frontend', 'public', 'images', 'decor');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

console.log('----------------------------------------------------');
console.log('BRB Decors - Decoration Image Ingestion Pipeline');
console.log('----------------------------------------------------');

if (!sourceDir) {
  console.log(`[!] No images found in candidate directories:`);
  candidateDirs.forEach(d => console.log(`   - ${d} (exists: ${fs.existsSync(d)}, items: ${fs.existsSync(d) ? fs.readdirSync(d).length : 0})`));
  console.log('\nPlease place your decoration photos into:');
  console.log(`   --> ${path.join(rootDir, 'sample_images')}`);
  console.log('Supported formats: .jpg, .jpeg, .png, .webp, .heic, .avif\n');
  process.exit(0);
}

console.log(`[+] Found source directory: ${sourceDir}`);
const files = fs.readdirSync(sourceDir).filter(file => {
  const ext = path.extname(file).toLowerCase();
  return ['.jpg', '.jpeg', '.png', '.webp', '.heic', '.avif'].includes(ext);
});

if (files.length === 0) {
  console.log(`[!] Source directory ${sourceDir} exists but has 0 recognized image files.`);
  process.exit(0);
}

console.log(`[+] Discovered ${files.length} authentic decoration images:`);
files.forEach((f, idx) => console.log(`   ${idx + 1}. ${f}`));

// Copy to targetDir
const copiedList = [];
files.forEach(file => {
  const srcPath = path.join(sourceDir, file);
  // Sanitize filename for web
  const ext = path.extname(file).toLowerCase();
  const base = path.basename(file, ext).replace(/[^a-zA-Z0-9_-]/g, '_').toLowerCase();
  const targetName = `${base}${ext}`;
  const destPath = path.join(targetDir, targetName);

  fs.copyFileSync(srcPath, destPath);
  copiedList.push({
    originalName: file,
    webName: targetName,
    publicUrl: `/images/decor/${targetName}`,
  });
});

// Write manifest
const manifestPath = path.join(rootDir, 'frontend', 'src', 'data', 'realDecorManifest.json');
fs.writeFileSync(manifestPath, JSON.stringify(copiedList, null, 2));
console.log(`\n[✓] Successfully ingested ${copiedList.length} images into frontend/public/images/decor/`);
console.log(`[✓] Generated manifest at: ${manifestPath}`);
