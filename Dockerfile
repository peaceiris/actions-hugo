FROM debian:9-slim

LABEL "com.github.actions.name"="Hugo extended action"
LABEL "com.github.actions.description"="GitHub Actions for Hugo extended version"
LABEL "com.github.actions.icon"="package"
LABEL "com.github.actions.color"="yellow"

LABEL "repository"="https://github.com/peaceiris/actions-hugo"
LABEL "homepage"="https://github.com/peaceiris/actions-hugo"
LABEL "maintainer"="peaceiris"

ENV HUGO_VERSION='0.55.6'
ENV HUGO_NAME="hugo_extended_${HUGO_VERSION}_Linux-64bit"
ENV HUGO_URL="https://github.com/gohugoio/hugo/releases/download/v${HUGO_VERSION}/${HUGO_NAME}.deb"
ENV BUILD_DEPS="wget"

RUN apt-get update && apt-get upgrade -y && \
    apt-get install -y git "${BUILD_DEPS}" && \
    wget "${HUGO_URL}" && \
    apt-get install "./${HUGO_NAME}.deb" && \
    rm -rf "./${HUGO_NAME}.deb" "${HUGO_NAME}" && \
    apt-get remove -y "${BUILD_DEPS}" && \
    apt-get autoremove -y && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

ENTRYPOINT [ "/usr/local/bin/hugo" ]
