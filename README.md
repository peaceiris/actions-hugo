[![license](https://img.shields.io/github/license/peaceiris/actions-hugo.svg)](https://github.com/peaceiris/actions-hugo/blob/master/LICENSE)
[![release](https://img.shields.io/github/release/peaceiris/actions-hugo.svg)](https://github.com/peaceiris/actions-hugo/releases/latest)
[![GitHub release date](https://img.shields.io/github/release-date/peaceiris/actions-hugo.svg)](https://github.com/peaceiris/actions-hugo/releases)
![Test](https://github.com/peaceiris/actions-hugo/workflows/Test/badge.svg?branch=master&event=push)
[![CodeFactor](https://www.codefactor.io/repository/github/peaceiris/actions-hugo/badge)](https://www.codefactor.io/repository/github/peaceiris/actions-hugo)
[![codecov](https://codecov.io/gh/peaceiris/actions-hugo/branch/master/graph/badge.svg)](https://codecov.io/gh/peaceiris/actions-hugo)
[![Release Feed](https://img.shields.io/badge/release-feed-yellow)](https://github.com/peaceiris/actions-hugo/releases.atom)
[![Dependabot Status](https://api.dependabot.com/badges/status?host=github&repo=peaceiris/actions-hugo)](https://dependabot.com)

<img width="400" alt="GitHub Actions for Hugo" src="./images/ogp.svg">



## GitHub Actions for Hugo

- [gohugoio/hugo: The world’s fastest framework for building websites.](https://github.com/gohugoio/hugo)

This **Hugo Setup Action** can install **Hugo** to a virtual machine of **GitHub Actions**.
**Hugo extended** version, **Hugo Modules**, Linux (Ubuntu), macOS, and Windows are supported.

From `v2`, this Hugo Setup Action has migrated to a JavaScript (TypeScript) action.
We no longer build or pull a Hugo docker image.
Thanks to this change, we can complete this action in less than a few seconds.
(A docker base action was taking about 1 min or more execution time to build and pull a docker image.)

| OS (runs-on) | ubuntu-18.04 | macos-latest | windows-2019 |
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
  - [⭐️ Read Hugo version from file](#%EF%B8%8F-read-hugo-version-from-file)
- [CHANGELOG](#changelog)
- [License](#license)
- [About Maintainer](#about-maintainer)
- [Maintainer Notes](#maintainer-notes)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->



## Getting started

### ⭐️ Create your workflow

An example workflow `.github/workflows/gh-pages.yml` with [GitHub Actions for GitHub Pages]

[GitHub Actions for GitHub Pages]: https://github.com/peaceiris/actions-gh-pages

[![peaceiris/actions-gh-pages - GitHub](https://gh-card.dev/repos/peaceiris/actions-gh-pages.svg?fullname)](https://github.com/peaceiris/actions-gh-pages)

![peaceiris/actions-hugo latest version](https://img.shields.io/github/release/peaceiris/actions-hugo.svg?label=peaceiris%2Factions-hugo)
![peaceiris/actions-gh-pages latest version](https://img.shields.io/github/release/peaceiris/actions-gh-pages.svg?label=peaceiris%2Factions-gh-pages)

```yaml
name: github pages

on:
  push:
    branches:
      - master

jobs:
  build-deploy:
    runs-on: ubuntu-18.04
    steps:
      - uses: actions/checkout@v1
        # with:
        #   submodules: true

      - name: Setup Hugo
        uses: peaceiris/actions-hugo@v2
        with:
          hugo-version: '0.62.2'
          # extended: true

      - name: Build
        run: hugo --minify

      - name: Deploy
        uses: peaceiris/actions-gh-pages@v2
        env:
          ACTIONS_DEPLOY_KEY: ${{ secrets.ACTIONS_DEPLOY_KEY }}
          PUBLISH_BRANCH: gh-pages
          PUBLISH_DIR: ./public
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
    hugo-version: '0.62.2'
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

### ⭐️ Read Hugo version from file

How to sync a Hugo version between a Docker Compose and a GitHub Actions workflow via `.env` file.

Write a `HUGO_VERSION` to the `.env` file like the following and push it to a remote branch.

```sh
HUGO_VERSION=0.62.2
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
    # image: peaceiris/hugo:v${HUGO_VERSION}-mod  # Hugo Modules
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



## CHANGELOG

- [CHANGELOG.md](CHANGELOG.md)



## License

- [MIT License - peaceiris/actions-hugo]

[MIT License - peaceiris/actions-hugo]: https://github.com/peaceiris/actions-hugo/blob/master/LICENSE



## About Maintainer

- [peaceiris homepage](https://peaceiris.com/)



## Maintainer Notes

Run `npm` and `git commit` commands on a container.

**On Host**

```sh
# Docker
make build
make run
make run cmd="env"
make test
make commit msg="chore: Add Makefile"

# Release
./release.sh
```



<div align="right">
<a href="#table-of-contents">Back to TOC ☝️</a>
</div>
