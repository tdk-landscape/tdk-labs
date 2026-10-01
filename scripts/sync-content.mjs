import fs from 'node:fs';
import path from 'node:path';
import yaml from 'yaml';
const root = path.resolve(import.meta.dirname, '..');
const tracks = yaml.parse(fs.readFileSync(path.join(root, 'content/tracks.yaml'), 'utf8'));
const labDir = path.join(root, 'content/labs');
const labs = fs.readdirSync(labDir).filter((name) => name.endsWith('.yaml')).sort().map((name) => {
  const lab = yaml.parse(fs.readFileSync(path.join(labDir, name), 'utf8'));
  return { ...lab, lab_id: lab.id, url: `/labs/${lab.id}/` };
});
fs.writeFileSync(path.join(root, '_data/tracks.yml'), yaml.stringify(tracks));
fs.writeFileSync(path.join(root, '_data/labs.yml'), yaml.stringify(labs));
console.log(`Wrote ${tracks.length} tracks and ${labs.length} labs.`);
