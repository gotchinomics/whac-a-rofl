import{ getGameHeight } from 'game/helpers';
import{ getGameWidth } from 'game/helpers';

interface Props {
  scene: Phaser.Scene;
  x: number;
  y: number;
  key: string;
  frame?: number;
}

export class Player extends Phaser.GameObjects.Sprite {
  private hitKey: Phaser.Input.Keyboard.Key;
  private pointer: Phaser.Input.Pointer;
  private cursorKeys?: Phaser.Types.Input.Keyboard.CursorKeys;
  private isHitting = false;
  private isDead = false;
  private lives = 4;
  public speed = 1000;

  constructor({ scene, x, y, key }: Props) {
    super(scene, x, y, key);
    this.displayHeight = getGameHeight(scene) * 0.15;
    this.displayWidth = getGameHeight(scene) * 0.15;

    // sprite
    this.setOrigin(0, 0);

    // Add animations
    this.anims.create({
      key: 'idle',
      frames: this.anims.generateFrameNumbers(key || '', { frames: [0] }),
      frameRate: 2,
      repeat: -1,
    });
    this.anims.create({
      key: 'hit',
      frames: this.anims.generateFrameNumbers(key || '', { frames: [ 2, 3] }),
      frameRate: 8,
      repeat: -1,
    });
    this.anims.create({
      key: 'dead',
      frames: this.anims.generateFrameNumbers(key || '', { frames: [ 4 ]}),
    });

    // physics
    this.scene.physics.world.enable(this);
   // (this.body as Phaser.Physics.Arcade.Body).setGravityY(getGameHeight(this.scene) * 1.5);

    // input
    this.cursorKeys = this.scene.input.keyboard.createCursorKeys();
    this.pointer = this.scene.input.activePointer;
    this.hitKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    this.scene.add.existing(this);
  }

  update(): void {

    if (!this.isDead){

      // Every frame, we create a new velocity for the sprite based on what keys the player is holding down.
      const velocity = new Phaser.Math.Vector2(0, 0);

      // Handling mouse input
      if (this.pointer.isDown && this.pointer.getDuration()<50 ){
        this.setPosition( this.pointer.position.x - (getGameWidth(this.scene)*0.045) , this.pointer.position.y - (getGameWidth(this.scene)*0.045) );
      }
    
      // Horizontal movement
      switch (true) {
       case this.cursorKeys?.left.isDown && this.x > 10:
         velocity.x -= 1;
         break;
       case this.cursorKeys?.right.isDown && this.x < (getGameWidth(this.scene)-150) :
         velocity.x += 1;
         break;
       default: 
      }
 
      // Vertical movement
      switch (true) {
        case this.cursorKeys?.down.isDown && this.y < (getGameHeight(this.scene)-150) :
         velocity.y += 1;
         break;
        case this.cursorKeys?.up.isDown && this.y > 300:
          velocity.y -= 1;
          break;
        default:
      }

      this.animGotchiIdle();
 
      // We normalize the velocity so that the player is always moving at the same speed, regardless of direction.
      const normalizedVelocity = velocity.normalize();
      (this.body as Phaser.Physics.Arcade.Body).setVelocity(normalizedVelocity.x * this.speed, normalizedVelocity.y * this.speed);

      // handling hitting input
      if ( (this.hitKey.isDown || this.pointer.isDown)  && !this.isHitting) {
        // jump
        this.isHitting = true;
        this.anims.play('hit');
    
         //(this.body as Phaser.Physics.Arcade.Body).setVelocityY(-getGameHeight(this.scene) * 0.6);
    
      } else if (this.hitKey.isUp && !this.pointer.isDown && this.isHitting)  {
          this.isHitting = false;
      }

    }
    
  }

public animGotchiIdle = () => {
    if ( !this.isHitting && !this.isDead ){
      this.anims.play('idle', false);
    } 
}

public getDead(): boolean {
  return this.isDead;
}

private setDead(dead: boolean): void {
  this.isDead = dead;
}

public removeLife(){
  this.lives -= 1;
  if (this.lives<1){
    this.anims.play('dead');
    (this.body as Phaser.Physics.Arcade.Body).setVelocity(0);
    this.setDead(true);
  }
}

public getLives(): number {
  return this.lives;
}

public getLivesString(): string {
  return this.lives.toString();
}

}
