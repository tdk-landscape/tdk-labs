## ADDED Requirements

### Requirement: Structured version-pinned lab content
Each lab SHALL be represented as structured content with a stable ID, title, track, level, duration, pinned CLI version, replay mode, source references, terminal metadata, ordered steps, and runbook.

#### Scenario: Validate a lab record
- **WHEN** the site build loads a lab record
- **THEN** it validates required metadata, unique step IDs, command/output fields, explanations, file lists, and runbook fields

### Requirement: Capture transcripts from isolated CLI releases
The capture tool SHALL execute lab commands in an isolated container using the lab's pinned CLI version and record actual stdout into the corresponding step output.

#### Scenario: Capture a pinned lab
- **WHEN** a maintainer runs capture for a lab
- **THEN** commands run in order against the configured pinned CLI container and captured stdout is written to the matching steps

#### Scenario: Capture command fails
- **WHEN** a command exits unsuccessfully
- **THEN** capture reports the failing lab step and exits unsuccessfully without marking later output as verified

### Requirement: Detect transcript drift
Continuous integration SHALL detect when captured output differs from a fresh capture at the lab's pinned CLI version.

#### Scenario: Output has drifted
- **WHEN** a pinned-version recapture differs from committed output
- **THEN** CI fails and identifies the lab steps whose output changed

#### Scenario: Adopt a new CLI release
- **WHEN** maintainers intentionally update a lab's pinned CLI version
- **THEN** they commit the refreshed captures and the associated version change together
