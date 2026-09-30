## ADDED Requirements

### Requirement: Track-based curriculum navigation
The portal SHALL organize labs into ordered tracks and provide navigation from the home page to tracks, labs, the catalog, and local execution instructions.

#### Scenario: Learner opens a track
- **WHEN** a learner selects a track
- **THEN** the portal shows that track's labs in curriculum order with title, level, and estimated duration

#### Scenario: Learner follows a catalog item
- **WHEN** a catalog entry is linked to one or more labs
- **THEN** the catalog entry exposes those lab links

### Requirement: Replay lab player
Each replay lab SHALL render captured steps in a player with a title, idle/playing status, command prompt, command, stdout, step counter, and Play all, Step, and Reset controls.

#### Scenario: Step through a lab
- **WHEN** the learner activates Step
- **THEN** the player displays exactly the next command and its captured output and updates the step counter

#### Scenario: Play all
- **WHEN** the learner activates Play all
- **THEN** the player presents remaining steps in order, indicates playing status during playback, and returns to idle when playback ends

#### Scenario: Reset a lab
- **WHEN** the learner activates Reset
- **THEN** the player returns to step zero, clears displayed command output, and indicates idle status

#### Scenario: Keyboard controls
- **WHEN** the player has focus and the learner presses Space, P, or R outside an editable control
- **THEN** the player performs Step, Play all, or Reset respectively

#### Scenario: Reduced motion
- **WHEN** the learner has enabled `prefers-reduced-motion`
- **THEN** commands and output appear without typewriter animation

### Requirement: Explanations and file deltas
Every displayed lab step SHALL provide its explanation and a files-written view sourced from that step's structured content.

#### Scenario: Inspect a step's effect
- **WHEN** a step is displayed
- **THEN** the player shows its explanation and the files added or changed by that step

### Requirement: Sources and local runbook
Every lab SHALL identify its awesome-tdk catalog sources and documentation URL and provide copyable local commands plus the official Docker run command required by its runbook.

#### Scenario: Inspect sources and runbook
- **WHEN** a learner opens a lab
- **THEN** the source catalog entries, documentation link, prerequisites, install command, and live Docker command are available

#### Scenario: Explain replay limits
- **WHEN** a lab teaches `tdk up` through captured output
- **THEN** the page identifies the experience as replay and states that no stack has been launched in the browser

### Requirement: Initial learning path
P0 SHALL provide the first three labs covering CLI version/doctor, project scaffolding, and adding a backend resource.

#### Scenario: First sitting path
- **WHEN** a learner follows the P0 path from the beginning
- **THEN** the lessons progress from checking TDK installation to `tdk project --yes` and then creating a backend resource

### Requirement: Platform support claims
Labs SHALL NOT claim native Windows `tdk up` support; Windows guidance SHALL be limited to WSL2/Docker Desktop notes supported by official documentation.

#### Scenario: Windows runbook guidance
- **WHEN** a lab includes Windows runbook notes
- **THEN** those notes link to or accurately reflect official TDK documentation and do not claim native Windows `tdk up`
