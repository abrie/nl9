import Phaser from 'phaser';

export function generateSolidColorTexture(name: string, color: number, width: number, height: number): string {
  const graphics = new Phaser.GameObjects.Graphics(null);
  graphics.fillStyle(color, 1);
  graphics.fillRect(0, 0, width, height);

  graphics.generateTexture(name, width, height);
  graphics.destroy();
  return name;
}
