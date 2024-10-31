export function generateSolidColorTexture(color: number): number[] {
  const size = 32 * 32;
  const texture = new Array(size).fill(color);
  return texture;
}
