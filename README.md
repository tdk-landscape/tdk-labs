# TDK Labs

An ordered, replayable learning portal for TDK. Lessons show captured CLI output, explain each command, and list the files it writes. Browser replay is static: it does not execute TDK or launch Docker.

## Local development

Requirements: Node.js 22+, Ruby 3.4+, Bundler 2.6+, and npm.

```sh
npm ci
bundle install
npm run sync:catalog
npm run sync:content
npm run validate
npm run check:links
bundle exec jekyll serve
```

## Captures

Captures use an isolated, version-tagged image named `tdk-landscape/tdk-cli-releases:<cli_version>`. That image is not currently published, so labs 02 and 03 are marked pending and their player controls are disabled. Do not replace pending transcript output with estimates. Once the image is available:

```sh
npm run capture -- 02-scaffold --write
npm run capture -- 03-backend --write
npm run check:capture
```

Set `TDK_CAPTURE_IMAGE` to use a compatible image repository. Captures fail if the image's CLI version does not match the lab pin.

## Publish

The public repository is [tdk-landscape/tdk-labs](https://github.com/tdk-landscape/tdk-labs). GitHub Pages deploys from `.github/workflows/pages.yml` at <https://tdk-landscape.github.io/tdk-labs/>.

The P0 portal includes labs 01–03 and the catalog. Lab 01 has a local-source capture; project/resource generation captures remain pending until the isolated Docker image is available.
