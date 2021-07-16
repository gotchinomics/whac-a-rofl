import { getGameHeight , getGameWidth } from '../helpers';
import {  HEART   } from 'game/assets';

export class HeartCounter extends Phaser.GameObjects.Sprite {
private heartArray?: Array<Phaser.GameObjects.Image>;

 constructor(scene: Phaser.Scene) {
   super(scene, -200, -200, HEART , 0);
   const heartCounter = [];
  
   // Creating heart icons
   heartCounter.push( this.scene.add.image( getGameWidth(this.scene) * 0.06, getGameHeight(this.scene) * 0.34, HEART ) );
   heartCounter.push( this.scene.add.image( getGameWidth(this.scene) * 0.08, getGameHeight(this.scene) * 0.34, HEART ) );
   heartCounter.push( this.scene.add.image( getGameWidth(this.scene) * 0.10, getGameHeight(this.scene) * 0.34, HEART ) );
   heartCounter.push( this.scene.add.image( getGameWidth(this.scene) * 0.12, getGameHeight(this.scene) * 0.34, HEART ) );
   heartCounter.push( this.scene.add.image( getGameWidth(this.scene) * 0.14, getGameHeight(this.scene) * 0.34, HEART ) );

   // Resizing icons
   for (let i = 0; i < 5; i++)
     {
        heartCounter[i].displayHeight = getGameHeight(scene) * 0.03;
        heartCounter[i].displayWidth = getGameHeight(scene) * 0.03;
      }

   // Setting not valid elements as invisible
   heartCounter[3].setVisible(false);
   heartCounter[4].setVisible(false);

   this.heartArray = heartCounter;

   this.scene.add.existing(this);
   
 }

 public setRemainingHearts= (hearts : number) => {
    if( this.heartArray != undefined){
      for (let i = 0; i < 5; i++)
      {
        if(i<hearts){
          this.heartArray[i].setVisible(true);
        } else{
          this.heartArray[i].setVisible(false);
        }
      }
    }
 }
  
  public destroySplash(): void {
      this.destroy(); 
  }

}