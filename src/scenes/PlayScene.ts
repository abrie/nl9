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
	private zKey!: Phaser.Input.Keyboard.Key;
	private xKey!: Phaser.Input.Keyboard.Key;
	private cKey!: Phaser.Input.Keyboard.Key;
	private movementMode: number;
	private acceleration: number;
	private modeText!: Phaser.GameObjects.Text;
	private hyper: number;
	private hyperText!: Phaser.GameObjects.Text;
	private hyperValues: { gravity: number, jump: number }[];

	constructor() {
		super({ key: "PlayScene" });
		this.mapManager = new MapManager(this);
		this.movementMode = 1;
		this.acceleration = 300;
		this.hyper = 0;
		this.hyperValues = [
			{ gravity: 400, jump: -330 },
			{ gravity: 800, jump: -440 },
			{ gravity: 1066, jump: -586 },
			{ gravity: 1422, jump: -781 },
			{ gravity: 1896, jump: -1041 }
		];
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
		this.zKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
		this.xKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X);
		this.cKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.C);

		this.physics.add.collider(this.player, this.mapManager.layer);

		this.grapplingHook = this.add.graphics({ lineStyle: { width: 2, color: 0xff0000 } });

		this.zKey.on('down', this.toggleMovementMode, this);
		this.xKey.on('down', this.decreaseHyper, this);
		this.cKey.on('down', this.increaseHyper, this);

		this.modeText = this.add.text(10, 10, 'Mode: 1', { fontSize: '16px', fill: '#fff' });
		this.hyperText = this.add.text(10, 30, 'Hyper: 0', { fontSize: '16px', fill: '#fff' });
	}

	createPlayer(map) {
		const { x, y } = this.mapManager.getRandomNonWallPosition(map);
		this.player = this.physics.add.sprite(x * 32 + 16, y * 32 + 16, "player");
		this.player.setCollideWorldBounds(true);
		this.updateHyper();
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
			if (this.movementMode === 1) {
				if (this.cursors.left.isDown) {
					this.player.setVelocityX(-160);
				} else if (this.cursors.right.isDown) {
					this.player.setVelocityX(160);
				} else {
					this.player.setVelocityX(0);
				}
			} else if (this.movementMode === 2) {
				if (this.cursors.left.isDown) {
					this.player.setAccelerationX(-this.acceleration);
				} else if (this.cursors.right.isDown) {
					this.player.setAccelerationX(this.acceleration);
				} else {
					this.player.setAccelerationX(0);
				}
			}

			if (this.cursors.up.isDown && this.player.body?.blocked.down) {
				this.player.setVelocityY(this.hyperValues[this.hyper].jump);
			}

			this.grapplingHook.clear();
		}
		this.updateHud();
	}

	toggleMovementMode() {
		this.movementMode = this.movementMode === 1 ? 2 : 1;
		this.updateHud();
	}

	decreaseHyper() {
		if (this.hyper > 0) {
			this.hyper--;
			this.updateHyper();
		}
	}

	increaseHyper() {
		if (this.hyper < 4) {
			this.hyper++;
			this.updateHyper();
		}
	}

	updateHyper() {
		this.player.setGravityY(this.hyperValues[this.hyper].gravity);
	}

	updateHud() {
		this.modeText.setText(`Mode: ${this.movementMode}`);
		this.hyperText.setText(`Hyper: ${this.hyper}`);
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
