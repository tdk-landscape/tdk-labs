## Context

The supplied TDK Labs brief defines a static learning portal that turns the awesome-tdk-framework index and existing sandbox transcript into an ordered, replayable curriculum. The requested repository is new, so this proposal establishes its product contract before implementation. The existing TDK website is the reference for static hosting and sandbox chrome; its current framework and component implementation must be inspected during implementation.

## Goals / Non-Goals

**Goals:**
- Make each lab a deterministic replay of captured CLI output, with one command per step.
- Keep curriculum content structured and separate from the player implementation.
- Keep catalog entries linked to their upstream source rather than duplicating lesson prose.
- Provide a credible local runbook while making clear that replay is not hosted execution.
- Ship the first three labs and catalog in P0.

**Non-Goals:**
- Hosted Docker, browser shells, LMS accounts, or a cloud IDE in v1.
- Running a large service landscape in CI.
- Claiming that a replayed `tdk up` starts a live stack or that native Windows `tdk up` is supported.
- Reproducing full blog posts from the catalog.

## Decisions

1. **Static replay is the v1 runtime.** Serve pre-captured output and file deltas from static content. This keeps public hosting inexpensive and safe, and avoids implying that browser controls execute commands. Live Docker attachment remains a separately scoped future phase.

2. **Lab YAML is the content source of truth.** Each lab records its stable ID, title, track, difficulty, duration, pinned CLI version, source links, steps, output, explanation, changed files, and runbook. Validate YAML against a schema at build time so malformed content does not reach the site.

3. **Capture output in an isolated, pinned container.** A maintainer script runs each step against the requested CLI release and writes captured stdout back into lab content. CI verifies captures against the pinned version; release automation can refresh captures when a release is intentionally adopted. Never hand-author expected command output as if it were captured evidence.

4. **Derive the catalog from upstream awesome-tdk-framework.** Synchronize title, section, classification, URL, and linked lab IDs into generated catalog data. Preserve official/community/archived distinctions. Fail validation for broken official URLs referenced by labs; allow archived entries to remain filterable without presenting them as current recommendations.

5. **Extract a framework-neutral shared player from the sandbox terminal.** Keep the specified `sb-term-*` hooks and controls compatible with both `/sandbox` and `/labs/:id`, while data and routing remain separate. Inspect the actual website stack before selecting component syntax or build tooling.

6. **P0 scope is labs 01–03.** The first-session path covers version/doctor, project scaffolding, and adding a backend resource. Remaining lessons follow the supplied P1/P2 sequence. The authored transcript's example `cli_version` is a pinned capture claim and must be checked against the actual supported release when capturing.

7. **Keyboard and motion behavior are part of the player contract.** Space advances one step, P plays all, R resets; reduced-motion users receive instant command presentation. Keyboard shortcuts must not interfere with normal typing in editable controls.

## Risks / Trade-offs

- **Upstream catalog format changes** → keep parsing isolated, validate generated records, and fail with a useful error when required sections cannot be identified.
- **CLI output drifts across releases** → pin each lab's CLI version and require explicit recapture/update when adopting a new release.
- **Sandbox extraction breaks existing tour behavior** → preserve existing selectors and verify both sandbox and labs routes during implementation.
- **Static replay may be mistaken for live execution** → label replay mode, describe captured output, and state that `tdk up` lessons do not launch a stack.
- **Official URLs can be temporarily unavailable** → make link checks report the URL and source item; avoid silently dropping official entries.

## Migration Plan

No existing production data migration is required. Build the new static repository alongside the existing website, validate P0 content and shared player behavior, then publish at the selected `/labs` or GitHub Pages path. Rollback consists of reverting the site deployment or removing its route; static content can remain in the repository.

## Open Questions

- Should the production URL be integrated into `tdk-website` at `/labs`, or hosted as `tdk-landscape.github.io/tdk-labs/`?
- Which existing `tdk-website` sandbox implementation and CLI release are authoritative for component extraction and P0 capture?
- Should catalog sync run nightly, on every build, or both? The brief permits nightly/build sync; implementation should choose based on upstream availability and CI reliability.
- Which exact Docker image tag and supported CLI release should be used for the first verified captures?
