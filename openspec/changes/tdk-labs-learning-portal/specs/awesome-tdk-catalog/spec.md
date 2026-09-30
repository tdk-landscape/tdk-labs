## ADDED Requirements

### Requirement: Catalog synchronization
The site build SHALL generate catalog data from the awesome-tdk-framework README containing each item's title, section, classification, URL, and linked lab IDs.

#### Scenario: Build catalog data
- **WHEN** catalog synchronization processes the upstream README
- **THEN** it emits structured catalog records for recognized entries and their section membership

#### Scenario: Upstream format is unrecognized
- **WHEN** a required catalog section or entry cannot be parsed
- **THEN** synchronization fails with an actionable error instead of silently omitting the content

### Requirement: Catalog classifications
The catalog SHALL distinguish Official, Community, and Archived entries, and Archived entries SHALL be available through a catalog filter.

#### Scenario: Filter archived items
- **WHEN** a learner enables the Archived filter
- **THEN** archived entries are shown with their archived classification

#### Scenario: Browse official and community entries
- **WHEN** a learner opens the catalog
- **THEN** official and community entries are labeled distinctly and link to their upstream URLs

### Requirement: Validate official links used by labs
Build validation SHALL check official catalog URLs referenced by labs and fail when such a URL returns an HTTP error.

#### Scenario: Official source URL is broken
- **WHEN** validation checks an official URL used by a lab and receives an HTTP error
- **THEN** the build fails and identifies the URL and referencing lab
