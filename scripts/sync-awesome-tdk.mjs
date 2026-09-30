import fs from 'node:fs';
import path from 'node:path';
import { root } from './lib.mjs';
import yaml from 'yaml';

const source = process.argv[2] ?? 'https://raw.githubusercontent.com/tdk-landscape/awesome-tdk-framework/main/README.md';
const response = await fetch(source);
if (!response.ok) throw new Error(`Could not read awesome-tdk README (${response.status}): ${source}`);
const readme = await response.text();
const lines = readme.split(/\r?\n/);
const records = [];
let section = 'General';
for (const line of lines) {
  const heading = line.match(/^#{2,4}\s+(.+?)\s*#*$/);
  if (heading) { section = heading[1].replace(/\s+/g, ' ').trim(); continue; }
  const link = line.match(/^\s*(?:[-*+]\s*)?(?:\*\*)?\[([^\]]+)\]\((https?:\/\/[^)]+)\)(?:\*\*)?(.*)$/);
  if (!link) continue;
  const [, title, url, rest] = link;
  const normalized = `${section} ${title} ${url} ${rest}`.toLowerCase();
  const classification = /archived|deprecated/.test(normalized) ? 'Archived' : /community|community-maintained/.test(normalized) ? 'Community' : 'Official';
  records.push({ title: title.trim(), section, classification, url, description: rest.replace(/^[\s:—–-]+/, '').trim(), lab_ids: [] });
}
if (!records.length || !lines.some((line) => /^#{2,4}\s+/.test(line))) throw new Error('README structure was not recognized; no catalog entries were parsed.');
const labs = fs.readdirSync(path.join(root, 'content/labs')).filter((name) => name.endsWith('.yaml')).map((name) => yaml.parse(fs.readFileSync(path.join(root, 'content/labs', name), 'utf8')));
for (const record of records) for (const lab of labs) if (lab.source.catalog.some((key) => `${record.title} ${record.section}`.toLowerCase().includes(key.replaceAll('-', ' ').toLowerCase()))) record.lab_ids.push(lab.id);
const output = path.join(root, '_data/catalog.yml');
fs.writeFileSync(output, yaml.stringify(records));
console.log(`Wrote ${records.length} catalog entries to ${path.relative(root, output)}.`);
