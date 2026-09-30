import fs from 'node:fs';
import path from 'node:path';
import yaml from 'yaml';
const root = path.resolve(import.meta.dirname, '..');
const tracks = yaml.parse(fs.readFileSync(path.join(root, 'content/tracks.yaml'), 'utf8'));
fs.writeFileSync(path.join(root, '_data/tracks.yml'), yaml.stringify(tracks));
console.log(`Wrote ${tracks.length} tracks.`);
