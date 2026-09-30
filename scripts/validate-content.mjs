import { readLabs, readYaml, root, fail } from './lib.mjs';
import fs from 'node:fs';
import path from 'node:path';

const schema = JSON.parse(fs.readFileSync(path.join(root, 'schemas/lab.schema.json'), 'utf8'));
const ids = new Set();
let problems = 0;
for (const { file, data } of readLabs()) {
  const label = path.basename(file);
  if (!data || typeof data !== 'object') { console.error(`${label}: expected an object`); problems++; continue; }
  for (const key of schema.required) if (data[key] === undefined) { console.error(`${label}: missing ${key}`); problems++; }
  if (ids.has(data.id)) { console.error(`${label}: duplicate lab id ${data.id}`); problems++; }
  ids.add(data.id);
  if (!['replay'].includes(data.mode)) { console.error(`${label}: mode must be replay`); problems++; }
  if (!Array.isArray(data.steps) || !data.steps.length) { console.error(`${label}: steps must contain at least one step`); problems++; continue; }
  const stepIds = new Set();
  for (const [index, step] of data.steps.entries()) {
    for (const key of ['id', 'cmd', 'out', 'explain', 'files']) if (step[key] === undefined) { console.error(`${label}: step ${index + 1} missing ${key}`); problems++; }
    if (stepIds.has(step.id)) { console.error(`${label}: duplicate step id ${step.id}`); problems++; }
    stepIds.add(step.id);
    if (!Array.isArray(step.files)) { console.error(`${label}: step ${step.id} files must be an array`); problems++; }
  }
  for (const key of ['needs', 'install', 'live']) if (data.runbook?.[key] === undefined) { console.error(`${label}: runbook missing ${key}`); problems++; }
}
const tracks = readYaml(path.join(root, 'content/tracks.yaml'));
const trackIds = new Set((tracks ?? []).map((track) => track.id));
for (const { file, data } of readLabs()) if (!trackIds.has(data.track)) { console.error(`${path.basename(file)}: unknown track ${data.track}`); problems++; }
if (problems) { fail(`${problems} content issue(s)`); } else console.log(`Validated ${ids.size} labs and ${trackIds.size} tracks.`);
