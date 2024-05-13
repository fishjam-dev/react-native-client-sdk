#!/bin/bash

# Run the commands in sequence
yarn
cd example
yarn
cd ios
pod install
echo "All commands executed successfully!"