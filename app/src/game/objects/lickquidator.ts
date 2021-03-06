import { getGameHeight  } from '../helpers';
import {  LICKQUIDATOR   } from 'game/assets';

export class Lickquidator extends Phaser.GameObjects.Sprite {
  private groundY = 0;
  private isWaiting = false;
  public isDead = false;
  public positionIndex= 0;
  public sessionID?:number;

 constructor(scene: Phaser.Scene) {
   super(scene, -100, -100, LICKQUIDATOR , 0);
   this.setOrigin(0, 0);
   this.displayHeight = getGameHeight(scene) * 0.18;
   this.displayWidth = getGameHeight(scene) * 0.18;

   // physics
   this.scene.physics.world.enable(this);
   (this.body as Phaser.Physics.Arcade.Body).setGravityY(getGameHeight(this.scene) * 3);

   // creating animation
    this.anims.create({
      key: 'licking',
      frames: this.anims.generateFrameNumbers(LICKQUIDATOR || '', { start: 0, end: 11 }),
      frameRate: 10,
      repeat: -1,
    });

   this.scene.add.existing(this);
 }

 public activate = (x: number, y: number, positionIndex: number, velocityY: number, sessionID: number) => {
    // Physics
    (this.body as Phaser.Physics.Arcade.Body).setVelocityY(velocityY);

    this.setPosition(x - this.displayWidth/2, y - this.displayHeight);
    this.positionIndex=positionIndex;
    this.groundY = y - this.displayHeight;
    this.sessionID = sessionID;

    this.anims.play('licking');
  }

  public update = () => {
    if (this.y > this.groundY && this.isWaiting == false ){
      (this.body as Phaser.Physics.Arcade.Body).setVelocityY( 0 );  
      (this.body as Phaser.Physics.Arcade.Body).setGravityY( 0 );
      this.isWaiting = true;
    }

  }

  public getDead(): boolean {
    return this.isDead;
  }
  
  public setDead(dead: boolean): void {
    this.isDead = dead;
    if (dead == true){
      //this.anims.play('dead');
      this.destroy(); 
    }
  }

}