import { getGameHeight  } from '../helpers';
import {  SPLASH   } from 'game/assets';

export class Splash extends Phaser.GameObjects.Sprite {

 constructor(scene: Phaser.Scene) {
   super(scene, -100, -100, SPLASH , 0);
   this.setOrigin(0, 0);
   this.displayHeight = getGameHeight(scene) * 0.25;
   this.displayWidth = getGameHeight(scene) * 0.25;

   // creating animation
    this.anims.create({
      key: 'splash',
      frames: this.anims.generateFrameNumbers(SPLASH || '', { start: 1, end: 9 }),
      frameRate: 5,
      repeat: 1,
    });

   this.scene.add.existing(this);
 }

 public activate = () => {
    this.anims.play('splash');
  }

  public setCoordinates= (x: number, y: number) => {
    this.setPosition(x-this.displayWidth/2, y-this.displayHeight);
    this.anims.play('splash');
  }
  
  public destroySplash(): void {
      this.destroy(); 
  }

}