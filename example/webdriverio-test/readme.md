## E2E tests of Jellyfish app

### How to run tests

1. [Install appium](https://appium.io/docs/en/2.1/quickstart/install/)
2. [Install UIAutomator2 (for android)](https://appium.io/docs/en/2.1/quickstart/uiauto2-driver/)
3. [Install XCUITest (for ios)](https://appium.github.io/appium-xcuitest-driver/5.11/setup/#real-devices)
4. [Dont forget about this (for ios)](https://appium.github.io/appium-xcuitest-driver/5.11/real-device-config/)
5. Run yarn install
6. Check file .env, there are some necesary env variables

- JELLYFISH_URL - address of your Jellyfish server (ws://ip_adress:port_number/socket/peer/websocket)
- ANDROID_JELLYFISH_TOKEN - peer token for your android device
- ANDROID_DEVICE_NAME - name of your android device, if not set test would not start on android can be checked using:
  adb devices -l
- ANDROID_APP_PATH - Path to .apk file on your computer, to generate it:
  - In folder example run: cd android && ./gradlew assembleRelease
  - Yor path should look like this your/path/to/repo/example/android/app/build/outputs/apk/release/app-release.apk

- IOS_JELLYFISH_TOKEN - peer token for your ios device
- IOS_DEVICE_ID - id of your ios device, can be obtained using: xcrun xctrace list devices
- IOS_TEAM_ID - id of your team, can be obtained at apple developer page
- IOS_APP_PATH - Path to .ipa file on your computer, to generate it:
  - open example app in xcode, tap on product > archive
  - choose archive and tap on distribute > custom > development > next ... > automatically manage signing > export
  - choose file to export your app, recommend to do it in ios folder
  - your path should look like path/to/your/app/JellyfishExample.ipa

7. Run yarn install in webdriveio-test folder
2. [install wdio cli](https://v6.webdriver.io/docs/clioptions.html)
3. Run jellyfish ( if locally this command can be handy:

   docker run -p 50000-50050:50000-50050/udp \
   -p 5002:5002/tcp \
   -e JF_CHECK_ORIGIN=false \
   -e JF_HOST=localhost:5002 \
   -e JF_PORT="5002" \
   -e JF_WEBRTC_USED=true \
   -e JF_WEBRTC_TURN_PORT_RANGE=50000-50050 \
   -e JF_WEBRTC_TURN_IP=<ip address> \
   -e JF_WEBRTC_TURN_LISTEN_IP=0.0.0.0 \
   -e JF_SERVER_API_TOKEN=development \
   ghcr.io/jellyfish-dev/jellyfish:0.2.0
4. Run test in webdriveio-test folder : (npx) wdio run ./wdio.conf.ts

