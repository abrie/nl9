import Phaser from "phaser";

class InputManager {
  private scene: Phaser.Scene;
  public inputs: { up: boolean; down: boolean; left: boolean; right: boolean; z: boolean; x: boolean; c: boolean };
  private keys: { up: Phaser.Input.Keyboard.Key; down: Phaser.Input.Keyboard.Key; left: Phaser.Input.Keyboard.Key; right: Phaser.Input.Keyboard.Key; z: Phaser.Input.Keyboard.Key; x: Phaser.Input.Keyboard.Key; c: Phaser.Input.Keyboard.Key };

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.inputs = { up: false, down: false, left: false, right: false, z: false, x: false, c: false };

    if (!this.scene.input.keyboard) {
      throw new Error("Keyboard input is not available.");
    }

    const keyboard = this.scene.input.keyboard;
    this.keys = {
      up: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP),
      down: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN),
      left: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT),
      right: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT),
      z: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z),
      x: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X),
      c: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.C)
    };
  }

  updateInputs() {
    this.inputs.up = this.keys.up.isDown;
    this.inputs.down = this.keys.down.isDown;
    this.inputs.left = this.keys.left.isDown;
    this.inputs.right = this.keys.right.isDown;
    this.inputs.z = this.keys.z.isDown;
    this.inputs.x = this.keys.x.isDown;
    this.inputs.c = this.keys.c.isDown;
  }
}

export default InputManager;
