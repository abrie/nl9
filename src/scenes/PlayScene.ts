import Phaser from "phaser";
import MapManager from "../utils/MapManager";
import MapGenerator from "../utils/MapGenerator";

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
		this.load.image("player", "path/to/player/texture.png");
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

		this.player = this.physics.add.sprite(100, 100, "player");
		this.player.setCollideWorldBounds(true);
		this.player.setGravityY(300);

		this.cursors = this.input.keyboard.createCursorKeys();

		this.physics.add.collider(this.player, this.mapManager.layer);

		this.mapManager.layer.setCollisionByExclusion([-1, 0]);
	}

	update() {
		if (this.cursors.left.isDown) {
			this.player.setVelocityX(-160);
		} else if (this.cursors.right.isDown) {
			this.player.setVelocityX(160);
		} else {
			this.player.setVelocityX(0);
		}

		if (this.cursors.up.isDown && this.player.body.touching.down) {
			this.player.setVelocityY(-330);
		}
	}
}

export default PlayScene;
