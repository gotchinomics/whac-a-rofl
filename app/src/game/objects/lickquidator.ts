import { getGameHeight  } from '../helpers';
import {  LICKQUIDATOR , GONE  } from 'game/assets';

export class Lickquidator extends Phaser.GameObjects.Image {
  private health = 200;
  private groundY = 0;
  private isGodlike = true;
  private isWaiting = false;
  public isDead = false;
  public position= 0;
  private gone?: Phaser.Sound.BaseSound;
  //private squash?: Phaser.Sound.BaseSound;

 constructor(scene: Phaser.Scene) {
   super(scene, -100, -100, LICKQUIDATOR , 0);
   this.setOrigin(0, 0);
   this.displayHeight = getGameHeight(scene) * 0.15;
   this.displayWidth = getGameHeight(scene) * 0.15;

   // physics
   this.scene.physics.world.enable(this);
   (this.body as Phaser.Physics.Arcade.Body).setGravityY(getGameHeight(this.scene) * 2);

   //sounds
   this.gone = this.scene.sound.add(GONE, { loop: false });
   //this.squash = this.scene.sound.add(SQUASH, { loop: false });

   this.scene.add.existing(this);
 }

 public activate = (x: number, y: number, position: number, velocityY: number) => {
    // Physics
    (this.body as Phaser.Physics.Arcade.Body).setVelocityY(velocityY);

    this.setPosition(x, y);
    this.position=position;

    this.groundY = this.y;
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