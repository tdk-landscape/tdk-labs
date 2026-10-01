import fs from 'node:fs';
import path from 'node:path';
import yaml from 'yaml';

const root = path.resolve(import.meta.dirname, '..');
const sourceDir = path.join(root, 'content/labs');
const routeRoot = path.join(root, 'labs');
const labFiles = fs.readdirSync(sourceDir).filter((name) => name.endsWith('.yaml')).sort();

for (const file of labFiles) {
  const lab = yaml.parse(fs.readFileSync(path.join(sourceDir, file), 'utf8'));
  const routeDir = path.join(routeRoot, lab.id);
  fs.mkdirSync(routeDir, { recursive: true });
  const page = {
    ...lab,
    layout: 'lab',
    lab_id: lab.id,
    description: lab.steps[0]?.explain ?? `Step through ${lab.title}.`,
    permalink: `/labs/${lab.id}/`
  };
  const frontMatter = yaml.stringify(page).trimEnd();
  fs.writeFileSync(path.join(routeDir, 'index.html'), `---\n${frontMatter}\n---\n<!-- Generated from content/labs/${file}. -->\n`);
}
console.log(`Generated ${labFiles.length} Jekyll lab routes.`);
