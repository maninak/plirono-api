# Plirono API

## Table of Contents
- [Description](#description)
    - [Technologies](#technologies)
- [Dependencies](#dependencies)
- [Deploy](#deploy)
- [Develop](#develop)
    - [Contribution](#contribution)
    - [Launch Scripts](#launch-scripts)
    - [Environment](#environment)
    - [Helpful Resources](#helpful-resources)

----------

## Description

An *Application Programming Interface* ([API](https://en.wikipedia.org/wiki/Application_programming_interface)) paired with a *web server* that together expose the Plirono database to other Plirono applications and the world.

### Technologies

This is a [Node.js](https://nodejs.org/) project written in [Typescript](http://www.typescriptlang.org/) and built with the help of [gulp](http://gulpjs.com/). The API is served by an [Express](http://expressjs.com/) web server and is designed to connect to a [MongoDB](https://www.mongodb.com/) database (see [_#Environment_](#environment) for more). The database schema validation and connection with the database is achieved with [mongoose](http://mongoosejs.com/). Project tests are run by [Mocha](https://mochajs.org/) against the [Chai](http://chaijs.com/) assertion library.

# Dependencies

In order to launch Plirono API for production or development the following software must be installed on the machine:

1. **Node.js** v6.9.2 or greater [[Download](https://nodejs.org/en/download/)]
	1.1. If you already have another node version installed you can use the tool [n](https://www.npmjs.com/package/n) to download additional node versions and easily switch between them
2. **Git** [[Download](https://git-scm.com/download)]
3. **MongoDB** [[Download](https://www.mongodb.com/download-center?jmp=nav)]

## Deploy

To deploy in production copy and paste the following combined command in your Unix terminal:

`git@gitlab.omnixell.com:maninak/plirono-api.git && cd plirono-api && npm i --only=production && npm build && cp ./env/prod.template.env ./env/.env && npm start`

This will:
1. clone the source code
2. change into the source code directory
3. install project dependencies
4. build source code
5. copy production environment variables (feel free to edit file `/env/.env` afterwards to suite your configuration needs)
6.  launch Plirono API

## Develop

You can get set-up for development by copy-pasting the following three commands in three (3) **separate** Unix terminals:

#### Terminal 1:

`git@gitlab.omnixell.com:maninak/plirono-api.git && cd plirono-api && npm i && cp ./env/dev.template.env ./env/.env && npm run watch`

This will:
1. clone the source code
2. change into the source code directory
3. install project dependencies
4. copy development environment variables (feel free to edit file `/env/.env` afterwards to suite your configuration needs)
6.  launch watch task which upon each source code change will:
    * delete `dist` folder that contains the resulting files of a previous build (this folder is *NOT* version-controlled)
    * run a linter against all `.ts` files, as per the rules specified in `tslint.json`
    * copy any assets from `src/assets` into `dist/src/assets`
    * transpile all `.ts` file to `.js` and `.js.map` files and place into the `dist` folder
    * run all tests found in the `test` folder

#### Terminal  2: 

`npm run localmongo`

This will create and use a `mongo-test` folder the project root and then launch a `mongod` mongoDB demon that uses this folder as the db directory. This folder is *NOT* version-controlled.

#### Terminal 3:

`npm run demon`

This will launch the API web server using [nodemon](https://nodemon.io/) instead of node, with the environment variable `DEBUG=prn-*` set by default to display all plirono-namespace debug messages and restart the API automatically upon each code change.

### Contribution

#### Commit Guidelines

We have very precise rules over how our git commit messages can be formatted.  This leads to **more readable messages** that are easy to follow when looking through the **project history**.  But also, we use the git commit messages to **automatically generate the change log**.

You can read more about the git commit guidelines in [`CONTRIBUTING.md`](http://gitlab.omnixell.com/maninak/plirono-api/blob/master/CONTRIBUTING.md) found in project root.

Upon npm install, a `commit-msg` git hook is automatically installed that lints commit messages as per the rules defined in the `CONTRIBUTING.md`.

##### Commit Message Convention, at a Glance

_patches:_

```sh
git commit -a -m "fix(parsing): fix a bug in the parser"
```

_features:_

```sh
git commit -a -m "feat(parser): implement new parser \o/"
```

_breaking changes:_

```sh
git commit -a -m "feat(new-parser): introduce a new parsing library
BREAKING CHANGE: new library does not support foo-construct"
```

_other changes:_

You decide, e.g., docs, chore, etc.

```sh
git commit -a -m "docs: fixed up the docs a bit"
```

#### Git Flow

We use [git flow](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow) (with default settings) to create feature, bugfix, etc branches.

Git flow can be practiced manually, but to make your life easy it's best to use automated tools that support it like [GitKraken](https://www.gitkraken.com/) or a [command-line tool](https://github.com/nvie/gitflow/wiki/Installation).

#### Release Versioning

Because of the fact that git commit messages are structured, versioning is done automatically using [`conventional-changelog`](https://github.com/conventional-changelog/conventional-changelog). 

Running `npm run release` in your terminal will get the latest available develop, scan its commits, bump bugfix or minor (or none) version number in `package.json` depending on whether there are new features or not, update the `CHANGELOG.md` file with the latest changes since last release and merge everything *locally* in the lastest available master. It then also applies a git-tag with the version number.

If you feel it is needed feel free to make corrections/additions by amending the master commit. If everything looks good, push the master branch upstream with the command
`git checkout master && git push --follow-tags origin master`

## Launch Scripts
The file`package.json` found in root directory contains many useful scripts executed from the teminal with the format `npm run <script_name>`.

Here is a brief description of what each does:

* **`postinstall`** is called automatically upon each `npm install` command and is hooked to a custom script. This script is useful to enforce repository state that all other tools cannot (e.g. install git hooks, apply simple edits on dependencies' source code using sed etc).,
* **`localmongo`** see section [Terminal 2](#terminal-2)
* **`start`** launches the API web server (must have been built first)
* **`demon`** see section [Terminal 3](#terminal-3)
* **`watch`** see (6) in section [Terminal 1](#terminal-1)
* **`build`** builds a production version of the app from source into `dist` folder
* **`build-dev`** builds a development version of the app from source into `dist` folder, including javascript source maps
* **`release`** see section [Release Versioning](#release-versioning)
* **`clean`** deletes `dist` folder
* **`purge`** deletes everything that isn't tracked by git or is ignored by git (useful to fall back to git clone state)

## Environment

Upon launch, the API looks for the file `.env` inside the `env/` folder from which to load environment variables. If none is found, then the application falls back to using hardcoded development values as they exist in the template file `env/dev.template.env`. There is also a suggested production configuration template found in `env/prod.template.env`.

Contrary to the template files, the `env/.env` file (if you create one) is *NOT* version-controlled.

## Helpful Resources

* a preconfigured [`.gitconfig`](https://gist.github.com/maninak/ef1c6d1ec312fa0e3a716688fbc62e59) with useful git aliases and scripts
* nifty Visual Studio Code [settings](https://gist.github.com/maninak/e494d759caa9f04b9bb0d253e8fcf35e)
* helpful Visual Studio Code [plugin set](https://gist.github.com/maninak/3d01c9639a1f1271698f1ef6c4743e73) you can import using [this vscode plugin](https://marketplace.visualstudio.com/items?itemName=Shan.code-settings-sync)
