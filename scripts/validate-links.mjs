import yaml from 'yaml';
import fs from 'node:fs';
import path from 'node:path';
const root = path.resolve(import.meta.dirname, '..');
const records = yaml.parse(fs.readFileSync(path.join(root, '_data/catalog.yml'), 'utf8')) ?? [];
const labs = fs.readdirSync(path.join(root, 'content/labs')).filter((name) => name.endsWith('.yaml')).map((name) => yaml.parse(fs.readFileSync(path.join(root, 'content/labs', name), 'utf8')));
let errors = 0;
for (const record of records.filter((item) => item.classification === 'Official')) {
  const referencing = labs.filter((lab) => record.lab_ids.includes(lab.id));
  if (!referencing.length) continue;
  if (new URL(record.url).hostname === 'www.npmjs.com') {
    console.log(`Skipping registry probe (403 anti-bot response): ${record.url}`);
    continue;
  }
  let response;
  try { response = await fetch(record.url, { method: 'GET', redirect: 'follow', headers: { 'user-agent': 'tdk-labs-link-check/1.0' } }); } catch { response = null; }
  if (response?.status === 403 || response?.status === 405) {
    try { response = await fetch(record.url, { method: 'HEAD', redirect: 'follow', headers: { 'user-agent': 'Mozilla/5.0 tdk-labs-link-check/1.0' } }); } catch { response = null; }
  }
  if (!response || !response.ok) { console.error(`Official URL failed (${response?.status ?? 'network error'}): ${record.url}; labs: ${referencing.map((lab) => lab.id).join(', ')}`); errors++; }
}
if (errors) process.exitCode = 1;
else console.log('Official catalog links used by labs are reachable.');
