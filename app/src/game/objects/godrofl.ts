import { getGameHeight  } from '../helpers';
import {  GODROFL, GONE  } from 'game/assets';

export class Godrofl extends Phaser.GameObjects.Image {
  private health = 200;
  private yOrigin = 0;
  private isGodlike = true;
  private isWaiting = false;
  public isDead = false;
  public position= 0;
  private gone?: Phaser.Sound.BaseSound;
  //private squash?: Phaser.Sound.BaseSound;

 constructor(scene: Phaser.Scene) {
   super(scene, -100, -100, GODROFL , 0);
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
    //this.scene.physics.world.enable(this);
    (this.body as Phaser.Physics.Arcade.Body).setVelocityY(velocityY);

    //this.getRandomLocation();

    this.setPosition(x, y);
    this.position=position;

    this.yOrigin = this.y;

  }
  /*
  public getRandomLocation (){
    const positionIndex = Math.floor(Math.random() * 6) + 1;
    

    switch (true) {
      case positionIndex == 1:
         this.x = getGameWidth(this.scene)  * ( 0.215-0.034 );
         this.y = getGameHeight(this.scene) * ( 0.89-0.062  );
         //this.displayHeight = getGameHeight(this.scene) * 0.1;
         //this.displayWidth = getGameHeight(this.scene) * 0.1;
        break;
      case positionIndex == 2:
         this.x = getGameWidth(this.scene)  * ( 0.145-0.034 );
         this.y = getGameHeight(this.scene) * ( 0.672-0.062 );
         //this.displayHeight = getGameHeight(this.scene) * 0.09;
        // this.displayWidth = getGameHeight(this.scene) * 0.09;
        break;
      case positionIndex == 3:
          this.x = getGameWidth(this.scene)  * ( 0.332-0.034 );
          this.y = getGameHeight(this.scene) * ( 0.517-0.062 );
        //  this.displayHeight = getGameHeight(this.scene) * 0.08;
        //  this.displayWidth = getGameHeight(this.scene) * 0.08;
        break;
      case positionIndex == 4:
          this.x = getGameWidth(this.scene)  * ( 0.797-0.034 );
          this.y = getGameHeight(this.scene) * ( 0.89-0.062  );
        //  this.displayHeight = getGameHeight(this.scene) * 0.1;
        //  this.displayWidth = getGameHeight(this.scene) * 0.1;
        break;
      case positionIndex == 5:
          this.x = getGameWidth(this.scene)  * ( 0.854-0.034 );
          this.y = getGameHeight(this.scene) * ( 0.672-0.062 );
        //  this.displayHeight = getGameHeight(this.scene) * 0.09;
         // this.displayWidth = getGameHeight(this.scene) * 0.09;
         break;
      case positionIndex >= 6:
          this.x = getGameWidth(this.scene)  * ( 0.671-0.034 );
          this.y = getGameHeight(this.scene) * ( 0.517-0.062 );
        //  this.displayHeight = getGameHeight(this.scene) * 0.08;
        //  this.displayWidth = getGameHeight(this.scene) * 0.08;
        break;
        
    }

    this.setPosition(this.x, this.y);

  }
  */

  public update = () => {
      
      if (this.y > this.yOrigin && this.isWaiting == false ){
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

    /*
  public timeOut = () => {
    if (!this.isDead){
      this.gone?.play();
      this.setDead(true);
    }
  
  public squashRofl = () => {
    this.squash?.play();
    this.setDead(true);
  }
 */

}