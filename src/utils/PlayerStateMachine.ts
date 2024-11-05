import InputManager from "./InputManager";

class PlayerStateMachine {
  private currentState: string;
  private player: Phaser.Physics.Arcade.Sprite;
  private hyperValues: { gravity: number; jump: number }[];

  constructor(player: Phaser.Physics.Arcade.Sprite, hyperValues: { gravity: number; jump: number }[]) {
    this.currentState = "Idle";
    this.player = player;
    this.hyperValues = hyperValues;
  }

  update(input: InputManager) {
    this.handleInput(input);
  }

  enterState(state: string) {
    this.exitState(this.currentState);
    this.currentState = state;

    switch (state) {
      case "Idle":
        this.player.setVelocityX(0);
        break;
      case "Running":
        // Velocity will be set based on input
        break;
      case "Jumping":
        this.player.setVelocityY(this.hyperValues[0].jump);
        break;
      case "Grappling":
        this.player.setVelocityX(0);
        break;
      case "Gliding":
        // Velocity will be set based on input
        break;
      case "Falling":
        // Gravity will handle the falling velocity
        break;
    }
  }

  exitState(state: string) {
    // Clean up any state-specific variables or conditions
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
        if (input.inputs.up && this.player.body?.blocked.down) {
          this.enterState("Jumping");
        } else if (input.inputs.shift) {
          this.enterState("Grappling");
        } else if (!input.inputs.left && !input.inputs.right) {
          this.enterState("Idle");
        }
        break;
      case "Jumping":
        if (input.inputs.left || input.inputs.right) {
          this.enterState("Gliding");
        } else if (this.player.body?.velocity.y > 0) {
          this.enterState("Falling");
        }
        break;
      case "Grappling":
        if (!input.inputs.shift) {
          this.enterState("Idle");
        }
        break;
      case "Gliding":
        if (this.player.body?.velocity.y > 0) {
          this.enterState("Falling");
        }
        break;
      case "Falling":
        if (this.player.body?.blocked.down) {
          this.enterState("Idle");
        }
        break;
    }
  }
}

export default PlayerStateMachine;
