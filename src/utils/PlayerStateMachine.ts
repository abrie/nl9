class PlayerStateMachine {
  private currentState: string;
  private player: Phaser.Physics.Arcade.Sprite;
  private inputManager: InputManager;
  private hyperValues: { gravity: number; jump: number }[];
  private grapplingHookDeployed: boolean;
  private grapplingHookDeploying: boolean;
  private grapplingHookRetracting: boolean;

  constructor(player: Phaser.Physics.Arcade.Sprite, inputManager: InputManager, hyperValues: { gravity: number; jump: number }[]) {
    this.currentState = 'Idle';
    this.player = player;
    this.inputManager = inputManager;
    this.hyperValues = hyperValues;
    this.grapplingHookDeployed = false;
    this.grapplingHookDeploying = false;
    this.grapplingHookRetracting = false;
  }

  update() {
    switch (this.currentState) {
      case 'Idle':
        this.handleIdleState();
        break;
      case 'Walking':
        this.handleWalkingState();
        break;
      case 'Jumping':
        this.handleJumpingState();
        break;
      case 'Falling':
        this.handleFallingState();
        break;
      case 'GrapplingHookDeploying':
        this.handleGrapplingHookDeployingState();
        break;
      case 'GrapplingHookDeployed':
        this.handleGrapplingHookDeployedState();
        break;
      case 'GrapplingHookRetracting':
        this.handleGrapplingHookRetractingState();
        break;
    }
  }

  private handleIdleState() {
    if (this.inputManager.inputs.left || this.inputManager.inputs.right) {
      this.transitionTo('Walking');
    } else if (this.inputManager.inputs.up && this.player.body?.blocked.down) {
      this.transitionTo('Jumping');
    } else if (this.inputManager.inputs.shift) {
      this.transitionTo('GrapplingHookDeploying');
    }
  }

  private handleWalkingState() {
    if (this.inputManager.inputs.left) {
      this.player.setVelocityX(-160);
    } else if (this.inputManager.inputs.right) {
      this.player.setVelocityX(160);
    } else {
      this.player.setVelocityX(0);
      this.transitionTo('Idle');
    }

    if (this.inputManager.inputs.up && this.player.body?.blocked.down) {
      this.transitionTo('Jumping');
    } else if (this.inputManager.inputs.shift) {
      this.transitionTo('GrapplingHookDeploying');
    }
  }

  private handleJumpingState() {
    if (this.player.body?.velocity.y > 0) {
      this.transitionTo('Falling');
    }
  }

  private handleFallingState() {
    if (this.player.body?.blocked.down) {
      this.transitionTo('Idle');
    }
  }

  private handleGrapplingHookDeployingState() {
    // Implement grappling hook deploying logic
    this.transitionTo('GrapplingHookDeployed');
  }

  private handleGrapplingHookDeployedState() {
    if (this.inputManager.inputs.up) {
      this.player.setVelocityY(-160);
    } else if (this.inputManager.inputs.down) {
      this.player.setVelocityY(160);
    } else {
      this.player.setVelocityY(0);
    }

    if (!this.inputManager.inputs.shift) {
      this.transitionTo('GrapplingHookRetracting');
    }
  }

  private handleGrapplingHookRetractingState() {
    // Implement grappling hook retracting logic
    this.transitionTo('Idle');
  }

  private transitionTo(state: string) {
    this.currentState = state;
  }
}

export default PlayerStateMachine;
