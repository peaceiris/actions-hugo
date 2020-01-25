cmd := "bash"
msg := ""
IMAGE_NAME := actions_hugo_dev:latest
DOCKER_BUILD := docker build . -t $(IMAGE_NAME) --file ./__tests__/Dockerfile
DOCKER_RUN := docker run --rm -i -t -v ${PWD}:/repo -v ~/.gitconfig:/etc/gitconfig $(IMAGE_NAME)


.PHONY: build
build:
	$(DOCKER_BUILD)

.PHONY: run
run:
	$(DOCKER_RUN) $(cmd)

.PHONY: test
test:
	$(DOCKER_RUN) npm test

.PHONY: commit
commit:
	$(DOCKER_RUN) git commit -m "$(msg)"
