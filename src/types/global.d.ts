// Type declarations for globals polyfilled by react-native-get-random-values

declare const crypto: {
  getRandomValues<T extends ArrayBufferView>(array: T): T;
};

// SVG imports
declare module '*.svg' {
  import React from 'react';
  import { SvgProps } from 'react-native-svg';
  const content: React.FC<SvgProps>;
  export default content;
}
