FROM golang:1.12.7-buster

LABEL "com.github.actions.name"="Hugo action"
LABEL "com.github.actions.description"="GitHub Actions for Hugo extended and Hugo Modules"
LABEL "com.github.actions.icon"="package"
LABEL "com.github.actions.color"="yellow"

LABEL "repository"="https://github.com/peaceiris/actions-hugo"
LABEL "homepage"="https://github.com/peaceiris/actions-hugo"
LABEL "maintainer"="peaceiris"

ENV HUGO_VERSION='0.57.2'
ENV HUGO_NAME="hugo_extended_${HUGO_VERSION}_Linux-64bit"
ENV HUGO_URL="https://github.com/gohugoio/hugo/releases/download/v${HUGO_VERSION}/${HUGO_NAME}.tar.gz"
RUN wget "${HUGO_URL}" && \
    tar -zxvf "${HUGO_NAME}.tar.gz" && \
    mv ./hugo /go/bin/

ENTRYPOINT [ "/go/bin/hugo" ]
