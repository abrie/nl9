import Phaser from "phaser";
import { generateSolidColorTexture } from "./TextureGenerator";
import MapGenerator from "./MapGenerator";

class MapManager {
	private tilemap!: Phaser.Tilemaps.Tilemap;
	private layer!: Phaser.Tilemaps.TilemapLayer;
	private scene: Phaser.Scene;

	constructor(scene: Phaser.Scene) {
		this.scene = scene;
	}

	preload() {
		generateSolidColorTexture(this.scene, "unfilled", 0x00aa00, 32, 32);
		generateSolidColorTexture(this.scene, "filled", 0x000000, 32, 32);
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
			deathLimit,
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

			if (unfilledTileset === null || filledTileset === null) {
				throw new Error("Unable to add tileset image.");
			}
			const layer = this.tilemap.createLayer(
				0,
				[unfilledTileset, filledTileset],
				0,
				0,
			);
			if (layer === null) {
				throw new Error("Failed to create tilemap layer.");
			} else {
				this.layer = layer;
			}
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

	getRandomSpawnPoint(): { x: number, y: number } {
		const nonWallSpaces: { x: number, y: number }[] = [];

		for (let y = 0; y < this.tilemap.height; y++) {
			for (let x = 0; x < this.tilemap.width; x++) {
				const tile = this.layer.getTileAt(x, y);
				if (tile && tile.index === this.tilemap.tilesets[0].firstgid) {
					nonWallSpaces.push({ x, y });
				}
			}
		}

		const randomIndex = Phaser.Math.Between(0, nonWallSpaces.length - 1);
		return nonWallSpaces[randomIndex];
	}
}

export default MapManager;
