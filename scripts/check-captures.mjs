import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { spawnSync } from 'node:child_process';
import yaml from 'yaml';
const root = path.resolve(import.meta.dirname, '..');
const dir = path.join(root, 'content/labs');
const files = fs.readdirSync(dir).filter((name) => name.endsWith('.yaml'));
let failed = false;
for (const name of files) {
  const lab = yaml.parse(fs.readFileSync(path.join(dir, name), 'utf8'));
  if (!lab.capture_verified) { console.error(`${lab.id}: capture is pending`); failed = true; continue; }
  const temporary = fs.mkdtempSync(path.join(os.tmpdir(), 'tdk-labs-check-'));
  const copy = path.join(temporary, 'content');
  fs.cpSync(path.join(root, 'content'), copy, { recursive: true });
  const result = spawnSync('node', [path.join(root, 'scripts/capture-lab.mjs'), lab.id], { encoding: 'utf8', env: { ...process.env, TDK_CAPTURE_CONTENT_DIR: copy } });
  fs.rmSync(temporary, { recursive: true, force: true });
  if (result.status !== 0) { console.error(result.stderr || result.stdout); failed = true; continue; }
}
if (failed) process.exitCode = 1;
else console.log('All verified captures match a fresh pinned-version capture.');
