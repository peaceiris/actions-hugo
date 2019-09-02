[![license](https://img.shields.io/github/license/peaceiris/actions-hugo.svg)](https://github.com/peaceiris/actions-hugo/blob/master/LICENSE)
[![release](https://img.shields.io/github/release/peaceiris/actions-hugo.svg)](https://github.com/peaceiris/actions-hugo/releases/latest)
[![GitHub release date](https://img.shields.io/github/release-date/peaceiris/actions-hugo.svg)](https://github.com/peaceiris/actions-hugo/releases)
[![GitHub Actions status](https://github.com/peaceiris/actions-hugo/workflows/Push%20workflow/badge.svg)](https://github.com/peaceiris/actions-hugo/actions)
[![Docker Hub Build Status](https://img.shields.io/docker/cloud/build/peaceiris/gha-hugo.svg)](https://hub.docker.com/r/peaceiris/gha-hugo)

<img width="400" alt="GitHub Actions for Hugo extended" src="./images/ogp.svg">



## GitHub Actions for Hugo extended and Modules

- [gohugoio/hugo: The world’s fastest framework for building websites.](https://github.com/gohugoio/hugo)



## Getting started

### Create `.github/workflows/push.yml`

An example with [GitHub Actions for deploying to GitHub Pages with Static Site Generators]

[GitHub Actions for deploying to GitHub Pages with Static Site Generators]: https://github.com/peaceiris/actions-gh-pages

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
    - uses: actions/checkout@master
    - name: build
      uses: peaceiris/actions-hugo@v0.57.2
      if: github.event.deleted == false
      with:
        args: --gc --minify --cleanDestinationDir
    - name: deploy
      uses: peaceiris/actions-gh-pages@v1.1.0
      if: success()
      env:
        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        PUBLISH_BRANCH: gh-pages
        PUBLISH_DIR: ./public
```



## License

- [MIT License - peaceiris/actions-hugo]

[MIT License - peaceiris/actions-hugo]: https://github.com/peaceiris/actions-hugo/blob/master/LICENSE



## About the author

- [peaceiris's homepage](https://peaceiris.com/)
