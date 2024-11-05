enum PlayerState {
  Idle,
  Running,
  Jumping,
  Grappling,
  Falling,
  Gliding
}

class PlayerStateMachine {
  private player: Phaser.Physics.Arcade.Sprite;
  private currentState: PlayerState;

  constructor(player: Phaser.Physics.Arcade.Sprite) {
    this.player = player;
    this.currentState = PlayerState.Idle;
  }

  update(inputManager: InputManager, isOnGround: boolean, verticalVelocity: number) {
    switch (this.currentState) {
      case PlayerState.Idle:
        if (inputManager.inputs.left || inputManager.inputs.right) {
          this.currentState = PlayerState.Running;
        } else if (inputManager.inputs.up) {
          this.currentState = PlayerState.Jumping;
        } else if (inputManager.inputs.shift) {
          this.currentState = PlayerState.Grappling;
        }
        break;
      case PlayerState.Running:
        if (inputManager.inputs.up) {
          this.currentState = PlayerState.Jumping;
        } else if (!isOnGround) {
          this.currentState = PlayerState.Falling;
        } else if (inputManager.inputs.shift) {
          this.currentState = PlayerState.Grappling;
        } else if (!inputManager.inputs.left && !inputManager.inputs.right) {
          this.currentState = PlayerState.Idle;
        }
        break;
      case PlayerState.Jumping:
        if (verticalVelocity > 0) {
          this.currentState = PlayerState.Falling;
        } else if (inputManager.inputs.shift) {
          this.currentState = PlayerState.Grappling;
        } else if (inputManager.inputs.left || inputManager.inputs.right) {
          this.currentState = PlayerState.Running;
        } else if (isOnGround) {
          this.currentState = PlayerState.Idle;
        }
        break;
      case PlayerState.Grappling:
        if (verticalVelocity > 0) {
          this.currentState = PlayerState.Falling;
        } else if (inputManager.inputs.left || inputManager.inputs.right) {
          this.currentState = PlayerState.Running;
        } else if (isOnGround) {
          this.currentState = PlayerState.Idle;
        }
        break;
      case PlayerState.Falling:
        if (inputManager.inputs.shift) {
          this.currentState = PlayerState.Grappling;
        } else if (isOnGround) {
          this.currentState = PlayerState.Idle;
        }
        break;
      case PlayerState.Gliding:
        if (isOnGround) {
          this.currentState = PlayerState.Idle;
        }
        break;
    }
  }

  getCurrentState(): PlayerState {
    return this.currentState;
  }

  printCurrentState() {
    const stateText = this.player.scene.add.text(this.player.x, this.player.y - 20, PlayerState[this.currentState], {
      fontSize: '12px',
      color: '#ffffff',
      backgroundColor: '#000000'
    });
    stateText.setOrigin(0.5, 0.5);
  }
}

export { PlayerState, PlayerStateMachine };
