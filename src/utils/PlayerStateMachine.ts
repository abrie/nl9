import InputManager from "./InputManager";

class PlayerStateMachine {
  private currentState: string;
  private player: Phaser.Physics.Arcade.Sprite;
  private hyperValues: { gravity: number; jump: number }[];
  private lastStates: string[];

  constructor(player: Phaser.Physics.Arcade.Sprite, hyperValues: { gravity: number; jump: number }[]) {
    this.currentState = "Idle";
    this.player = player;
    this.hyperValues = hyperValues;
    this.lastStates = [];
  }

  update(input: InputManager) {
    const onGround = this.player.body?.blocked.down;
    this.handleInput(input, onGround);
  }

  enterState(state: string) {
    this.exitState(this.currentState);
    this.currentState = state;
    this.lastStates.push(state);
    if (this.lastStates.length > 4) {
      this.lastStates.shift();
    }

    switch (state) {
      case "Idle":
        this.player.setVelocityX(0);
        break;
      case "Running":
        break;
      case "Jumping":
        this.player.setVelocityY(this.hyperValues[0].jump);
        break;
      case "Gliding":
        break;
      case "Falling":
        break;
      case "Grappling":
        this.player.setVelocityX(0);
        break;
    }
  }

  exitState(state: string) {
    // Clean up state-specific variables or conditions
  }

  getCurrentState() {
    return this.currentState;
  }

  getLastStates() {
    return this.lastStates;
  }

  handleInput(input: InputManager, onGround: boolean) {
    switch (this.currentState) {
      case "Idle":
        if (input.inputs.left || input.inputs.right) {
          this.enterState("Running");
        } else if (input.inputs.up && onGround) {
          this.enterState("Jumping");
        } else if (input.inputs.shift) {
          this.enterState("Grappling");
        }
        break;
      case "Running":
        if (input.inputs.up && onGround) {
          this.enterState("Jumping");
        } else if (input.inputs.shift) {
          this.enterState("Grappling");
        }
        break;
      case "Jumping":
        if (input.inputs.left || input.inputs.right) {
          this.enterState("Gliding");
        } else if (this.player.body?.velocity.y > 0) {
          this.enterState("Falling");
        }
        break;
      case "Gliding":
        if (input.inputs.shift) {
          this.enterState("Grappling");
        }
        break;
      case "Falling":
        if (onGround) {
          this.enterState("Idle");
        }
        break;
      case "Grappling":
        if (!input.inputs.shift) {
          this.enterState("Idle");
        }
        break;
    }
  }
}

export default PlayerStateMachine;
