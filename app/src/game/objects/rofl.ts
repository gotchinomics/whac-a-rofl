import { getGameHeight , getGameWidth } from '../helpers';
import {  SPLASH, COMMONROFL, UNCOMMONROFL, RAREROFL, MYTHICALROFL,  COMMONROFLJOINT, UNCOMMONROFLJOINT, RAREROFLJOINT, MYTHICALROFLJOINT } from 'game/assets';
import { TimeBar } from 'game/objects';
import { GameScene  } from 'game/scenes';


export class Rofl extends Phaser.GameObjects.Sprite {
  private health = 200;
  private groundY = 0;
  private brs = 50;
  public rarityTag?: string;
  private isWaiting = false;
  public isDead = false;
  public positionIndex= 0;
  public isStoned = false;
  public sessionID?:number
  public popTimer?: Phaser.Time.TimerEvent;
  public goneTimer?: Phaser.Time.TimerEvent;
  private timeBar?: Phaser.GameObjects.Graphics;
  //private splash?: Splash;

 constructor(scene: Phaser.Scene) {
   super(scene, -100, -100, COMMONROFL , 0);
   this.setOrigin(0, 0);
   this.displayHeight = getGameHeight(scene) * 0.08;
   this.displayWidth = getGameHeight(scene) * 0.08;

   // Physics
   this.scene.physics.world.enable(this);
   (this.body as Phaser.Physics.Arcade.Body).setGravityY(getGameHeight(this.scene) * 2);

   // Creating time bar
   this.timeBar = new Phaser.GameObjects.Graphics(scene);
   this.drawTimebar();
   this.scene.add.existing(this.timeBar)
   
   // Adding Rofl to the scene
   this.scene.add.existing(this);
 }

 public activate = (x: number, y: number, positionIndex: number, velocityY: number, timerHandle : Phaser.Time.TimerEvent) => {
    // Physics
    (this.body as Phaser.Physics.Arcade.Body).setVelocityY(velocityY);

    // Calculating rarity type
    this.brs =  Math.floor(Math.random() * 100);

    // initializing splash 
    //this.splash?.setCoordinates(x,y); 

    // Updating Rofl type, position and lowest y coordinates (groundY)
    this.calculateRoflType(this.brs);
    this.setPosition(x - this.displayWidth/2, y - this.displayHeight);
    this.positionIndex=positionIndex;
    this.groundY = y - this.displayHeight;
    //this.sessionID = sessionID;
    this.goneTimer = timerHandle;

    // Activating goneTimer 
    //this.scene.time.addEvent(this.goneTimer);


    /*
    // Adding exit animation
    this.splashSprite = this.scene.add.sprite( x - this.displayWidth/2, y - this.displayHeight, SPLASH ,1);
    this.splashSprite.displayHeight = getGameHeight(this.scene) * 0.15;
    this.splashSprite.displayWidth = getGameHeight(this.scene) * 0.15;
      */
    //if (this.rarityTag == 'common'){
     //this.anims.play('idle');
   // }
  }

  private calculateRoflType(brs : number){

    if ( brs >= 11 && brs <= 89){
      this.rarityTag = 'common';
    } else if( brs >= 5 && brs <= 7){    // 4%
      this.rarityTag = 'uncommon';
    } else if( brs >= 93 && brs <= 95){
      this.rarityTag = 'uncommon';
    } else if( brs >= 2 && brs <= 4){    // 3%
      this.rarityTag = 'rare';   
    } else if( brs >= 96 && brs <= 97){
      this.rarityTag = 'rare';
    } else if( brs >= 0 && brs <= 1){    // 2%
      this.rarityTag = 'mythical';
    } else if( brs >= 98 && brs <= 99){
      this.rarityTag = 'mythical';
    } else {
      this.rarityTag = 'common';
    }

    this.updateRoflImage();
  }

  public updateRoflImage = () => {
    
    if (!this.isDead){
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
    } else{
      
      this.setTexture(SPLASH,1);
      //this.anims.play('splash_sprite');
    }
    
  };

  //// TIME BAR
  public drawTimebar ()
  {
      const yOffset = getGameHeight(this.scene)*0.1;
      const barWidthBlack = getGameWidth(this.scene)*0.045;
      const barWidthWhite = getGameWidth(this.scene)*0.0445;
      const barHeightBlack = getGameWidth(this.scene)*0.004;
      const barHeightWhite = getGameWidth(this.scene)*0.0035;

      this.timeBar?.clear();

      let timeLeft= 1;

      if (this.goneTimer != undefined ){
        timeLeft = (1-this.goneTimer?.getOverallProgress()) * barWidthWhite ; 
      } 

      //  BG
      this.timeBar?.fillStyle(0x000000);
      this.timeBar?.fillRect(this.x, this.y + yOffset, barWidthBlack, barHeightBlack);

      //  Remaining Time
      this.timeBar?.fillStyle(0xffffff);
      this.timeBar?.fillRect(this.x + 2, this.y + 2 + yOffset, barWidthWhite, barHeightWhite);

      this.timeBar?.fillStyle(0xff0000);

      this.timeBar?.fillRect(this.x + 2, this.y + 2 + yOffset, timeLeft, barHeightWhite);
  }
  ////  

  public update = () => {

    // Updating the timer following the rofl status (in case freezing BONUS is used)
    if( this.goneTimer != undefined ){
      this.goneTimer.paused = (this.scene as GameScene).roflStoned  ;
    }

    this.drawTimebar();
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
    this.updateRoflImage();

    if (dead == true){
      //this.anims.play('splash_sprite');
      //this.splash?.activate();
      this.timeBar?.destroy(); 
      this.destroy(); 
    }
  }

  public setStoned(state: boolean): void {
    
    if (this.isStoned != state){
      this.isStoned = state;
      this.updateRoflImage();

    } else{
      this.isStoned = state;
    }

    if (this.goneTimer != undefined){
      this.goneTimer.paused = true;
    }

    
  }

}