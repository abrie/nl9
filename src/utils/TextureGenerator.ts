import Phaser from 'phaser';
import { TILE_SIZE } from './Constants';

export function generateSolidColorTexture(scene: Phaser.Scene, name: string, color: number, width: number, height: number): string {
  const graphics = new Phaser.GameObjects.Graphics(scene);
  graphics.fillStyle(color, 1);
  graphics.fillRect(0, 0, width, height);

  graphics.generateTexture(name, width, height);
  graphics.destroy();
  return name;
}
