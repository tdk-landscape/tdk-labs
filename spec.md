# TDK Labs — updated spec

**Name:** `tdk-labs`  
**Purpose:** A learning portal where people **see each step** of running TDK, then copy the same commands. Curriculum data comes from [awesome-tdk-framework](https://github.com/tdk-landscape/awesome-tdk-framework). The teaching surface is the existing website sandbox terminal (Play all / Step / Reset).

This spec replaces the earlier draft. It does not cover Windows release PR #199.

---

## 1. Problem

TDK already has docs, examples, awesome-tdk, and a sandbox tour with real captured CLI output. What is missing is a **path**: ordered labs, one command per step, file deltas visible, catalog items turned into lessons instead of a link dump.

---

## 2. Goals / non-goals

**Goals**

- First sitting: `tdk --version` → `tdk project --yes` → `tdk resource` in the player.
- Every lab is a stepped transcript: `step n/total`, Play all / Step / Reset.
- awesome-tdk is the index of materials; labs point at catalog entries, they do not fork the README.
- Default mode is **replay** (static, GitHub Pages). **Live Docker** is a copy-block, not hosted compute in v1.

**Non-goals**

- Cloud IDE, `tdk up` inside the browser, 100-service ERP in CI, LMS accounts.
- Claiming native Windows `tdk up` from a lab replay.

---

## 3. Product

```
Home → Tracks → Lab player → Catalog (awesome-tdk) → Run on your machine
```

### Lab player (required UX)

Reuse the sandbox chrome:

- Title: `tdk · labs · <lab-id>`
- Status: `idle` | `playing` (accent `#7c4dff`)
- Body: `$` prompt, command, stdout, caret
- Controls: Play all, Step, Reset
- Hint: `step n/total · press step to advance`

New panes:

- **What happened** — 1–3 sentences
- **Files written** — tree delta
- **Source** — awesome-tdk section + docs URL
- **Run for real** — copy-paste local commands + official `docker run` one-liner

Keyboard: Space = step, P = play all, R = reset.  
`prefers-reduced-motion`: no typewriter.

### Tracks (mapped from awesome-tdk)

| Track | Catalog section | First labs |
|---|---|---|
| Foundations | Start here, Core | version, doctor, install |
| PSR | Docs / core | `tdk project --yes`, stacks, resources |
| First service | Core CLI | `tdk resource` backend + frontend |
| Run a stack | Quickstart | `tdk up`, `networks`, `down` (replay only; Tilt UI is a note) |
| Example landscapes | Examples / starters | `tdk project example`, restaurant, saas |
| Architecture | Learning and articles | `service.json`, phases, AGENTS.md |
| Scale & CI | CI and benchmarks | links + recorded facts; no live 100-svc |
| Contribute | Extensions / CONTRIBUTING | how to add a catalog item |

Official items are required reading. Community = optional cards. Archived = catalog filter only.

---

## 4. Content contract

### Lab YAML

```yaml
id: 01-scaffold-project
title: Scaffold a project
track: foundations
level: beginner
duration_min: 8
cli_version: "1.1.0"    # pinned capture
mode: replay            # replay only in v1
source:
  catalog: [start-here, core-framework-and-releases]
  docs: https://tdk-landscape.github.io/tdk-website/docs/quickstart/
terminal:
  title: tdk · labs · scaffold
  phase: pre-alpha
steps:
  - id: version
    cmd: tdk --version
    out: |
      1.1.0
    explain: Confirm the CLI on PATH. Labs pin the captured version.
    files: []
  - id: project
    cmd: tdk project --yes
    out: |
      [✓] Generated: .tdk/.tdk-out/Tiltfile
      [✓] Generated: .tdk/.tdk-out/spec.master
      [✓] Vendored TDK extension → .tdk/.tdk-out/tdk-cli-ext/
      [✓] Project configuration complete!
    explain: Writes the PSR skeleton so later commands have a project root.
    files:
      - .tdk/project.json
      - .tdk/.tdk-out/Tiltfile
  - id: resource-api
    cmd: tdk resource api --type backend --stack pre-alpha --path services/pre-alpha/api
    out: |
      generating Dockerfile
      writing backend source
      writing tests
      resource created  →  services/pre-alpha/api  (6 files)
    explain: One resource = service.json + Dockerfile + starter + tests.
    files:
      - services/pre-alpha/api/service.json
      - services/pre-alpha/api/Dockerfile
      - services/pre-alpha/api/src/index.ts
runbook:
  needs: [Docker, Tilt]
  install: npm i -g @tdk-landscape/tdk-cli-core
  live: docker run --rm -it --entrypoint sh tdk-landscape/tdk-cli-releases:latest
```

Rules:

- `out` is captured from an isolated container at `cli_version`, not invented.
- CI re-captures on CLI release tags; drift fails the build.
- Labs never paste full blog posts; two-line purpose + link.

### Catalog sync

Nightly / build: parse awesome-tdk README → `catalog.json` (title, section, Official|Community|Archived, url, linked lab ids). CI fails on 404 for Official URLs used by labs.

---

## 5. v1 lab list

| ID | Title | Teaches |
|---|---|---|
| 01 | Is TDK installed? | `--version`, `doctor` |
| 02 | Scaffold the project | `tdk project --yes` |
| 03 | Add a backend | `tdk resource … --type backend` |
| 04 | Add a frontend | `tdk resource … --type frontend` |
| 05 | Inspect PSR | `tdk stacks --services`, `tdk resources --ports` |
| 06 | Boot one stack | `tdk up`, `networks`, `down` (replay + “open Tilt at :10350”) |
| 07 | Example landscape | `tdk project example` |
| 08 | Read `service.json` | features, port, stack |
| 09 | Phases | pre_alpha / alpha / beta |
| 10 | AGENTS.md | generated don’t-edit contract |
| 11 | Add a catalog entry | awesome-tdk CONTRIBUTING |

P0 ships **01–03** using the existing 7-step sandbox transcript. Player component is extracted from `sb-term-*` so `/sandbox` and `/labs/:id` share one widget.

---

## 6. Implementation

**Stack:** same as `tdk-website` (static). Host `/labs` on the website or `tdk-landscape.github.io/tdk-labs/`.

**Component:** `<tdk-lab-player lab-id>` with the existing CSS hooks (`sb-term-col`, `sb-term-bar`, `sb-term-dot`, `sb-term-title`, `sb-term-status`, `sb-term-body`, `sb-prompt`, `sb-cmd`, `sb-out`, `sb-caret`, `data-js="play-all|step|reset"`).

**Replay state:** `idle → playing → idle`; Step pauses after one command; Reset → step 0.

**Repo**

```
tdk-labs/
  spec.md
  content/labs/*.yaml
  content/tracks.yaml
  scripts/sync-awesome-tdk.ts
  scripts/capture-lab.ts
  src/components/LabPlayer.*
  src/pages/labs/[id].*
  src/pages/catalog.*
```

**Capture**

```
scripts/capture-lab.ts
  docker run tdk-cli-releases (pinned tag)
  run YAML cmds
  write stdout back into steps[].out
```

---

## 7. Acceptance (P0)

1. `/labs/01-scaffold-project` steps version → project → resource with the sandbox control chrome.
2. Counter and `idle`/`playing` status work.
3. Output matches a pinned CLI capture.
4. Catalog page lists awesome-tdk sections with labels and lab links.
5. Each lab has a copy-paste runbook including the docker one-liner.
6. Reduced-motion: instant commands.

---

## 8. Phases

| Phase | Ships |
|---|---|
| P0 | Player + labs 01–03 + catalog sync |
| P1 | Labs 04–07, file tree, runbooks |
| P2 | 08–11, capture-on-release CI |
| P3 | Optional live container attach (not a Codespaces clone) |

---

## 9. Explicit non-claims

- A lab replay of `tdk up` is not a running stack.
- awesome-tdk is an index, not lesson prose.
- Windows native `tdk up` is out of scope for labs; WSL2 / Docker Desktop notes belong in the runbook only where official docs already say so.