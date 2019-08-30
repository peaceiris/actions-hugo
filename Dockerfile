FROM golang:1.12.7-buster

LABEL "com.github.actions.name"="Hugo action"
LABEL "com.github.actions.description"="GitHub Actions for Hugo extended and Hugo Modules"
LABEL "com.github.actions.icon"="package"
LABEL "com.github.actions.color"="yellow"

LABEL "repository"="https://github.com/peaceiris/actions-hugo"
LABEL "homepage"="https://github.com/peaceiris/actions-hugo"
LABEL "maintainer"="peaceiris"

ARG HUGO_VERSION="auto"
RUN echo "Hugo version: ${HUGO_VERSION}"

RUN if [ "$HUGO_VERSION" = "auto" ]; then \
    echo "Using automated version detection" && \
    curl -s https://api.github.com/repos/gohugoio/hugo/releases/latest | \
    grep browser_download_url | \
    cut -d '"' -f 4 | \
    grep -e 'hugo_extended_.*_Linux.*\.tar\.gz' | \
    xargs curl -fsSL -O; fi

RUN if [ ! "$HUGO_VERSION" = "auto" ]; then \
    echo "Using fixed version $HUGO_VERSION" && \
    curl "https://api.github.com/repos/gohugoio/hugo/releases/tags/v${HUGO_VERSION}" | \
    grep browser_download_url | \
    cut -d '"' -f 4 | \
    grep -e 'hugo_extended_.*_Linux.*\.tar\.gz' | \
    xargs curl -fsSL -O; fi

RUN cat *.gz | tar -xzvf - -i && \
    mv ./hugo /go/bin/

ENTRYPOINT [ "/go/bin/hugo" ]
