const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

// Lệnh này ép Expo phải dịch file global.css của bạn
module.exports = withNativeWind(config, { input: "./src/global.css" });
