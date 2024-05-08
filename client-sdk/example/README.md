# React native jellyfish example

## Usage
### To run app please follow those steps:
Move to package directory `cd ..`. <br>
Run `yarn clean` from package directory. <br>
Run `yarn installAll` from package directory.<br>
Move to example directory `cd example`.<br>
Run in one terminal window `yarn start` to start metro.<br>
Run in other terminal window `yarn ios` or `yarn android` to run app on selected platform.<br>

## Testing
For testing checkout [Readme](webdriverio-test/readme.md) in `webdriverio-test` directory. <br>
**Note:** If you add crucial files that should affect output of android .apk file make sure to add that file to github actions files: [cache action](../.github/actions/cache_apk_file/action.yml) and [restore action](../.github/actions/restore_apk_file/action.yml).
