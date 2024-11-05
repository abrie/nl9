import Phaser from "phaser";
import MapManager from "../utils/MapManager";
import MapGenerator from "../utils/MapGenerator";
import { generateSolidColorTexture } from "../utils/TextureGenerator";
import InputManager from "../utils/InputManager";

class PlayScene extends Phaser.Scene {
	private mapManager: MapManager;
	private player!: Phaser.Physics.Arcade.Sprite;
	private grapplingHook!: Phaser.GameObjects.Graphics;
	private acceleration: number;
	private hyper: number;
	private hyperText!: Phaser.GameObjects.Text;
	private hyperValues: { gravity: number; jump: number }[];
	private inputManager!: InputManager;
	private grapplingHookDeployed: boolean;
	private grapplingHookDeploying: boolean;
	private grapplingHookRetracting: boolean;
	private grapplingHookLength: number;
	private grapplingHookAnchorY: number | null;

	constructor() {
		super({ key: "PlayScene" });
		this.mapManager = new MapManager(this);
		this.acceleration = 300;
		this.hyper = 0;
		this.hyperValues = [
			{ gravity: 400, jump: -330 },
			{ gravity: 800 * 2, jump: -440 },
			{ gravity: 1066 * 2, jump: -586 },
			{ gravity: 1422 * 2, jump: -781 },
			{ gravity: 1896 * 2, jump: -1041 },
		];
		this.grapplingHookDeployed = false;
		this.grapplingHookDeploying = false;
		this.grapplingHookRetracting = false;
		this.grapplingHookLength = 0;
		this.grapplingHookAnchorY = null;
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

		this.physics.add.collider(this.player, this.mapManager.layer);

		this.grapplingHook = this.add.graphics({
			lineStyle: { width: 2, color: 0x00ff00 },
		});

		this.hyperText = this.add.text(10, 30, "Hyper: 0", {
			fontSize: "16px",
			fill: "#fff",
			});
		this.inputManager = new InputManager(this);
	}

	createPlayer(x: number, y: number) {
		this.player = this.physics.add.sprite(x * 32 + 16, y * 32 + 16, "player");
		this.player.setCollideWorldBounds(true);
		this.updateHyper();
		this.player.setOrigin(0.5, 0.5);
	}

	update() {
		this.inputManager.updateInputs();

		if (this.inputManager.inputs.x) {
			this.decreaseHyper();
		}
		if (this.inputManager.inputs.c) {
			this.increaseHyper();
		}

		if (this.inputManager.inputs.up && this.player.body?.blocked.down) {
			this.player.setVelocityY(this.hyperValues[this.hyper].jump);
		}

		if (!this.grapplingHookDeployed) {
			if (this.inputManager.inputs.left) {
				this.player.setVelocityX(-160);
			} else if (this.inputManager.inputs.right) {
				this.player.setVelocityX(160);
			} else {
				this.player.setVelocityX(0);
			}
		}

		if (this.inputManager.inputs.up && this.player.body?.blocked.down) {
			this.player.setVelocityY(this.hyperValues[this.hyper].jump);
		}

		if (this.inputManager.inputs.shift) {
			if (!this.grapplingHookDeployed && !this.grapplingHookDeploying) {
				this.player.setVelocityX(0);
				this.deployGrapplingHook();
			}
		} else {
			if (this.grapplingHookDeployed && !this.grapplingHookRetracting) {
				this.retractGrapplingHook();
			}
		}

		if (this.grapplingHookDeployed) {
			if (this.inputManager.inputs.up) {
				this.player.setVelocityY(-160);
				this.grapplingHookLength -= 160 / 60; // Adjust length as player moves up
			} else if (this.inputManager.inputs.down) {
				this.player.setVelocityY(160);
				this.grapplingHookLength += 160 / 60; // Adjust length as player moves down
			} else {
				this.player.setVelocityY(0);
			}
			this.drawGrapplingHook();
		}

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
		this.hyperText.setText(`Hyper: ${this.hyper}`);
	}

	drawGrapplingHook() {
		const playerX = this.player.x;
		const playerY = this.player.y;

		if (this.grapplingHookAnchorY !== null) {
			this.grapplingHook.clear();
			this.grapplingHook.lineStyle(2, 0x00ff00, 1);
			this.grapplingHook.lineBetween(playerX, playerY, playerX, this.grapplingHookAnchorY);
		}
	}

	deployGrapplingHook() {
		this.grapplingHookDeploying = true;
		this.grapplingHookLength = 0;
		const playerX = this.player.x;
		const playerY = this.player.y;
		const tileX = Math.floor(playerX / 32);
		const tileY = Math.floor(playerY / 32);

		const firstWallTileY = this.mapManager.findFirstWallTileAbove(tileX, tileY);
		if (firstWallTileY !== null) {
			this.grapplingHookLength = playerY - (firstWallTileY + 1) * 32;
			this.grapplingHookAnchorY = (firstWallTileY + 1) * 32;
			this.drawGrapplingHook();
		}

		this.grapplingHookDeploying = false;
		this.grapplingHookDeployed = true;
	}

	retractGrapplingHook() {
		this.grapplingHookRetracting = true;

		this.grapplingHookLength = 0;
		this.grapplingHook.clear();
		this.grapplingHookRetracting = false;
		this.grapplingHookDeployed = false;
		this.grapplingHookAnchorY = null;
	}
}

export default PlayScene;
