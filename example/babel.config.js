module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        alias: {
          '@jellyfish-dev/react-native-client-sdk': '..',
        },
      },
    ],
    ['module:react-native-dotenv'],
  ],
};
