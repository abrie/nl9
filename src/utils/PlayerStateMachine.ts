import InputManager from "./InputManager";

class PlayerStateMachine {
  private currentState: string;

  constructor() {
    this.currentState = "Idle";
  }

  update(input: InputManager) {
    this.handleInput(input);
  }

  enterState(state: string) {
    this.currentState = state;
    // Add logic for entering a new state if needed
  }

  exitState(state: string) {
    // Add logic for exiting the current state if needed
  }

  getCurrentState() {
    return this.currentState;
  }

  handleInput(input: InputManager) {
    switch (this.currentState) {
      case "Idle":
        if (input.inputs.left || input.inputs.right) {
          this.enterState("Running");
        } else if (input.inputs.shift) {
          this.enterState("Grappling");
        }
        break;
      case "Running":
        if (input.inputs.up) {
          this.enterState("Jumping");
        } else if (input.inputs.shift) {
          this.enterState("Grappling");
        }
        break;
      case "Jumping":
        // Add logic for handling input while in the Jumping state
        break;
      case "Grappling":
        // Add logic for handling input while in the Grappling state
        break;
      default:
        break;
    }
  }
}

export default PlayerStateMachine;
