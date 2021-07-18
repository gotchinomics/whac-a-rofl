import { getGameHeight, getGameWidth  } from '../helpers';
import {  SPLASH , HITTING  } from 'game/assets';

export class Puddle extends Phaser.GameObjects.Sprite {

 constructor(scene: Phaser.Scene) {
   super(scene, -100, -100, SPLASH , 0);
   this.setOrigin(0, 0);
   this.displayHeight = getGameHeight(scene) * 0.15;
   this.displayWidth = getGameHeight(scene) * 0.15;

   // creating animation
   this.anims.create({
    key: 'idle',
    frames: this.anims.generateFrameNumbers(SPLASH || '', { frames: [8] }),
  });
    this.anims.create({
      key: 'splash',
      frames: this.anims.generateFrameNumbers(SPLASH || '', { start: 1, end: 8 }),
      frameRate: 10,
      repeat: 0,
    });

    this.anims.create({
      key: 'hitting',
      frames: this.anims.generateFrameNumbers(HITTING || '', { start: 1, end: 8 }),
      frameRate: 10,
      repeat: 0,
    }); // hideOnComplete: true,

    this.setVisible(false);

   this.scene.add.existing(this);
 }


 public setPuddle =  (x: number, y: number) => {

    this.setPosition(x-this.displayWidth/2, y-(this.displayHeight*0.4));

    //this.anims.play('idle');
  }

  public showHitting =  () => {
    this.setVisible(true);
    this.anims.play('hitting');
    this.on('animationcomplete', this.animationCompleted );
  }

  private animationCompleted=  () => {
    this.setVisible(false);
  }


  public splash = () => {
    this.setVisible(true);  
    this.anims.play('splash');
    this.on('animationcomplete', this.animationCompleted );

  }
}