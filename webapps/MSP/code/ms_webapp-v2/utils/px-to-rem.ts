/**
 * Convert px to rem
 */

const pxToRem = (px: number) => {
  const value = px / 16;
  return `${value}rem`;
};

export default pxToRem;
