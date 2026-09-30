import fs from 'node:fs';
import path from 'node:path';
import yaml from 'yaml';

export const root = path.resolve(import.meta.dirname, '..');
export const labDir = path.join(root, 'content/labs');
export function readYaml(file) { return yaml.parse(fs.readFileSync(file, 'utf8')); }
export function readLabs() {
  return fs.readdirSync(labDir).filter((name) => name.endsWith('.yaml')).sort().map((name) => ({ file: path.join(labDir, name), data: readYaml(path.join(labDir, name)) }));
}
export function fail(message) { console.error(`tdk-labs: ${message}`); process.exitCode = 1; }
