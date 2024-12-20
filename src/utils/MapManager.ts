import Phaser from "phaser";
import { generateSolidColorTexture } from "./TextureGenerator";
import MapGenerator from "./MapGenerator";
import { TILE_SIZE } from "./Constants";

class MapManager {
	private tilemap!: Phaser.Tilemaps.Tilemap;
	private layer!: Phaser.Tilemaps.TilemapLayer;
	private scene: Phaser.Scene;

	constructor(scene: Phaser.Scene) {
		this.scene = scene;
	}

	preload() {
		generateSolidColorTexture(this.scene, "unfilled", 0x00aa00, TILE_SIZE, TILE_SIZE);
		generateSolidColorTexture(this.scene, "filled", 0x000000, TILE_SIZE, TILE_SIZE);
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
				tileWidth: TILE_SIZE,
				tileHeight: TILE_SIZE,
			});

			const unfilledTileset = this.tilemap.addTilesetImage(
				"unfilled",
				undefined,
				TILE_SIZE,
				TILE_SIZE,
				0,
				0,
				1,
			);
			this.tilemap.addTilesetImage;
			const filledTileset = this.tilemap.addTilesetImage(
				"filled",
				undefined,
				TILE_SIZE,
				TILE_SIZE,
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
			this.layer.putTileAt(this.tilemap.tilesets[1].firstgid, 0, y);
			this.layer.putTileAt(this.tilemap.tilesets[1].firstgid, this.tilemap.width - 1, y);
		}

		for (let x = 0; x < this.tilemap.width; x++) {
			this.layer.putTileAt(this.tilemap.tilesets[1].firstgid, x, 0);
			this.layer.putTileAt(this.tilemap.tilesets[1].firstgid, x, this.tilemap.height - 1);
		}

		this.layer.setCollision(this.tilemap.tilesets[1].firstgid, true);
	}

	getRandomNonWallPosition(map: number[][]): { x: number, y: number } {
		const nonWallPositions: { x: number, y: number }[] = [];

		for (let y = 0; y < map.length; y++) {
			for (let x = 0; x < map[y].length; x++) {
				if (map[y][x] === 0) {
					nonWallPositions.push({ x, y });
				}
			}
		}

		if (nonWallPositions.length === 0) {
			throw new Error("No non-wall positions available.");
		}

		const randomIndex = Math.floor(Math.random() * nonWallPositions.length);
		return nonWallPositions[randomIndex];
	}

	findFirstWallTileAbove(x: number, y: number): number | null {
		for (let i = y; i >= 0; i--) {
			const tile = this.layer.getTileAt(x, i);
			if (tile && tile.index === this.layer.tileset[1].firstgid) {
				return i;
			}
		}
		return null;
	}
}

export default MapManager;
