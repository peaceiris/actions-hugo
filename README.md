## GitHub Actions for Hugo

<img width="400" alt="GitHub Actions for Hugo" src="./images/ogp.svg">

[![license](https://img.shields.io/github/license/peaceiris/actions-hugo.svg)](https://github.com/peaceiris/actions-hugo/blob/main/LICENSE)
[![release](https://img.shields.io/github/release/peaceiris/actions-hugo.svg)](https://github.com/peaceiris/actions-hugo/releases/latest)
[![GitHub release date](https://img.shields.io/github/release-date/peaceiris/actions-hugo.svg)](https://github.com/peaceiris/actions-hugo/releases)
[![Release Feed](https://img.shields.io/badge/release-feed-yellow)](https://github.com/peaceiris/actions-hugo/releases.atom)
![Test](https://github.com/peaceiris/actions-hugo/workflows/Test/badge.svg?branch=main&event=push)
![Code Scanning](https://github.com/peaceiris/actions-hugo/workflows/Code%20Scanning/badge.svg?event=push)

[![CodeFactor](https://www.codefactor.io/repository/github/peaceiris/actions-hugo/badge)](https://www.codefactor.io/repository/github/peaceiris/actions-hugo)
[![codecov](https://codecov.io/gh/peaceiris/actions-hugo/branch/main/graph/badge.svg)](https://codecov.io/gh/peaceiris/actions-hugo)
[![Maintainability](https://api.codeclimate.com/v1/badges/ebf2eef3a046b396ba9c/maintainability)](https://codeclimate.com/github/peaceiris/actions-hugo/maintainability)

This **Hugo Setup Action** can install [Hugo] to a virtual machine of **GitHub Actions**.
**Hugo extended** version, **Hugo Modules**, Linux (Ubuntu), macOS, and Windows are supported.

[Hugo]: https://github.com/gohugoio/hugo

From `v2`, this Hugo Setup Action has migrated to a JavaScript (TypeScript) action.
We no longer build or pull a Hugo docker image.
Thanks to this change, we can complete this action in less than a few seconds.
(A docker base action was taking about 1 min or more execution time to build and pull a docker image.)

| OS (runs-on) | ubuntu-latest, ubuntu-20.04, ubuntu-22.04 | macos-latest | windows-2019 |
|---|:---:|:---:|:---:|
| Support | ✅️ | ✅️ | ✅️ |

| Hugo type | Hugo Extended | Hugo Modules | Latest Hugo |
|---|:---:|:---:|:---:|
| Support | ✅️ | ✅️ | ✅️ |



## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Getting started](#getting-started)
  - [⭐️ Create your workflow](#%EF%B8%8F-create-your-workflow)
- [Options](#options)
  - [⭐️ Use Hugo extended](#%EF%B8%8F-use-hugo-extended)
  - [⭐️ Use the latest version of Hugo](#%EF%B8%8F-use-the-latest-version-of-hugo)
- [Tips](#tips)
  - [⭐️ Caching Hugo Modules](#%EF%B8%8F-caching-hugo-modules)
  - [⭐️ Read Hugo version from file](#%EF%B8%8F-read-hugo-version-from-file)
  - [⭐️ Workflow for autoprefixer and postcss-cli](#%EF%B8%8F-workflow-for-autoprefixer-and-postcss-cli)
  - [⭐️ Workflow for asciidoctor](#%EF%B8%8F-workflow-for-asciidoctor)
  - [⭐️ Non-ascii Filename](#%EF%B8%8F-non-ascii-filename)
- [CHANGELOG](#changelog)
- [License](#license)
- [About Maintainer](#about-maintainer)
- [Maintainer Notes](#maintainer-notes)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->



## Getting started

### ⭐️ Create your workflow

An example workflow `.github/workflows/gh-pages.yml` with [GitHub Actions for GitHub Pages].
For the first deployment, we have to do this operation: [First Deployment with `GITHUB_TOKEN` - peaceiris/actions-gh-pages](https://github.com/peaceiris/actions-gh-pages#%EF%B8%8F-first-deployment-with-github_token)

[GitHub Actions for GitHub Pages]: https://github.com/peaceiris/actions-gh-pages

[![peaceiris/actions-gh-pages - GitHub](https://gh-card.dev/repos/peaceiris/actions-gh-pages.svg?fullname)](https://github.com/peaceiris/actions-gh-pages)

```yaml
name: GitHub Pages

on:
  push:
    branches:
      - main  # Set a branch to deploy
  pull_request:

jobs:
  deploy:
    runs-on: ubuntu-22.04
    concurrency:
      group: ${{ github.workflow }}-${{ github.ref }}
    steps:
      - uses: actions/checkout@v3
        with:
          submodules: true  # Fetch Hugo themes (true OR recursive)
          fetch-depth: 0    # Fetch all history for .GitInfo and .Lastmod

      - name: Setup Hugo
        uses: peaceiris/actions-hugo@v2
        with:
          hugo-version: '0.91.2'
          # extended: true

      - name: Build
        run: hugo --minify

      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        if: ${{ github.ref == 'refs/heads/main' }}
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./public
```

<div align="right">
<a href="#table-of-contents">Back to TOC ☝️</a>
</div>



## Options

### ⭐️ Use Hugo extended

Set `extended: true` to use a Hugo extended version.

```yaml
- name: Setup Hugo
  uses: peaceiris/actions-hugo@v2
  with:
    hugo-version: '0.91.2'
    extended: true
```

### ⭐️ Use the latest version of Hugo

Set `hugo-version: 'latest'` to use the latest version of Hugo.

```yaml
- name: Setup Hugo
  uses: peaceiris/actions-hugo@v2
  with:
    hugo-version: 'latest'
```

This action fetches the latest version of Hugo by [hugo | Homebrew Formulae](https://formulae.brew.sh/formula/hugo)

<div align="right">
<a href="#table-of-contents">Back to TOC ☝️</a>
</div>



## Tips

### ⭐️ Caching Hugo Modules

Insert a cache step before site-building as follows.
Note that the cache dir location of Hugo on a Linux-based operating system is `/tmp/hugo_cache`. On macOS, `${TMPDIR}/hugo_cache` has the location.

```yaml
- uses: actions/cache@v2
  with:
    path: /tmp/hugo_cache
    key: ${{ runner.os }}-hugomod-${{ hashFiles('**/go.sum') }}
    restore-keys: |
      ${{ runner.os }}-hugomod-

- name: Build
  run: hugo --minify
```

<div align="right">
<a href="#table-of-contents">Back to TOC ☝️</a>
</div>

### ⭐️ Read Hugo version from file

How to sync a Hugo version between a Docker Compose and a GitHub Actions workflow via `.env` file.

Write a `HUGO_VERSION` to the `.env` file like the following and push it to a remote branch.

```sh
HUGO_VERSION=0.91.2
```

Next, add a step to read a Hugo version from the `.env` file.

```yaml
    - name: Read .env
      id: hugo-version
      run: |
        . ./.env
        echo "::set-output name=HUGO_VERSION::${HUGO_VERSION}"

    - name: Setup Hugo
      uses: peaceiris/actions-hugo@v2
      with:
        hugo-version: '${{ steps.hugo-version.outputs.HUGO_VERSION }}'
        extended: true
```

Here is a `docker-compose.yml` example.

```yaml
version: '3'

services:
  hugo:
    container_name: hugo
    image: "peaceiris/hugo:v${HUGO_VERSION}"
    # image: peaceiris/hugo:v${HUGO_VERSION}-mod   # Hugo Modules
    # image: peaceiris/hugo:v${HUGO_VERSION}-full  # Hugo Modules and Node.js
    ports:
      - 1313:1313
    volumes:
      - ${PWD}:/src
    command:
      - server
      - --bind=0.0.0.0
      - --buildDrafts
```

The alpine base Hugo Docker image is provided on the following repository.

> [peaceiris/hugo-extended-docker: Hugo alpine base Docker image (Hugo extended and Hugo Modules)](https://github.com/peaceiris/hugo-extended-docker)

<div align="right">
<a href="#table-of-contents">Back to TOC ☝️</a>
</div>

### ⭐️ Workflow for autoprefixer and postcss-cli

Here is an example workflow for the [google/docsy] Hugo theme.
This theme needs `autoprefixer` and `postcss-cli` to build a project.
The following workflow is tested with [google/docsy-example].

[google/docsy]: https://github.com/google/docsy
[google/docsy-example]: https://github.com/google/docsy-example

A workflow for the Hugo Babel pipeline is also the same as follows.

```yaml
name: GitHub Pages

on:
  push:
    branches:
      - master  # Set a branch to deploy
  pull_request:

jobs:
  deploy:
    runs-on: ubuntu-22.04
    concurrency:
      group: ${{ github.workflow }}-${{ github.ref }}
    steps:
      - uses: actions/checkout@v3
        with:
          submodules: recursive  # Fetch the Docsy theme
          fetch-depth: 0         # Fetch all history for .GitInfo and .Lastmod

      - name: Setup Hugo
        uses: peaceiris/actions-hugo@v2
        with:
          hugo-version: '0.91.2'
          extended: true

      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '16'
          cache: 'npm'
          # The action defaults to search for the dependency file (package-lock.json,
          # npm-shrinkwrap.json or yarn.lock) in the repository root, and uses its
          # hash as a part of the cache key.
          # https://github.com/actions/setup-node/blob/main/docs/advanced-usage.md#caching-packages-data
          cache-dependency-path: '**/package-lock.json'

      - run: npm ci
      - run: hugo --minify

      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        if: ${{ github.ref == 'refs/heads/master' }}
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
```

<div align="right">
<a href="#table-of-contents">Back to TOC ☝️</a>
</div>

### ⭐️ Workflow for asciidoctor

Here is an example workflow for a Hugo project using `asciidoctor`.

```yaml
name: GitHub Pages

on:
  push:
    branches:
      - main  # Set a branch to deploy
  pull_request:

jobs:
  deploy:
    runs-on: ubuntu-22.04
    concurrency:
      group: ${{ github.workflow }}-${{ github.ref }}
    steps:
      - uses: actions/checkout@v3
        with:
          submodules: true  # Fetch Hugo themes (true OR recursive)
          fetch-depth: 0    # Fetch all history for .GitInfo and .Lastmod

      - name: Setup Hugo
        uses: peaceiris/actions-hugo@v2
        with:
          hugo-version: '0.91.2'
          extended: true

      - name: Setup Ruby
        uses: ruby/setup-ruby@v1
        with:
          ruby-version: 2.7

      - run: gem install asciidoctor

      - name: Run Hugo
        run: |
          alias asciidoctor="asciidoctor --attribute=experimental=true --attribute=icons=font"
          hugo --minify

      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        if: ${{ github.ref == 'refs/heads/main' }}
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
```

<div align="right">
<a href="#table-of-contents">Back to TOC ☝️</a>
</div>

### ⭐️ Non-ascii Filename

cf. [Gitinfo fails on unicode filename · Issue #3071 · gohugoio/hugo](https://github.com/gohugoio/hugo/issues/3071)

```yaml
name: GitHub Pages

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-22.04
    concurrency:
      group: ${{ github.workflow }}-${{ github.ref }}
    steps:
      - uses: actions/checkout@v3
        with:
          fetch-depth: 0

      - name: Disable quotePath
        run: git config core.quotePath false

      - name: Setup Hugo
        uses: peaceiris/actions-hugo@v2
        with:
          hugo-version: '0.91.2'
```

<div align="right">
<a href="#table-of-contents">Back to TOC ☝️</a>
</div>



## CHANGELOG

- [CHANGELOG.md](CHANGELOG.md)



## License

- [MIT License - peaceiris/actions-hugo]

[MIT License - peaceiris/actions-hugo]: https://github.com/peaceiris/actions-hugo/blob/main/LICENSE



## About Maintainer

- [peaceiris homepage](https://peaceiris.com/)
- [GitHub Action Hero: Shohei Ueda - The GitHub Blog](https://github.blog/2020-03-22-github-action-hero-shohei-ueda/)



## Maintainer Notes

Run `npm test` on a Docker container.

```sh
# On container
make build
make all

# Release script on host
./release.sh
```



<div align="right">
<a href="#table-of-contents">Back to TOC ☝️</a>
</div>
