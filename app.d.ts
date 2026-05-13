/// <reference types="nativewind/types" />

import "react-native";

// Ép TypeScript phải chấp nhận thuộc tính className cho các thẻ của React Native
declare module "react-native" {
  interface ViewProps {
    className?: string;
  }
  interface TextProps {
    className?: string;
  }
  interface TouchableOpacityProps {
    className?: string;
  }
  interface TextInputProps {
    className?: string;
  }
  interface ScrollViewProps {
    className?: string;
  }
}
declare module "*.css" {
  const content: any;
  export default content;
}
