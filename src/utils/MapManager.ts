import Phaser from "phaser";
import { generateSolidColorTexture } from "./TextureGenerator";
import MapGenerator from "./MapGenerator";

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
		const initialFillProbability = 0.45;
		const numberOfIterations = 5;
		const birthLimit = 4;
		const deathLimit = 3;

		const mapGenerator = new MapGenerator(
			width,
			height,
			initialFillProbability,
			numberOfIterations,
			birthLimit,
			deathLimit
		);

		const map = mapGenerator.generateMap();
		this.populateTilemap(map, width, height);
	}

	populateTilemap(map: number[][], width: number, height: number) {
		if (!this.tilemap) {
			this.tilemap = this.scene.make.tilemap({
				data: map,
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
		}

		for (let y = 0; y < this.tilemap.height; y++) {
			for (let x = 0; x < this.tilemap.width; x++) {
				this.layer.putTileAt(
					map[y][x] === 1
						? this.tilemap.tilesets[1].firstgid
						: this.tilemap.tilesets[0].firstgid,
					x,
					y,
				);
			}
		}
	}
}

export default MapManager;
