import Phaser from "phaser";
import { generateSolidColorTexture } from "../utils/TextureGenerator";

class PlayScene extends Phaser.Scene {
	private tilemap: Phaser.Tilemaps.Tilemap;
	private tileset: Phaser.Tilemaps.Tileset;
	private layer: Phaser.Tilemaps.DynamicTilemapLayer;

	constructor() {
		super({ key: "PlayScene" });
	}

	preload() {
		generateSolidColorTexture(this, "unfilled", 0xff0000, 32, 32);
		generateSolidColorTexture(this, "filled", 0x00ff00, 32, 32);
	}

	create() {
		this.tilemap = this.make.tilemap({
			data: [],
			width: 25,
			height: 19,
			tileWidth: 32,
			tileHeight: 32,
		});

		const unfilledTileset = this.tilemap.addTilesetImage("unfilled");
		const filledTileset = this.tilemap.addTilesetImage("filled");
		if (unfilledTileset === null || filledTileset === null) {
			throw new Error("Unable to add tileset image.");
		}
		this.layer = this.tilemap.createLayer(
			0,
			[unfilledTileset, filledTileset],
			0,
			0,
		);
		for (let y = 0; y < this.tilemap.height; y++) {
			for (let x = 0; x < this.tilemap.width; x++) {
				this.layer.putTileAt(filledTileset.firstgid, x, y);
			}
		}

		for (let y = 0; y < this.tilemap.height; y++) {
			for (let x = 0; x < this.tilemap.width; x++) {
				if (Math.random() < 0.2) {
					// 20% chance to place a filled tile
					this.layer.putTileAt(unfilledTileset.firstgid, x, y);
				}
			}
		}
	}

	update() {
		// Update game objects here
	}
}

export default PlayScene;
