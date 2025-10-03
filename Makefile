# Simple helper Makefile for CVGen

ifeq ($(OS),Windows_NT)
  PYTHON ?= python
  VENV_DIR ?= .venv
  VENV_BIN := $(VENV_DIR)/Scripts
else
  PYTHON ?= python3
  VENV_DIR ?= .venv
  VENV_BIN := $(VENV_DIR)/bin
endif

PIP := $(VENV_BIN)/pip
PYTHON_CMD ?= $(VENV_BIN)/python
export PYTHON_CMD

.PHONY: help install node dev lint check build tauri-build clean

help:
	@echo "Available targets:"
	@echo "  make install     # Install Node & Python deps"
	@echo "  make dev         # Launch Tauri dev app"
	@echo "  make lint        # Run TypeScript lint"
	@echo "  make check       # Run cargo check"
	@echo "  make build       # Build frontend + Rust debug"
	@echo "  make tauri-build # Produce packaged binaries"
	@echo "  make clean       # Remove build artifacts"

install: venv node

venv: $(VENV_DIR)/.requirements.stamp

$(VENV_BIN)/python:
	@echo "Creating Python virtualenv in $(VENV_DIR)..."
	$(PYTHON) -m venv $(VENV_DIR)

$(VENV_DIR)/.requirements.stamp: python/requirements.txt | $(VENV_BIN)/python
	@echo "Installing Python dependencies..."
	$(PIP) install --upgrade "pip<24.1"
	$(PIP) install -r python/requirements.txt
	@touch $@

node: node_modules

node_modules: package.json
	@echo "Installing Node dependencies..."
	npm install
	@touch node_modules/.installed

dev: install
	@echo "Starting Tauri dev server..."
	npm run tauri:dev

lint:
	npm run lint

check:
	cd src-tauri && cargo check

build: install
	npm run build
	cd src-tauri && cargo build

tauri-build: install
	npm run tauri:build

clean:
	rm -rf node_modules dist $(VENV_DIR) src-tauri/target
	rm -f node_modules/.installed $(VENV_DIR)/.requirements.stamp
	find . -name "*.pyc" -delete
	find . -name "__pycache__" -type d -prune -exec rm -rf {} +
