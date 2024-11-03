import Phaser from "phaser";
import MapManager from "../utils/MapManager";
import MapGenerator from "../utils/MapGenerator";

class PlayScene extends Phaser.Scene {
	private mapManager: MapManager;

	constructor() {
		super({ key: "PlayScene" });
		this.mapManager = new MapManager(this);
	}

	preload() {
		this.mapManager.preload();
	}

	create() {
		this.createMap();
		this.createPlayer();
	}

	update() {
		// Update game objects here
	}

	private createMap() {
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
		this.mapManager.populateTilemap(map, width, height);
	}

	private createPlayer() {
		const nonWallSpaces = this.mapManager.getNonWallSpaces();
		const randomIndex = Phaser.Math.Between(0, nonWallSpaces.length - 1);
		const spawnPoint = nonWallSpaces[randomIndex];

		// Create the player at the spawn point
		const player = this.add.sprite(spawnPoint.x * 32, spawnPoint.y * 32, 'player');
		this.physics.add.existing(player);
	}
}

export default PlayScene;
