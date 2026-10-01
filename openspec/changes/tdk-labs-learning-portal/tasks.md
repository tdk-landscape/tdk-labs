## 1. Repository and content foundation

- [x] 1.1 Create the standalone public `tdk-labs` repository with the static-site framework used by `tdk-website` and establish its deployment path.
- [x] 1.2 Define and validate YAML schemas for lab and track content, including replay mode, sources, steps, files, and runbooks.
- [x] 1.3 Add the track definitions and initial lab records for labs 01–03, leaving captured output unverified until produced by the capture tool.

## 2. Transcript capture and catalog

- [ ] 2.1 Implement isolated Docker capture at each lab's pinned CLI version and write actual stdout to lab content.
- [x] 2.2 Add capture comparison checks that report changed steps and fail CI on drift.
- [x] 2.3 Implement awesome-tdk README synchronization into catalog data with official/community/archived classifications and lab links.
- [x] 2.4 Validate official catalog URLs used by labs and report broken references with their lab IDs.

## 3. Learning portal and player

- [ ] 3.1 Inspect `tdk-website` sandbox terminal and extract a shared player component while preserving existing `/sandbox` behavior and CSS hooks.
- [x] 3.2 Implement lab routes and replay state with Step, Play all, Reset, counter, title, status, command, and captured output.
- [x] 3.3 Add explanations, files-written deltas, source links, and copyable local runbooks for each lab.
- [x] 3.4 Implement Space/P/R shortcuts outside editable controls and honor reduced-motion preferences.
- [x] 3.5 Build track navigation and the catalog page with classifications, archived filtering, and linked labs.

## 4. P0 verification and publication

- [ ] 4.1 Capture and verify the P0 transcript for CLI version/doctor, project scaffold, and backend resource creation at an explicitly pinned release.
- [ ] 4.2 Verify the P0 acceptance criteria, including replay labeling, catalog links, runbook commands, and reduced-motion behavior.
- [x] 4.3 Configure static deployment and publish the P0 portal at the selected URL.

## 5. Curriculum expansion

- [ ] 5.1 Add labs 04–07 for frontend resources, PSR inspection, stack replay, and example landscapes.
- [ ] 5.2 Add labs 08–11 for service.json, phases, AGENTS.md, and catalog contribution.
- [x] 5.3 Enable release-triggered capture refresh and CI validation for the expanded curriculum.
