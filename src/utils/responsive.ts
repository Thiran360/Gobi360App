import { Dimensions, PixelRatio } from 'react-native';

const { width, height } = Dimensions.get('window');

// Guideline sizes are based on standard ~5" screen mobile device (e.g. iPhone 11 Pro)
const guidelineBaseWidth = 390;
const guidelineBaseHeight = 844;

// Use for width, marginLeft, paddingHorizontal, etc.
export const scale = (size: number) => (width / guidelineBaseWidth) * size;

// Use for height, marginTop, paddingVertical, etc.
export const verticalScale = (size: number) => (height / guidelineBaseHeight) * size;

// Use for font sizes, border radius. Scales linearly but not fully to prevent massive fonts on tablets
export const moderateScale = (size: number, factor = 0.5) => size + (scale(size) - size) * factor;

// Optional: responsive font sizing based on pixel ratio
export const responsiveFontSize = (size: number) => {
  const newSize = size * (width / guidelineBaseWidth);
  return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 1;
};
