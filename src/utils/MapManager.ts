import Phaser from "phaser";
import { generateSolidColorTexture } from "./TextureGenerator";

class MapManager {
	private tilemap: Phaser.Tilemaps.Tilemap;
	private layer: Phaser.Tilemaps.TilemapLayer;
	private scene: Phaser.Scene;

	constructor(scene: Phaser.Scene) {
		this.scene = scene;
	}

	preload() {
		generateSolidColorTexture(this.scene, "unfilled", 0xff0000, 32, 32);
		generateSolidColorTexture(this.scene, "filled", 0xf0ff00, 32, 32);
	}

	create() {
		const width = 25;
		const height = 19;
		const defaultTileIndex = 0;
		const data = Array.from({ length: height }, () =>
			Array(width).fill(defaultTileIndex),
		);

		this.tilemap = this.scene.make.tilemap({
			data: data,
			width: width,
			height: height,
			tileWidth: 32,
			tileHeight: 32,
		});

		const unfilledTileset = this.tilemap.addTilesetImage(
			"unfilled",
			undefined,
			32,
			32,
			0,
			0,
			1,
		);
		this.tilemap.addTilesetImage;
		const filledTileset = this.tilemap.addTilesetImage(
			"filled",
			undefined,
			32,
			32,
			0,
			0,
			2,
		);

		this.tilemap.tilesets.forEach((tileset) => console.log(tileset));
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
				this.layer.putTileAt(
					Math.random() > 0.5
						? filledTileset.firstgid
						: unfilledTileset.firstgid,
					x,
					y,
				);
			}
		}
	}
}

export default MapManager;
