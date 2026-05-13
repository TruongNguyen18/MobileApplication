module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
    plugins: [
      // Luôn giữ Reanimated ở cuối cùng của plugins
      "react-native-reanimated/plugin",
    ],
  };
};
