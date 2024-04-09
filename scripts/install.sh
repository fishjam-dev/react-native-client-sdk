#!/bin/bash

# Run the commands in sequence
export NO_FLIPPER="1"
yarn
cd example
yarn
cd ios
pod install
echo "All commands executed successfully!"
