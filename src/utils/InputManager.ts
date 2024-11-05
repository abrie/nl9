import Phaser from "phaser";

class InputManager {
  private scene: Phaser.Scene;
  public inputs: { up: boolean; down: boolean; left: boolean; right: boolean; x: boolean; c: boolean; shift: boolean };
  private keys: { up: Phaser.Input.Keyboard.Key; down: Phaser.Input.Keyboard.Key; left: Phaser.Input.Keyboard.Key; right: Phaser.Input.Keyboard.Key; x: Phaser.Input.Keyboard.Key; c: Phaser.Input.Keyboard.Key; shift: Phaser.Input.Keyboard.Key };

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.inputs = { up: false, down: false, left: false, right: false, x: false, c: false, shift: false };

    if (!this.scene.input.keyboard) {
      throw new Error("Keyboard input is not available.");
    }

    const keyboard = this.scene.input.keyboard;
    this.keys = {
      up: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP),
      down: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN),
      left: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT),
      right: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT),
      x: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X),
      c: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.C),
      shift: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT)
    };
  }

  updateInputs() {
    this.inputs.up = this.keys.up.isDown;
    this.inputs.down = this.keys.down.isDown;
    this.inputs.left = this.keys.left.isDown;
    this.inputs.right = this.keys.right.isDown;
    this.inputs.x = this.keys.x.isDown;
    this.inputs.c = this.keys.c.isDown;
    this.inputs.shift = this.keys.shift.isDown;
  }
}

export default InputManager;
