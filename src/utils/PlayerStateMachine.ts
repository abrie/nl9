enum PlayerState {
  Idle,
  Running,
  Jumping,
  Grappling,
  Falling,
  Gliding
}

class PlayerStateMachine {
  private currentState: PlayerState;
  private peakHeightReached: boolean;

  constructor() {
    this.currentState = PlayerState.Idle;
    this.peakHeightReached = false;
  }

  public getCurrentState(): PlayerState {
    return this.currentState;
  }

  public handleInput(input: { up: boolean; down: boolean; left: boolean; right: boolean; shift: boolean }, isOnGround: boolean): void {
    switch (this.currentState) {
      case PlayerState.Idle:
        if (input.right || input.left) {
          this.currentState = PlayerState.Running;
        } else if (input.up && isOnGround) {
          this.currentState = PlayerState.Jumping;
        } else if (input.shift) {
          this.currentState = PlayerState.Grappling;
        }
        break;
      case PlayerState.Running:
        if (input.up && isOnGround) {
          this.currentState = PlayerState.Jumping;
        } else if (!isOnGround) {
          this.currentState = PlayerState.Falling;
        } else if (input.shift) {
          this.currentState = PlayerState.Grappling;
        } else if (!input.right && !input.left) {
          this.currentState = PlayerState.Idle;
        }
        break;
      case PlayerState.Jumping:
        if (!isOnGround && this.peakHeightReached) {
          this.currentState = PlayerState.Falling;
        } else if (input.shift) {
          this.currentState = PlayerState.Grappling;
        } else if (input.right || input.left) {
          this.currentState = PlayerState.Running;
        } else {
          this.currentState = PlayerState.Idle;
        }
        break;
      case PlayerState.Grappling:
        if (!input.shift) {
          this.currentState = PlayerState.Falling;
        } else if (input.up) {
          this.currentState = PlayerState.Gliding;
        } else if (isOnGround) {
          this.currentState = PlayerState.Idle;
        }
        break;
      case PlayerState.Falling:
        if (isOnGround) {
          this.currentState = PlayerState.Idle;
        }
        break;
      case PlayerState.Gliding:
        if (!input.up) {
          this.currentState = PlayerState.Falling;
        } else if (isOnGround) {
          this.currentState = PlayerState.Idle;
        }
        break;
    }
  }

  public updateVerticalVelocity(velocityY: number): void {
    if (this.currentState === PlayerState.Jumping && velocityY >= 0) {
      this.peakHeightReached = true;
    }
  }
}

export { PlayerState, PlayerStateMachine };
