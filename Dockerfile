FROM golang:1.12.7-buster

LABEL "com.github.actions.name"="Hugo action"
LABEL "com.github.actions.description"="GitHub Actions for Hugo extended and Hugo Modules"
LABEL "com.github.actions.icon"="package"
LABEL "com.github.actions.color"="yellow"

LABEL "repository"="https://github.com/peaceiris/actions-hugo"
LABEL "homepage"="https://github.com/peaceiris/actions-hugo"
LABEL "maintainer"="peaceiris"

ENV HUGO_VERSION='0.56.0'
ENV HUGO_URL='https://github.com/gohugoio/hugo.git'

RUN git clone ${HUGO_URL} -b v${HUGO_VERSION} --depth 1 /hugo && \
    cd /hugo && \
    go install --tags extended

ENTRYPOINT [ "/go/bin/hugo" ]
