.PHONY: install dev submodules

install: submodules
	npm install

dev:
	npm run dev -- --host

submodules:
	git submodule update --init --recursive --remote
