import Phaser from "phaser";
import { generateSolidColorTexture } from "../utils/TextureGenerator";
import MapManager from "../utils/MapManager";

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
		this.mapManager.create();
	}

	update() {
		// Update game objects here
	}
}

export default PlayScene;
