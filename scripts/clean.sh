#!/bin/bash

# Start the tasks in the background
(rm -rf node_modules) &
(cd example && rm -rf node_modules) &
(cd example/ios && rm -rf Pods && pod deintegrate) &
(cd example/ios && rm -rf build) &
(cd example/ios && rm Podfile.lock) &

# Wait for all background tasks to finish
wait

echo "All tasks complete!"
