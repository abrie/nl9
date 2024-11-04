import Phaser from "phaser";
import MapManager from "../utils/MapManager";
import MapGenerator from "../utils/MapGenerator";
import { generateSolidColorTexture } from "../utils/TextureGenerator";

class PlayScene extends Phaser.Scene {
	private mapManager: MapManager;
	private player!: Phaser.Physics.Arcade.Sprite;
	private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
	private grapplingHook!: Phaser.GameObjects.Graphics;
	private shiftKey!: Phaser.Input.Keyboard.Key;

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
		this.shiftKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);

		this.physics.add.collider(this.player, this.mapManager.layer);

		this.grapplingHook = this.add.graphics({ lineStyle: { width: 2, color: 0xff0000 } });
	}

	createPlayer(map) {
		const { x, y } = this.mapManager.getRandomNonWallPosition(map);
		this.player = this.physics.add.sprite(x * 32 + 16, y * 32 + 16, "player");
		this.player.setCollideWorldBounds(true);
		this.player.setGravityY(300);
		this.player.setOrigin(0.5, 0.5);
	}

	update() {
		if (this.shiftKey.isDown) {
			this.player.setVelocityX(0);

			if (this.cursors.up.isDown) {
				this.player.setVelocityY(-160);
			} else if (this.cursors.down.isDown) {
				this.player.setVelocityY(160);
			} else {
				this.player.setVelocityY(0);
			}

			this.drawGrapplingHook();
		} else {
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

			this.grapplingHook.clear();
		}
	}

	drawGrapplingHook() {
		const playerX = this.player.x;
		const playerY = this.player.y;
		const tileX = Math.floor(playerX / 32);
		const tileY = Math.floor(playerY / 32);

		for (let y = tileY; y >= 0; y--) {
			const tile = this.mapManager.layer.getTileAt(tileX, y);
			if (tile && tile.index === this.mapManager.layer.tileset[1].firstgid) {
				this.grapplingHook.clear();
				this.grapplingHook.lineBetween(playerX, playerY, playerX, (y + 1) * 32);
				break;
			}
		}
	}
}

export default PlayScene;
