import InputManager from "./InputManager";

class PlayerStateMachine {
  private currentState: string;
  private player: Phaser.Physics.Arcade.Sprite;
  private hyperValues: { gravity: number; jump: number }[];
  private hyper: number;

  constructor(player: Phaser.Physics.Arcade.Sprite, hyperValues: { gravity: number; jump: number }[], hyper: number) {
    this.currentState = "Idle";
    this.player = player;
    this.hyperValues = hyperValues;
    this.hyper = hyper;
  }

  update(input: InputManager) {
    this.handleInput(input);
  }

  enterState(state: string) {
    this.currentState = state;
    switch (state) {
      case "Idle":
        this.player.setVelocityX(0);
        break;
      case "Running":
        // Velocity will be set in handleInput based on direction
        break;
      case "Jumping":
        this.player.setVelocityY(this.hyperValues[this.hyper].jump);
        break;
      case "Grappling":
        this.player.setVelocityX(0);
        break;
      case "Gliding":
        // Velocity will be set in handleInput based on direction
        break;
    }
  }

  exitState(state: string) {
    // Clean up any state-specific variables or conditions if needed
  }

  getCurrentState() {
    return this.currentState;
  }

  handleInput(input: InputManager) {
    switch (this.currentState) {
      case "Idle":
        if (input.inputs.left || input.inputs.right) {
          this.enterState("Running");
        } else if (input.inputs.up && this.player.body?.blocked.down) {
          this.enterState("Jumping");
        } else if (input.inputs.shift) {
          this.enterState("Grappling");
        }
        break;
      case "Running":
        if (input.inputs.left) {
          this.player.setVelocityX(-160);
        } else if (input.inputs.right) {
          this.player.setVelocityX(160);
        } else {
          this.enterState("Idle");
        }
        if (input.inputs.up && this.player.body?.blocked.down) {
          this.enterState("Jumping");
        } else if (input.inputs.shift) {
          this.enterState("Grappling");
        }
        break;
      case "Jumping":
        if (input.inputs.left || input.inputs.right) {
          this.enterState("Gliding");
        }
        break;
      case "Grappling":
        if (!input.inputs.shift) {
          this.enterState("Idle");
        }
        if (input.inputs.up) {
          this.player.setVelocityY(-160);
        } else if (input.inputs.down) {
          this.player.setVelocityY(160);
        } else {
          this.player.setVelocityY(0);
        }
        break;
      case "Gliding":
        if (input.inputs.left) {
          this.player.setVelocityX(-160);
        } else if (input.inputs.right) {
          this.player.setVelocityX(160);
        } else {
          this.enterState("Idle");
        }
        break;
    }
  }
}

export default PlayerStateMachine;
