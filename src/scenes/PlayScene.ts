import Phaser from "phaser";
import MapManager from "../utils/MapManager";
import MapGenerator from "../utils/MapGenerator";
import { generateSolidColorTexture } from "../utils/TextureGenerator";

class PlayScene extends Phaser.Scene {
	private mapManager: MapManager;
	private player!: Phaser.Physics.Arcade.Sprite;
	private inputs!: {
		up: boolean,
		down: boolean,
		left: boolean,
		right: boolean,
		z: boolean,
		x: boolean,
		c: boolean
	};
	private grapplingHook!: Phaser.GameObjects.Graphics;
	private shiftKey!: Phaser.Input.Keyboard.Key;
	private movementMode: number;
	private acceleration: number;
	private modeText!: Phaser.GameObjects.Text;
	private hyper: number;
	private hyperText!: Phaser.GameObjects.Text;
	private hyperValues: { gravity: number; jump: number }[];

	constructor() {
		super({ key: "PlayScene" });
		this.mapManager = new MapManager(this);
		this.movementMode = 1;
		this.acceleration = 300;
		this.hyper = 0;
		this.hyperValues = [
			{ gravity: 400, jump: -330 },
			{ gravity: 800 * 2, jump: -440 },
			{ gravity: 1066 * 2, jump: -586 },
			{ gravity: 1422 * 2, jump: -781 },
			{ gravity: 1896 * 2, jump: -1041 },
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

		const { x, y } = this.mapManager.getRandomNonWallPosition(map);
		this.createPlayer(x, y);

		this.shiftKey = this.input.keyboard.addKey(
			Phaser.Input.Keyboard.KeyCodes.SHIFT,
		);

		this.physics.add.collider(this.player, this.mapManager.layer);

		this.grapplingHook = this.add.graphics({
			lineStyle: { width: 2, color: 0xff0000 },
		});

		this.input.keyboard.on("keydown-Z", this.toggleMovementMode, this);
		this.input.keyboard.on("keydown-X", this.decreaseHyper, this);
		this.input.keyboard.on("keydown-C", this.increaseHyper, this);

		this.modeText = this.add.text(10, 10, "Mode: 1", {
			fontSize: "16px",
			fill: "#fff",
		});
		this.hyperText = this.add.text(10, 30, "Hyper: 0", {
			fontSize: "16px",
			fill: "#fff",
		});
	}

	createPlayer(x: number, y: number) {
		this.player = this.physics.add.sprite(x * 32 + 16, y * 32 + 16, "player");
		this.player.setCollideWorldBounds(true);
		this.updateHyper();
		this.player.setOrigin(0.5, 0.5);
	}

	update() {
		this.updateInputs();

		if (this.shiftKey.isDown) {
			this.player.setVelocityX(0);

			if (this.inputs.up) {
				this.player.setVelocityY(-160);
			} else if (this.inputs.down) {
				this.player.setVelocityY(160);
			} else {
				this.player.setVelocityY(0);
			}

			this.drawGrapplingHook();
		} else {
			if (this.movementMode === 1) {
				if (this.inputs.left) {
					this.player.setVelocityX(-160);
				} else if (this.inputs.right) {
					this.player.setVelocityX(160);
				} else {
					this.player.setVelocityX(0);
				}
			} else if (this.movementMode === 2) {
				if (this.inputs.left) {
					this.player.setAccelerationX(-this.acceleration);
				} else if (this.inputs.right) {
					this.player.setAccelerationX(this.acceleration);
				} else {
					this.player.setAccelerationX(0);
				}
			}

			if (this.inputs.up && this.player.body?.blocked.down) {
				this.player.setVelocityY(this.hyperValues[this.hyper].jump);
			}

			this.grapplingHook.clear();
		}
		this.updateHud();
	}

	updateInputs() {
		if (!this.input.keyboard) {
			const errorMessage = "Keyboard input is not available.";
			console.error(errorMessage);
			throw new Error(errorMessage);
		}

		this.inputs = {
			up: this.input.keyboard.keys[Phaser.Input.Keyboard.KeyCodes.UP].isDown,
			down: this.input.keyboard.keys[Phaser.Input.Keyboard.KeyCodes.DOWN].isDown,
			left: this.input.keyboard.keys[Phaser.Input.Keyboard.KeyCodes.LEFT].isDown,
			right: this.input.keyboard.keys[Phaser.Input.Keyboard.KeyCodes.RIGHT].isDown,
			z: this.input.keyboard.keys[Phaser.Input.Keyboard.KeyCodes.Z].isDown,
			x: this.input.keyboard.keys[Phaser.Input.Keyboard.KeyCodes.X].isDown,
			c: this.input.keyboard.keys[Phaser.Input.Keyboard.KeyCodes.C].isDown
		};
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
