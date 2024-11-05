import InputManager from "./InputManager";

class PlayerStateMachine {
  private currentState: string;
  private player: Phaser.Physics.Arcade.Sprite;
  private hyperValues: { gravity: number; jump: number }[];
  private stateHistory: string[];

  constructor(player: Phaser.Physics.Arcade.Sprite, hyperValues: { gravity: number; jump: number }[]) {
    this.currentState = "Idle";
    this.player = player;
    this.hyperValues = hyperValues;
    this.stateHistory = [];
  }

  update(input: InputManager) {
    this.handleInput(input);
  }

  enterState(state: string) {
    this.stateHistory.push(this.currentState);
    if (this.stateHistory.length > 4) {
      this.stateHistory.shift();
    }
    this.currentState = state;
    switch (state) {
      case "Idle":
        this.player.setVelocityX(0);
        break;
      case "Running":
        // Horizontal velocity will be set in handleInput method
        break;
      case "Jumping":
        this.player.setVelocityY(this.hyperValues[0].jump);
        break;
      case "Grappling":
        this.player.setVelocityX(0);
        break;
      case "Gliding":
        // Horizontal velocity will be set in handleInput method
        break;
      case "Falling":
        this.player.setVelocityY(0);
        break;
    }
  }

  exitState(state: string) {
    // Clean up any variables or conditions related to the current state
  }

  getCurrentState() {
    return this.currentState;
  }

  getStateHistory() {
    return this.stateHistory;
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
        } else if (this.player.body?.velocity.y > 0) {
          this.enterState("Falling");
        }
        break;
      case "Grappling":
        if (input.inputs.up) {
          this.player.setVelocityY(-160);
        } else if (input.inputs.down) {
          this.player.setVelocityY(160);
        } else {
          this.player.setVelocityY(0);
        }
        if (!input.inputs.shift) {
          this.enterState("Idle");
        }
        break;
      case "Gliding":
        if (input.inputs.left) {
          this.player.setVelocityX(-160);
        } else if (input.inputs.right) {
          this.player.setVelocityX(160);
        } else {
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
