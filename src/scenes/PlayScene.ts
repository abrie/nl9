import Phaser from "phaser";
import MapManager from "../utils/MapManager";
import MapGenerator from "../utils/MapGenerator";
import { generateSolidColorTexture } from "../utils/TextureGenerator";

class PlayScene extends Phaser.Scene {
	private mapManager: MapManager;
	private player!: Phaser.Physics.Arcade.Sprite;
	private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;

	constructor() {
		super({ key: "PlayScene" });
		this.mapManager = new MapManager(this);
	}

	preload() {
		this.mapManager.preload();
		generateSolidColorTexture(this, "player", 0x800080, 32, 32);
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
		this.mapManager.populateTilemap(map, width, height);

		this.createPlayer(map);

		this.cursors = this.input.keyboard.createCursorKeys();

		this.physics.add.collider(this.player, this.mapManager.layer);
	}

	createPlayer() {
		const { x, y } = this.mapManager.getRandomNonWallPosition(map);
		this.player = this.physics.add.sprite(x * 32, y * 32, "player");
		this.player.setCollideWorldBounds(true);
		this.player.setGravityY(300);
	}

	update() {
		if (this.cursors.left.isDown) {
			this.player.setVelocityX(-160);
		} else if (this.cursors.right.isDown) {
			this.player.setVelocityX(160);
		} else {
			this.player.setVelocityX(0);
		}

		if (this.cursors.up.isDown && this.player.body?.blocked.down) {
			this.player.setVelocityY(-330);
		}
	}
}

export default PlayScene;
