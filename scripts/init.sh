#!/bin/bash
brew install swift-format 
yarn
yarn build
chmod +x .githooks/*
cp .githooks/* .git/hooks