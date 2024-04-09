[![CI](https://github.com/jellyfish-dev/react-native-client-sdk/actions/workflows/ci.yml/badge.svg)](https://github.com/jellyfish-dev/react-native-client-sdk/actions/workflows/ci.yml)
# react-native-client-sdk

Jellyfish client SDK in React Native

## Installation

```sh
npm install @jellyfish-dev/react-native-client-sdk
```

### Expo plugin
Even though this is not a native library, it has a dependency on `@jellyfish-dev/react-native-membrane-webrtc` which requires native configuration.
If you're using development builds with `eas build` or bare workflow you can try using expo plugin to do the configuration below for you.
Simply run:

```
expo install @jellyfish-dev/react-native-client-sdk
```

Add plugin to your `app.json`:

```json
{
  "expo": {
    "name": "example",
    ...
    "plugins": [
      "@jellyfish-dev/react-native-membrane-webrtc"
    ]
  }
}
```

On bare workflow run `expo prebuild` to configure the app, then run `pod install`.
On development build `eas build` should take care of it.

### Android

1. Add camera and microphone permissions to your `AndroidManifest.xml`.
2. For android 14+ add following code in your `AndroidManifest.xml` in application section :
```xml
<service
  android:name=".YourServiceName"
  android:foregroundServiceType="mediaProjection"
  android:exported="false">
```
3. Rebuild the app. That's it!

### iOS

On iOS installation is a bit more complicated, because you need to setup a screen broadcast app extension for screensharing.

1. Add camera and microphone permissions to your main `Info.plist`.
   ```xml
   <key>NSCameraUsageDescription</key>
   <string>Allow $(PRODUCT_NAME) to use the camera</string>
   <key>NSMicrophoneUsageDescription</key>
   <string>Allow $(PRODUCT_NAME) to use the microphone</string>
   ```
2. We recommend adding `audio` background mode in `Info.plist` so that the app doesn't disconnect when it's in background:

```xml
	<key>UIBackgroundModes</key>
  <array>
    <string>audio</string>
  </array>
```

2. Open your `<your-project>.xcworkspace` in Xcode
3. Create new Broadcast Upload Extension. Select File → New → Target... → Broadcast Upload Extension → Next. Choose the name for the new target, select Swift language and deselect "Include UI Extension".

   ![New target config](./.github/images/xcode1.png)

   Press Finish. In the next alert xcode will ask you if you want to activate the new scheme - press Cancel.

4. Configure app group. Go to "Signing & Capabilities" tab, click "+ Capability" button in upper left corner and select "App Groups".

   ![App groups config](./.github/images/xcode2.png)

   Then in the "App Groups" add a new group or select existing. Usually group name has format `group.<your-bundle-identifier>`. Verify that both app and extension targets have app group and dev team set correctly.

5. A new folder with app extension should appear on the left with contents like this:

   ![App extension files](./.github/images/xcode3.png)

   Replace `SampleHandler.swift` with `MembraneBroadcastSampleHandler.swift` and this code:

   ```swift
   import Foundation
   import MembraneRTC
   import os.log
   import ReplayKit
   import WebRTC


   /// App Group used by the extension to exchange buffers with the target application
   let appGroup = "{{GROUP_IDENTIFIER}}"

   let logger = OSLog(subsystem: "{{BUNDLE_IDENTIFIER}}.MembraneBroadcastSampleHandler", category: "Broadcaster")

   /// An example `SampleHandler` utilizing `BroadcastSampleSource` from `MembraneRTC` sending broadcast samples and necessary notification enabling device's screencast.
   class MembraneBroadcastSampleHandler: RPBroadcastSampleHandler {
       let broadcastSource = BroadcastSampleSource(appGroup: appGroup)
       var started: Bool = false


       override func broadcastStarted(withSetupInfo _: [String: NSObject]?) {
           started = broadcastSource.connect()

           guard started else {
               os_log("failed to connect with ipc server", log: logger, type: .debug)

               super.finishBroadcastWithError(NSError(domain: "", code: 0, userInfo: nil))

               return
           }

           broadcastSource.started()
       }

       override func broadcastPaused() {
           broadcastSource.paused()
       }

       override func broadcastResumed() {
           broadcastSource.resumed()
       }

       override func broadcastFinished() {
           broadcastSource.finished()
       }

       override func processSampleBuffer(_ sampleBuffer: CMSampleBuffer, with sampleBufferType: RPSampleBufferType) {
           guard started else {
               return
           }

           broadcastSource.processFrame(sampleBuffer: sampleBuffer, ofType: sampleBufferType)
       }
   }
   ```

   Replace `{{GROUP_IDENTIFIER}}` and `{{BUNDLE_IDENTIFIER}}` with your group identifier and bundle identifier respectively.

   In the extension's `Info.plist`, apply the following change:

   ```diff
   <key>NSExtensionPrincipalClass</key>
   -<string>$(PRODUCT_MODULE_NAME).SampleHandler</string>
   +<string>$(PRODUCT_MODULE_NAME).MembraneBroadcastSampleHandler</string>
   ```

6. In project's Podfile add the following code:
   ```rb
   target 'MembraneScreenBroadcastExtension' do
     pod 'MembraneRTC/Broadcast'
   end
   ```
   > This new dependency should be added outside of your application target. Example
   >
   > ```rb
   > target 'ReactNativeMembraneExample' do
   >  ...
   > end
   >
   > target 'MembraneScreenBroadcastExtension' do
   >  pod 'MembraneRTC/Broadcast'
   > end
   > ```
7. Run `pod install` in your `ios/` directory
8. Add the following constants in your Info.plist:
   ```xml
   <key>AppGroupName</key>
   <string>{{GROUP_IDENTIFIER}}</string>
   <key>ScreencastExtensionBundleId</key>
   <string>{{BUNDLE_IDENTIFIER}}.MembraneBroadcastSampleHandler</string>
   ```
   Replace `{{GROUP_IDENTIFIER}}` and `{{BUNDLE_IDENTIFIER}}` with your group identifier and bundle identifier respectively.
9. Rebuild the app and enjoy!

> **Note:** If the build fails due to sandbox issues (like `realpath`'s illegal option), you can disable sandboxing for
> the extension target. To do this, open Xcode, go to the `MembraneScreenBroadcastExtension` target settings, select
> `Build Settings` tab and disable `User Script Sandboxing`.

## Docs

API documentation is available [here](https://jellyfish-dev.github.io/react-native-client-sdk/)

## Usage

Since version 0.2.0 call function initializeWebRTC() once in your app before using any other functionality.

Make sure you have:

- Running [Jellyfish](https://github.com/jellyfish-dev/jellyfish) server.
- Created room and token of peer in that room.
  You can use [dashboard](https://github.com/jellyfish-dev/jellyfish-react-client/tree/main/examples/dashboard) example to create room and peer token.

You can refer to our minimal example on how to use this library.

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## Copyright and License

Copyright 2023, [Software Mansion](https://swmansion.com/?utm_source=git&utm_medium=readme&utm_campaign=jellyfish)

[![Software Mansion](https://logo.swmansion.com/logo?color=white&variant=desktop&width=200&tag=membrane-github)](https://swmansion.com/?utm_source=git&utm_medium=readme&utm_campaign=jellyfish)

Licensed under the [Apache License, Version 2.0](LICENSE)
