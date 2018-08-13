# PolTrack Client

Help us build **PolTrack.org**, the next generation of [Congressional Report Cards](https://www.vis.org/crc/).

The purpose of this __non-partisan__ tool is to promote understanding of the actions of our elected representatives and of the effects those actions have on our lives.

## Main Features

1. Tracking of verifiable actions (not promises) of our elected officials (initially the U.S. Congress and the President).
2. Repository of information about the politicians' actions from a variety of sources (crowd-sourced).
3. Easy-to-use, configurable report cards for each politician.
4. [and more](https://www.vis.org/other/poltrackintro.aspx).

## Stack

* Angular
* NgRx
* Angular Material
* Bootstrap 4 (only reset, utils and grids)
* Blockchain
* Azure

## Getting Started

```bash
git clone https://github.com/vis/poltrack.git
cd poltrack
npm install
npm start
```

Poltrack client expects [poltrack test server](https://github.com/vis/poltrack-test-server) to be running at `localhost:7071`.

## Useful Commands

* `npm start` - starts a dev server with poltrack available at `localhost:4200`
* `npm run test` - runs lint and tests
* `npm run watch` - runs tests in watch mode
* `npm run prod` - runs full prod build and serves prod bundle
* `npm run prettier` - runs prettier to format whole code base (`.ts` and `.scss`)
* `npm run analyze` - runs full prod build and `webpack-bundle-analyzer` to visualize how much code is shipped (dependencies & application)

## Contributing to this Project

* [Defect/Issue Tracking](https://github.com/vis/poltrack/issues)
* [Contributor's Guide](./CONTRIBUTING.md)
* [Contributor Code of Conduct](./CODE_OF_CONDUCT.md)

## References

* ["Best Practices" by Tomas Trajan, SEED project author: architecture, build process, etc.](https://medium.com/@tomastrajan/6-best-practices-pro-tips-for-angular-cli-better-developer-experience-7b328bc9db81)
* [Angular Coding Style Guide](https://angular.io/guide/styleguide)
* [Angular NgRx & Angular Material Starter Project README](./README_SEED.md)

## Acknowledgements

Architecture and design based on [Angular NgRx & Angular Material Starter Project](https://github.com/tomastrajan/angular-ngrx-material-starter) by [Tomas Trajan](https://medium.com/@tomastrajan).