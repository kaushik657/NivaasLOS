module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    ['@babel/plugin-transform-private-methods', {loose: true}],
    'react-native-worklets-core/plugin',
    'react-native-reanimated/plugin',
  ],
};
