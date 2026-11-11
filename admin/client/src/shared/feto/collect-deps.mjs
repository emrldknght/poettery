#!/usr/bin/env node
/**
 * node collect-deps.mjs "путь/к/_files" Accent.js AccentTonic.js
 * Без аргументов: текущая папка, точки входа Accent.js и AccentTonic.js.
 * Результат: папка to-send/ и отчёт по недостающим модулям.
 */
import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const root = path.resolve(args[0] || '.');
const entries = args.length > 1 ? args.slice(1) : ['Accent.js', 'AccentTonic.js'];
const outDir = path.resolve('to-send');

const PATTERNS = [
  /\bimport\s+[^'";]*?from\s*['"]([^'"]+)['"]/g,
  /\bimport\s*['"]([^'"]+)['"]/g,
  /\bexport\s+[^'";]*?from\s*['"]([^'"]+)['"]/g,
  /\bimport\s*\(\s*['"]([^'"]+)['"]/g,
  /\brequire\s*\(\s*['"]([^'"]+)['"]/g,
];

const HINT_RE = /slovar|slov|dict|udar|accent|state|init|main|fet|full|analiz/i;

function extractSpecs(code) {
  const specs = new Set();
  for (const re of PATTERNS) {
    re.lastIndex = 0;
    let m;
    while ((m = re.exec(code)) !== null) specs.add(m[1]);
  }
  return [...specs];
}

function resolveSpec(spec, fromFile) {
  if (!spec.startsWith('.') && !spec.startsWith('/')) {
    return { external: spec };
  }
  const base = spec.startsWith('/')
    ? path.join(root, spec.replace(/^\/+/, ''))
    : path.resolve(path.dirname(fromFile), spec);

  const candidates = [base, `${base}.js`, `${base}.mjs`, `${base}.json`, path.join(base, 'index.js')];
  for (const candidate of candidates) {
    if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
      return { file: candidate };
    }
  }
  return { missing: spec, from: fromFile };
}

function walkJs(dir, acc = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walkJs(full, acc);
    else if (/\.(js|mjs|json)$/i.test(entry.name)) acc.push(full);
  }
  return acc;
}

if (!fs.existsSync(root) || !fs.statSync(root).isDirectory()) {
  console.error(`Папка не найдена: ${root}`);
  process.exit(1);
}

const queue = [];
for (const entry of entries) {
  const full = path.resolve(root, entry);
  if (!fs.existsSync(full)) {
    console.error(`Точка входа не найдена: ${full}`);
    process.exit(1);
  }
  queue.push(full);
}

const visited = new Set();
const missing = [];
const external = new Set();

while (queue.length) {
  const file = queue.shift();
  if (visited.has(file)) continue;
  visited.add(file);

  const code = fs.readFileSync(file, 'utf8');
  for (const spec of extractSpecs(code)) {
    const result = resolveSpec(spec, file);
    if (result.file) queue.push(result.file);
    else if (result.external) external.add(result.external);
    else missing.push({ spec, from: path.relative(root, file) });
  }
}

fs.mkdirSync(outDir, { recursive: true });
for (const file of visited) {
  const rel = path.relative(root, file);
  const safeRel = rel.startsWith('..') ? path.basename(file) : rel;
  const target = path.join(outDir, safeRel);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.copyFileSync(file, target);
}

const collected = [...visited].map((f) => path.relative(root, f)).sort();

console.log(`\nСобрано файлов: ${collected.length} → ${outDir}\n`);
collected.forEach((name) => console.log(`  + ${name}`));

if (missing.length) {
  console.log(`\nНЕ ХВАТАЕТ (${missing.length}):`);
  const unique = new Map();
  missing.forEach(({ spec, from }) => {
    if (!unique.has(spec)) unique.set(spec, new Set());
    unique.get(spec).add(from);
  });
  for (const [spec, froms] of unique) {
    console.log(`  - ${spec}   ← ${[...froms].join(', ')}`);
  }
}

if (external.size) {
  console.log(`\nВнешние пакеты (не копировались): ${[...external].join(', ')}`);
}

const candidates = walkJs(root)
  .filter((f) => !visited.has(f))
  .filter((f) => HINT_RE.test(path.basename(f)))
  .map((f) => path.relative(root, f))
  .sort();

if (candidates.length) {
  console.log('\nПохоже на словарь / инициализацию — проверь вручную:');
  candidates.forEach((name) => console.log(`  ? ${name}`));
}

console.log('\nГотово. Если список «НЕ ХВАТАЕТ» пуст — архивируй to-send/ и присылай.');
console.log('Дополнительно нужен сам .html: в нём могут быть <script src> и создание state.\n');