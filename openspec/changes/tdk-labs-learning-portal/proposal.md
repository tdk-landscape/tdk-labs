## Why

TDK has documentation, examples, and a sandbox tour, but learners lack an ordered path that turns the existing catalog into short, reproducible lessons. TDK Labs will provide that path through captured, step-by-step CLI transcripts that explain each command and show its file effects.

## What Changes

- Create a static learning portal organized into tracks, lab lessons, a replay player, and a catalog sourced from awesome-tdk-framework.
- Define replay labs as version-pinned, captured command transcripts with explanations, file deltas, official source links, and copyable local runbooks.
- Deliver P0 with the shared sandbox/player experience and labs 01–03, plus catalog synchronization and validation.
- Establish later phases for labs 04–11, capture-on-release CI, and an optional future live-container attachment.
- Explicitly state replay limitations, supported environments, and the exclusion of native Windows `tdk up` claims.

## Capabilities

### New Capabilities
- `tdk-lab-learning`: Track navigation, replay lessons, step controls, transcript content, and local runbooks.
- `awesome-tdk-catalog`: Synchronization and presentation of official, community, and archived catalog entries with lab links.
- `lab-transcript-capture`: Version-pinned transcript capture and drift validation for published lessons.

### Modified Capabilities

## Impact

- New public `tdk/tdk-labs` repository and static website deployment path.
- Reuse/extraction of the existing sandbox terminal component and CSS hooks from `tdk-website`.
- Reads awesome-tdk-framework README data and official TDK documentation URLs.
- Uses Docker for maintainer-side transcript capture; v1 hosts static replay only.
- Adds YAML lab/track content, generated catalog data, and CI checks for schema, capture consistency, and official URL availability.
