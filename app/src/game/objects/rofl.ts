import { getGameHeight  } from '../helpers';
import {  COMMONROFL, UNCOMMONROFL, RAREROFL, MYTHICALROFL,  COMMONROFLJOINT, UNCOMMONROFLJOINT, RAREROFLJOINT, MYTHICALROFLJOINT } from 'game/assets';

export class Rofl extends Phaser.GameObjects.Sprite {
  private health = 200;
  private groundY = 0;
  private brs = 50;
  public rarityTag?: string;
  private isWaiting = false;
  public isDead = false;
  public positionIndex= 0;
  public isStoned = false;

 constructor(scene: Phaser.Scene) {
   super(scene, -100, -100, COMMONROFL , 0);
   this.setOrigin(0, 0);
   this.displayHeight = getGameHeight(scene) * 0.08;
   this.displayWidth = getGameHeight(scene) * 0.08;

   // Physics
   this.scene.physics.world.enable(this);
   (this.body as Phaser.Physics.Arcade.Body).setGravityY(getGameHeight(this.scene) * 2);

   // Animations
    this.scene.anims.create({
      key: 'gone_splash',
      frames: this.anims.generateFrameNumbers(COMMONROFL || '', { start: 1, end: 9}),
      frameRate: 10,
      repeat: 0,
    });

   this.scene.add.existing(this);
 }

 public activate = (x: number, y: number, positionIndex: number, velocityY: number) => {
    // Physics
    (this.body as Phaser.Physics.Arcade.Body).setVelocityY(velocityY);

    // Calculating rarity type
    this.brs =  Math.floor(Math.random() * 100);

    // Updating Rofl type, position and lowest y coordinates (groundY)
    this.calculateRoflType(this.brs);
    this.setPosition(x - this.displayWidth/2, y - this.displayHeight);
    this.positionIndex=positionIndex;
    this.groundY = y - this.displayHeight;

    //if (this.rarityTag == 'common'){
     // this.anims.play('gone_splash');
   // }
  }

  private calculateRoflType(brs : number){

    if ( brs >= 25 && brs <= 74){
      this.rarityTag = 'common';
    } else if( brs >= 10 && brs <= 24){
      this.rarityTag = 'uncommon';
    } else if( brs >= 75 && brs <= 90){
      this.rarityTag = 'uncommon';
    } else if( brs >= 2 && brs <= 9){
      this.rarityTag = 'rare';
    } else if( brs >= 91 && brs <= 97){
      this.rarityTag = 'rare';
    } else if( brs >= 0 && brs <= 1){
      this.rarityTag = 'mythical';
    } else if( brs >= 98 && brs <= 99){
      this.rarityTag = 'mythical';
    }

    this.updateRoflImage();
  }

  public updateRoflImage = () => {

    if (!this.isStoned){
      if (this.rarityTag == 'common') {
        this.setTexture(COMMONROFL);
      } else if(this.rarityTag == 'uncommon'){
       this.setTexture(UNCOMMONROFL);
      } else if(this.rarityTag == 'rare'){
       this.setTexture(RAREROFL);
      } else if(this.rarityTag == 'mythical'){
       this.setTexture(MYTHICALROFL);
      } else {
        this.setTexture(COMMONROFL);
      }
    } else{
      if (this.rarityTag == 'common') {
        this.setTexture(COMMONROFLJOINT);
      } else if(this.rarityTag == 'uncommon'){
       this.setTexture(UNCOMMONROFLJOINT);
      } else if(this.rarityTag == 'rare'){
       this.setTexture(RAREROFLJOINT);
      } else if(this.rarityTag == 'mythical'){
        this.setTexture(MYTHICALROFLJOINT);
      } else {
        this.setTexture(COMMONROFLJOINT);
      }

    }
  };

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

  public getRarity = ():string => {
    if (this.rarityTag != undefined){
      return this.rarityTag;
    } else {
      return '';
    }
  };
  
  public setDead(dead: boolean): void {
    this.isDead = dead;
    if (dead == true){
      //this.anims.play('dead');
      this.destroy(); 
    }
  }

  public setStoned(stoned: boolean): void {
    
    if (this.isStoned != stoned){
      this.isStoned = stoned;
      this.updateRoflImage();
    } else{
      this.isStoned = stoned;
    }

    
  }

}