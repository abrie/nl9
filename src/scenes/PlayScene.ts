import Phaser from 'phaser';
import { generateSolidColorTexture } from '../utils/TextureGenerator';

class PlayScene extends Phaser.Scene {
  private tilemap: Phaser.Tilemaps.Tilemap;
  private tileset: Phaser.Tilemaps.Tileset;
  private layer: Phaser.Tilemaps.DynamicTilemapLayer;

  constructor() {
    super({ key: 'PlayScene' });
  }

  preload() {
    this.textures.generate('unfilled', { data: generateSolidColorTexture(0xff0000), width: 32, height: 32 });
    this.textures.generate('filled', { data: generateSolidColorTexture(0x00ff00), width: 32, height: 32 });
  }

  create() {
    this.tilemap = this.make.tilemap({ width: 25, height: 19, tileWidth: 32, tileHeight: 32 });
    this.tileset = this.tilemap.addTilesetImage('unfilled');
    this.layer = this.tilemap.createDynamicLayer(0, this.tileset, 0, 0);

    for (let y = 0; y < this.tilemap.height; y++) {
      for (let x = 0; x < this.tilemap.width; x++) {
        this.layer.putTileAt(0, x, y);
      }
    }

    // Randomly place filled tiles
    const filledTileset = this.tilemap.addTilesetImage('filled');
    for (let y = 0; y < this.tilemap.height; y++) {
      for (let x = 0; x < this.tilemap.width; x++) {
        if (Math.random() < 0.2) { // 20% chance to place a filled tile
          this.layer.putTileAt(filledTileset.firstgid, x, y);
        }
      }
    }
  }

  update() {
    // Update game objects here
  }
}

export default PlayScene;
