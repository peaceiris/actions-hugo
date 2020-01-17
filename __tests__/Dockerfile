FROM node:12-slim

WORKDIR /repo

RUN apt-get update && \
    apt-get -y install --no-install-recommends \
    git \
    bash && \
    rm -rf /var/lib/apt/lists/*

CMD [ "bash" ]
