import { getGameHeight , getGameWidth } from '../helpers';
import {  SPLASH, COMMONROFL, GRENADEROFL, DRANKROFL, HEARTROFL,  COMMONROFLDRANK, GRENADEROFLDRANK, DRANKROFLDRANK, HEARTROFLDRANK } from 'game/assets';
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
  //private socket?: Socket;
  // odds boundaries
  private grnLow?: number;
  private drkLow?: number;
  private hrtLow?: number;
  private grnHigh?: number;
  private drkHigh?: number;
  private hrtHigh?: number;
  private oddOffset = 40;

 constructor(scene: Phaser.Scene) {
   super(scene, -100, -100, COMMONROFL , 0);
   this.setOrigin(0, 0);
   this.displayHeight = getGameHeight(scene) * 0.08;
   this.displayWidth = getGameHeight(scene) * 0.08;

   // Initializing socket
   //this.socket = this.scene.game.registry.values.socket;

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

    // Updating Rofl type, position and lowest y coordinates (groundY)
    this.calculateRoflType(this.brs);
    this.setPosition(x - this.displayWidth/2, y - this.displayHeight);
    this.positionIndex=positionIndex;
    this.groundY = y - this.displayHeight;
    this.goneTimer = timerHandle;

  }

  private calculateRoflType(brs : number){

    if ( this.grnLow != undefined && this.grnHigh != undefined && this.drkLow != undefined && this.drkHigh != undefined && this.hrtLow != undefined && this.hrtHigh != undefined ){
    
      if ( brs >= this.grnLow && brs <= this.grnHigh ){
        this.rarityTag = 'grenade';        
      } else if(  brs >= this.drkLow && brs <= this.drkHigh ){   
        this.rarityTag = 'drank';
      } else if( brs >= this.hrtLow && brs <= this.hrtHigh ){
        this.rarityTag = 'heart';
      } else {
      this.rarityTag = 'common';
      }

      (this.scene as GameScene).socket?.emit(this.rarityTag);

      this.updateRoflImage();
    }
  }

  public setRoflOdds = ( grn : number, drk : number, hrt : number) => {
    // checking for valid odds
    if ( grn+drk+hrt <= 15 && grn+drk+hrt >= 3 ){
      this.grnLow = this.oddOffset ;
      this.grnHigh = this.grnLow + grn - 1;
      this.drkLow = this.grnHigh + 1;
      this.drkHigh = this.drkLow + drk - 1;
      this.hrtLow = this.drkHigh + 1;
      this.hrtHigh = this.hrtLow + hrt - 1;
    }
  }

  public updateRoflImage = () => {
    
    if (!this.isDead){
      if (!this.isStoned){
       if (this.rarityTag == 'common') {
        this.setTexture(COMMONROFL);
       } else if(this.rarityTag == 'grenade'){
        this.setTexture(GRENADEROFL);
       } else if(this.rarityTag == 'drank'){
         this.setTexture(DRANKROFL);
       } else if(this.rarityTag == 'heart'){
         this.setTexture(HEARTROFL);
        } 
      } else{
        if (this.rarityTag == 'common') {
         this.setTexture(COMMONROFLDRANK);
       } else if(this.rarityTag == 'grenade'){
        this.setTexture(GRENADEROFLDRANK);
        } else if(this.rarityTag == 'drank'){
        this.setTexture(DRANKROFLDRANK);
       } else if(this.rarityTag == 'heart'){
         this.setTexture(HEARTROFLDRANK);
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
    
   // if (this.isStoned != state){
      this.isStoned = state;
      this.updateRoflImage();

//    } else{
  //    this.isStoned = state;
  //  }

    if (this.goneTimer != undefined){
      this.goneTimer.paused = true;
    }
    
  }
  

}