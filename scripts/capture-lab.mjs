import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { spawnSync } from 'node:child_process';
import yaml from 'yaml';
import { root } from './lib.mjs';

const args = process.argv.slice(2);
const id = args.find((arg) => !arg.startsWith('--'));
const write = args.includes('--write');
if (!id) throw new Error('Usage: npm run capture -- <lab-id> [--write]');
const contentDir = process.env.TDK_CAPTURE_CONTENT_DIR ?? path.join(root, 'content');
const file = path.join(contentDir, 'labs', `${id}.yaml`);
const lab = yaml.parse(fs.readFileSync(file, 'utf8'));
const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'tdk-lab-'));
const image = process.env.TDK_CAPTURE_IMAGE ?? 'tdk-landscape/tdk-cli-releases';
const tag = lab.cli_version;
const docker = spawnSync('docker', ['run', '--rm', '-v', `${temp}:/workspace`, '-w', '/workspace', image + ':' + tag, 'sh', '-lc', 'command -v tdk >/dev/null || { echo "tdk CLI missing from capture image" >&2; exit 127; }; test "$(tdk --version)" = "' + tag + '"'], { encoding: 'utf8' });
if (docker.status !== 0) {
  console.error(`Docker capture image unavailable or failed: ${image}:${tag}\n${docker.stderr || docker.stdout}`);
  process.exit(docker.status || 1);
}
const outputs = [];
for (const step of lab.steps) {
  const run = spawnSync('docker', ['run', '--rm', '-v', `${temp}:/workspace`, '-w', '/workspace', image + ':' + tag, 'sh', '-lc', step.cmd], { encoding: 'utf8' });
  if (run.status !== 0) {
    console.error(`${id}/${step.id} failed (exit ${run.status})\n${run.stderr}`);
    process.exit(run.status || 1);
  }
  outputs.push({ ...step, out: run.stdout.replace(/\n+$/, ''), verified: true });
}
if (write) {
  lab.steps = outputs;
  lab.capture_source = 'docker';
  lab.capture_verified = true;
  fs.writeFileSync(file, yaml.stringify(lab));
} else {
  const changed = outputs.filter((step, index) => step.out !== lab.steps[index]?.out).map((step) => step.id);
  if (changed.length) {
    console.error(`${id}: transcript drift in steps ${changed.join(', ')}; run capture --write to update intentionally.`);
    process.exitCode = 1;
  } else console.log(`${id}: capture matches ${image}:${tag}.`);
}
fs.rmSync(temp, { recursive: true, force: true });
console.log(`Captured ${outputs.length} step(s) for ${id} from ${image}:${tag}.`);
