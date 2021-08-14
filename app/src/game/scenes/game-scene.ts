import {   LEFT_CHEVRON, BG, BGLOL, CLICK , POP , EXPLOSION, OPENCAN, GONE , SQUASH, LICKING, GAMETUNE, EPICTUNE, GAMEOVER , GRENADE, DRANK } from 'game/assets';
import { AavegotchiGameObject } from 'types';
import { getGameWidth, getGameHeight, getRelative } from '../helpers';
import { Player , Rofl, Lickquidator, HeartCounter , Puddle } from 'game/objects';
import { Socket } from 'dgram';
import LogRocket from 'logrocket';


const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: 'Game',
};

export class GameScene extends Phaser.Scene {
  public socket?: Socket;
  private player?: Player;
  private selectedGotchi?: AavegotchiGameObject;
  private rofls?: Phaser.GameObjects.Group;
  private lickquidators?: Phaser.GameObjects.Group;
  private puddles?: Phaser.GameObjects.Group;
  private grenadeButton?: Phaser.GameObjects.Image;
  private drankButton?: Phaser.GameObjects.Image;
  private puddleArray?: Array<Phaser.GameObjects.Sprite>;

  // Sounds
  private back?: Phaser.Sound.BaseSound;
  private pop?: Phaser.Sound.BaseSound;
  private explosion?: Phaser.Sound.BaseSound;
  private opencan?: Phaser.Sound.BaseSound;
  private gone?: Phaser.Sound.BaseSound;
  private squash?: Phaser.Sound.BaseSound;
  private licking?: Phaser.Sound.BaseSound;
  private gametune?: Phaser.Sound.BaseSound;
  private epictune?: Phaser.Sound.BaseSound;
  private gameover?: Phaser.Sound.BaseSound;

  // Score
  private score = 0;
  public lives?: number;
  private roflCount = 0;
  private lickquidatorCount = 0;
  private scoreText?: Phaser.GameObjects.Text;
  private heartCounter?: HeartCounter;

  // Timer Settings 
  private popRoflTimeIni = 2200;
  private goneRoflTimeIni = 3500; //4000;
  private popRoflTime?: number;
  private goneRoflTime?: number;
  private firstLickquidatorTime = 20000;
  private popLickquidatorTimeIni = 10000;
  private goneLickquidatorTimeIni = 2000;
  private popLickquidatorTime?: number;
  private goneLickquidatorTime?: number;
  private popRoflTimeOffset = 300;   // IF CHANGED, PLEASE UPDATE SERVER.TS
  private goneRoflTimeOffset = 300;
  private popRoflTimeSlope = 1/35;  // IF CHANGED, PLEASE UPDATE SERVER.TS
  private goneRoflTimeSlope = 1/100;
  private popLickquidatorTimeSlope = 1/35; 
  private goneLickquidatorTimeSlope = 1/100;
  private gameOverTime = 3000;
  
  // Timer handles
  private popRoflTimer?: Phaser.Time.TimerEvent;
  private goneRoflTimer?: Phaser.Time.TimerEvent;
  private popLickquidatorTimer?: Phaser.Time.TimerEvent;
  private goneLickquidatorTimer?: Phaser.Time.TimerEvent;
  private gameOverTimer?: Phaser.Time.TimerEvent;
  private freezeTimer?: Phaser.Time.TimerEvent;

  // Bonus variables
  private grenadeCount= 0;
  private grenadeText?: Phaser.GameObjects.Text;
  private drankCount= 0;
  private drankText?: Phaser.GameObjects.Text;
  private grenadeProbability?: number;
  private drankProbability?: number;
  private heartProbability?: number;
  private usedGrenades = 0;
  private usedDranks = 0;
  private addedLifes = 0;
  private buttonTimeBar?: Phaser.GameObjects.Graphics;

  // Local states and aux  variables
  private endingGame =  false;
  private isGameOver =  false;
  private takenPositions?: number[];
  private arrayTest?: Array<number>;
  private usedPosition= [false,false,false,false,false,false]; //Array<boolean>;
  public  roflStoned = false;
  private freezeTime = 3000;
  private pondLockedDelay = 1000; 
  private epicScore = 100 ;
  private freezeUpdateInterval = 100;
  private firstRun = true;
  private sessionID = Math.random()*10000;
  private pointer?: Phaser.Input.Pointer;
  private gotchiTraits?: Array<number>;
  private backgroundImageEpic?: Phaser.GameObjects.Image;
  private backgroundImageRegular?: Phaser.GameObjects.Image;
  private roflBufferSize = 60;
  private lickquidatorBufferSize = 10;


  constructor() {
    super(sceneConfig);
  }

  init = (data: { selectedGotchi: AavegotchiGameObject }): void => {
    this.selectedGotchi = data.selectedGotchi;
  };

  public create(): void {
    // monitoring resources , for debugging purposes
    LogRocket.init('qjtjwh/whac-a-rofl');

    // communicating gameStarted to socket
    this.socket = this.game.registry.values.socket;
    this.socket?.emit('gameStarted');

    // Add layout
    this.backgroundImageEpic =  this.add.image(getGameWidth(this) / 2, getGameHeight(this) / 2, BGLOL).setDisplaySize(getGameWidth(this), getGameHeight(this));
    this.backgroundImageRegular =  this.add.image(getGameWidth(this) / 2, getGameHeight(this) / 2, BG).setDisplaySize(getGameWidth(this), getGameHeight(this));
    this.back = this.sound.add(CLICK, { loop: false });
    this.pop = this.sound.add(POP, { loop: false });
    this.explosion = this.sound.add(EXPLOSION, { loop: false });
    this.opencan = this.sound.add(OPENCAN, { loop: false });
    this.gone = this.sound.add(GONE, { loop: false });
    this.squash = this.sound.add(SQUASH, { loop: false });
    this.licking = this.sound.add(LICKING, { loop: false });
    this.gametune = this.sound.add(GAMETUNE, { loop: true });
    this.epictune = this.sound.add(EPICTUNE, { loop: true });
    this.gameover = this.sound.add(GAMEOVER, { loop: false });
    this.createBackButton();

    // Play main tune
    this.gametune?.play();

    // Change default icon
    //this.input.setDefaultCursor('url(public/assets/icons/cursor_net.cur), pointer');

    // Add a player sprite that can be moved around.
    this.player = new Player({
      scene: this,
      x: getGameWidth(this) / 2,
      y: getGameHeight(this) / 2,
      key: this.selectedGotchi?.spritesheetKey || ''
    });

    // Initializing lives counter
    this.lives = this.player.getLives();

    // Score board
    this.scoreText = this.add
    .text(getGameWidth(this) * 0.097, getGameHeight(this) * 0.245, this.score.toString(), { color: '#FFFFFF',   })
    .setFontSize(getRelative(84, this))
    .setOrigin(0.5)
    .setDepth(1);

    // Grenade board
    this.grenadeText = this.add
    .text(getGameWidth(this) * 0.6, getGameHeight(this) * 0.93, 'X' + this.grenadeCount.toString(), { color: '#FFFFFF',   })
    .setFontSize(getRelative(60, this))
    .setOrigin(0.5)
    .setDepth(1);

    // drank board
    this.drankText = this.add
    .text(getGameWidth(this) * 0.5, getGameHeight(this) * 0.93, 'X' + this.drankCount.toString(), { color: '#FFFFFF',   })
    .setFontSize(getRelative(60, this))
    .setOrigin(0.5)
    .setDepth(1);

    // Add Rofl group for pooling
    this.rofls = this.add.group({
      maxSize: this.roflBufferSize,
      classType: Rofl,
      runChildUpdate: true,
    });

    // Add Liquidators group
    this.lickquidators = this.add.group({
      maxSize: this.lickquidatorBufferSize,
      classType: Lickquidator,
      runChildUpdate: true,
    });

    // Add Puddles
    this.puddles = this.add.group({
      maxSize: 6,
      classType: Puddle,
      runChildUpdate: false,
    });
    this.puddleArray = [];
 
    // Creating Puddles
    const puddle0: Puddle = this.puddles?.get();
    puddle0.setPuddle(this.getLocationX(0),this.getLocationY(0));
    this.puddleArray.push(puddle0);
    const puddle1: Puddle = this.puddles?.get();
    puddle1.setPuddle(this.getLocationX(1),this.getLocationY(1));
    this.puddleArray.push(puddle1);
    const puddle2: Puddle = this.puddles?.get();
    puddle2.setPuddle(this.getLocationX(2),this.getLocationY(2));
    this.puddleArray.push(puddle2);
    const puddle3: Puddle = this.puddles?.get();
    puddle3.setPuddle(this.getLocationX(3),this.getLocationY(3));
    this.puddleArray.push(puddle3);
    const puddle4: Puddle = this.puddles?.get();
    puddle4.setPuddle(this.getLocationX(4),this.getLocationY(4));
    this.puddleArray.push(puddle4);
    const puddle5: Puddle = this.puddles?.get();
    puddle5.setPuddle(this.getLocationX(5),this.getLocationY(5));
    this.puddleArray.push(puddle5);


   // Creating buttons
   this.drankButton = this.add.image( getGameWidth(this) * 0.45, getGameHeight(this) * 0.93, DRANK ) ;
   this.drankButton.displayHeight = getGameHeight(this) * 0.09 ;
   this.drankButton.displayWidth = getGameHeight(this) * 0.09 ;
   this.grenadeButton = this.add.image( getGameWidth(this) * 0.55, getGameHeight(this) * 0.93, GRENADE ) ;
   this.grenadeButton.displayHeight = getGameHeight(this) * 0.09 ;
   this.grenadeButton.displayWidth = getGameHeight(this) * 0.09 ;

   // Adding callbacks to the buttons
   this.grenadeButton.setInteractive();
   this.drankButton.setInteractive();
   this.grenadeButton.on('pointerup', this.useGrenade, this);
   this.drankButton.on('pointerup', this.useDrank, this);

    // Add heart counter
    this.heartCounter = new HeartCounter(this); 
    
    /////////////////////////////////////////////////////////
    // Adjusting game settings depending on Aavegotchi traits
    //////////////////////////////////////////////////////////

    if ( this.selectedGotchi != undefined){
      this.gotchiTraits = this.selectedGotchi.withSetsNumericTraits;
      this.player.setGotchiTraits( this.gotchiTraits[0], this.gotchiTraits[1], this.gotchiTraits[2], this.gotchiTraits[3], this.gotchiTraits[4], this.gotchiTraits[5] );

     // NRG : more energy, more hearts and less godlike frogs
     this.lives = this.getBonusQuantity( this.gotchiTraits[0] );
     this.heartProbability = 6 - this.lives; // max: 5% ; min: 1%
     if ( this.lives != undefined) {
      this.player.setLifes(this.lives);
      this.heartCounter?.setRemainingHearts( this.lives );
     }
     
     // AGG : higher chance of grenades if high trait and more lickquidators
     this.popLickquidatorTimeIni = Math.floor( this.popLickquidatorTimeIni * ( 1.8 - (this.gotchiTraits[1]/100)  ) ) ;
     this.grenadeProbability = this.getBonusQuantity( this.gotchiTraits[1] ); // max: 5% ; min: 1%

     // SPK : the more spooky, the quicker the rofls go away
     this.goneRoflTimeIni =  Math.floor( this.goneRoflTimeIni * ( 1.8 - (this.gotchiTraits[2]/100) ) )  ; // 1.8 :  0= 1.8; 50=1.3; 100=0.8
     this.goneLickquidatorTimeIni = Math.floor(  this.goneLickquidatorTimeIni * ( 1.8 - (this.gotchiTraits[2]/100)  ) ) ;

     // BRN : higher chance of drank if brain is smol and less freeze freeze time
     this.freezeTime = Math.floor(this.freezeTime * ( 0.8 + (this.gotchiTraits[3]/100)  ))  ;  // 1.8 :  0= 0.8; 50=1.3; 100=1.8
     this.drankProbability = 6 - this.getBonusQuantity( this.gotchiTraits[3] ); // max: 5% ; min: 1%

     //this.scoreText.setText(this.drankProbability.toString()); // FOR DEBUGGING PURPOSES
     
    }


  }
  /// END OF CREATE VOID  ////

  private getBonusQuantity = ( gotchiTrait : number ):number => {
    let bonus = 1 ;

    if (gotchiTrait <10 ){
      bonus = 1;
     } else if ( gotchiTrait >= 10 && gotchiTrait < 25 ){
      bonus = 2;
     } else if ( gotchiTrait >= 25 && gotchiTrait < 74 ){
      bonus = 3;
     } else if ( gotchiTrait >= 74 && gotchiTrait < 91 ){
      bonus = 4;
     } else if ( gotchiTrait >= 91  ){
      bonus = 5;
     }

     return bonus;
  };

  private calculatePosition=():number => {
    let positionIndex= 1;
    let validIndex = false;
    let maxCount = 50;

    while(!validIndex && maxCount>0 ){
      positionIndex = Math.floor(Math.random() * 6)  ;
      maxCount -= 1;
      if (this.usedPosition[positionIndex] == false) {
        validIndex = true;
        this.usedPosition[positionIndex] = true;
        return positionIndex;
      }
    }

    return positionIndex;

  };

  // Rofls
  private addRofls = () =>{
     
     const velocityY = -getGameHeight(this) *  0.75 ;
     const position = this.calculatePosition();
     const x = this.getLocationX(position);
     const y = this.getLocationY(position);

     if (this.endingGame == false){

      this.roflCount += 1;
      this.updateRoflTimers(); 
      this.addRofl(x, y, position, velocityY );

    } 
  };

  // Add Rofl
  private addRofl = (x: number, y: number, position: number, velocityY: number) : void =>{
    const rofl: Rofl = this.rofls?.get();
    // for debugging purposes only
    // const roflInx = this.rofls?.contains.length;
    //if (roflInx){
    //this.scoreText?.setText(roflInx.toString());
    //}

    //this.addScore();

    if (this.roflStoned == true){
      rofl.isStoned = true;
    }

    this.goneRoflTimer  = new Phaser.Time.TimerEvent({
      delay: this.goneRoflTime,
      callback: this.roflTimeOut, 
      args: [rofl as Rofl],
      loop: false,
    });

    if (this.grenadeProbability != undefined && this.drankProbability != undefined && this.heartProbability != undefined){
      rofl.setRoflOdds( this.grenadeProbability , this.drankProbability , this.heartProbability );
    }

    rofl.activate(x, y, position, velocityY, this.goneRoflTimer );
    
    // Activating goneTimer
    this.time.addEvent(this.goneRoflTimer);

    // adding Next timer

    rofl.popTimer = this.time.addEvent({
     delay: this.popRoflTime,
     callback: this.addRofls,
     callbackScope: this,
     loop: false,
    });
   
    // popping sound
    this.pop?.play();

    // popping animation
    if (this.puddleArray != undefined){
      (this.puddleArray[position] as Puddle).splash();
    }

    ///ALTERNATIVE TIMER DEFINITION
    /*
    this.popRoflTimer = new Phaser.Time.TimerEvent({
      delay: this.popRoflTime,
      callback: this.addRofls,
      callbackScope: this,
      loop: false,
    });
    this.time.addEvent(this.popRoflTimer);
    */

  };

  // LICKQUIDATORS
  private addLickquidators = () =>{
    const position = this.calculatePosition();
    const x = this.getLocationX(position);
    const y = this.getLocationY(position);
    const velocityY = -getGameHeight(this) *  0.75 ;
   
    if (this.endingGame == false){
     this.lickquidatorCount += 1;

     this.updateLickquidatorTimers(); 

     this.addLickquidator(x, y, position, velocityY );

   } 

 };

 // Add Lickquidator
 private addLickquidator = (x: number, y: number, position: number, velocityY: number) : void =>{
   const lickquidator: Lickquidator = this.lickquidators?.get();
   // for debugging purposes only
   //  const lickInx = this.lickquidators?.contains.length;
   // if (lickInx){
   // this.scoreText?.setText(lickInx.toString());
   // }

   lickquidator.activate(x, y, position, velocityY, this.sessionID);

   this.pop?.play();

   // playing puddle animation
   if (this.puddleArray != undefined){
    (this.puddleArray[position] as Puddle).splash();
   }
   
   this.goneLickquidatorTimer = this.time.addEvent({
     delay: this.goneLickquidatorTime,
     callback: this.lickquidatorTimeOut, 
     args: [lickquidator as Lickquidator],
     loop: false,
   });

   this.popLickquidatorTimer = this.time.addEvent({
      delay: this.popLickquidatorTime,
      callback: this.addLickquidators,
      callbackScope: this,
      loop: false,
   });

 };

  // score-related functions
  private addScore = () => {
    if (this.scoreText) {
      this.score += 1;
      this.scoreText.setText(this.score.toString());
      // Entering EPIC MODE
      if (this.score == this.epicScore) {
        this.gametune?.stop();
        this.epictune?.play();
        this.player?.activateEpicMode();
        this.backgroundImageRegular?.destroy(true);
      }

    }
  };

  private stoneRofl= (rofl : Rofl , state : boolean ) => {
    rofl.isStoned = state;
    rofl.updateRoflImage();
  };

  // methods related to rolf interactions
  private squashRofl = (rofl : Rofl) => {
    const rarityType = rofl.getRarity();

    this.addScore();
    
    if (rofl != undefined && this.puddleArray != undefined) {
      
      this.squash?.play();
      
      (this.puddleArray[rofl.positionIndex] as Puddle).showHitting();

    if (rofl != undefined && rofl.positionIndex != undefined ){
      //this.usedPosition[rofl.positionIndex] = false;
      this.setPondFree(rofl.positionIndex);
    }

    rofl.setDead(true);

    // forcing to destroy the asset if still locked in memory
    if (rofl){
      rofl.destroy();
    }

    // SPECIAL ROFL POWERS 
    // unique actions related to the Rofl type
    if ( rarityType == 'drank'){

      // Additng one drank to the counter: extra goneTimeOut BONUS
      this.drankCount += 1;
      this.drankText?.setText('X'+ this.drankCount.toString());

    } else
     if ( rarityType == 'grenade'){
     
      // Adding grenade : kill-em-all BONUS
      this.grenadeCount += 1;
      this.grenadeText?.setText('X'+ this.grenadeCount.toString());

    } else if( rarityType == 'heart'){
      // Adding extra life
      this.player?.addLife();
      this.addedLifes += 1;
      this.updateLivesCounter();
    
    }
  }
  };

  private disableStoned(){
    // Setting stoned state back to normal
    this.roflStoned = false;
    
    // Setting all present rofls stoned
    (this.rofls as Phaser.GameObjects.Group).getChildren().map(rofl => this.stoneRofl(rofl as Rofl, false));

    this.buttonTimeBar?.destroy();

    this.socket?.emit('disableDrank', this.roflStoned );
  }

  private squashLickquidator = (lickquidator : Lickquidator) => {
    
    this.licking?.play();

    if (lickquidator != undefined && this.puddleArray != undefined && lickquidator.positionIndex != undefined ){
      //this.usedPosition[lickquidator.positionIndex] = false;
      this.setPondFree(lickquidator.positionIndex);
      (this.puddleArray[lickquidator.positionIndex] as Puddle).showHitting();
    }
    lickquidator.setDead(true);
    // to force destroy the asset
    if (lickquidator){
      lickquidator.destroy();
    }
    if (this.player != undefined){
      this.player.removeLife();
      this.updateLivesCounter();
    }
  };

  private killLickquidator = (lickquidator : Lickquidator) => {
    if (lickquidator != undefined && this.puddleArray != undefined ){
    if (lickquidator != undefined && lickquidator.positionIndex != undefined ){
      (this.puddleArray[lickquidator.positionIndex] as Puddle).showHitting();
      //this.usedPosition[lickquidator.positionIndex] = false;
      this.setPondFree(lickquidator.positionIndex);
    }
    lickquidator.setDead(true);
    if (lickquidator){
      lickquidator.destroy();
    }
  }
  };

  private roflTimeOut = (rofl : Rofl) => {

    if (!rofl.isDead && this.player != undefined && this.endingGame == false  ){
      
      this.player.removeLife();
      /*
      if (rofl != undefined && rofl.positionIndex != undefined ){
        this.usedPosition[rofl.positionIndex] = false;
      }
      */
      // Adding event that triggers clearing the pond, temporally lock to give some time to move away
      this.setPondFree(rofl.positionIndex);

      this.updateLivesCounter();

      this.gone?.play();
      
      rofl.popTimer?.destroy;
      rofl.goneTimer?.destroy;
      
      rofl.setDead(true);
          // forcing to destroy the asset if still locked in memory
    if (rofl){
      rofl.destroy();
    }

    } 
  };

  private setPondFree = ( index : number ) => {
    this.time.addEvent({
      delay: this.pondLockedDelay,
      callback: this.updatePoundArray,
      callbackScope: this,
      args: [ index ],
      loop: false,
    });
  };

  private updatePoundArray = ( index : number ) => {
      this.usedPosition[index] = false;
  };


  private lickquidatorTimeOut = (lickquidator : Lickquidator) => {

    if (!lickquidator.isDead && this.player != undefined && this.endingGame == false ){
     // this.gone?.play();
      if (lickquidator != undefined && lickquidator.positionIndex != undefined ){
        //this.usedPosition[lickquidator.positionIndex] = false;
        this.setPondFree(lickquidator.positionIndex);
      }
      lickquidator.setDead(true);
      if (lickquidator){
        lickquidator.destroy();
      }
    }

  };

  // Updating live counter
  private updateLivesCounter= () => {
    if ( this.player != undefined ){ 
      this.lives = this.player.getLives();
      this.heartCounter?.setRemainingHearts(this.lives);
   }
  };

  // timer settings
  // v1
  // reference (negative exponential model): y = t0* ( exp(-a*x+log(1-b)) +b ) = t0*(exp(alpha)+b) // a= 0.05; b = 0.1; t0 = 4;
  // v2
  // simplified version
  // t0*exp(-roflCount/100))
  private updateRoflTimers (){
    //const tOffset = 300; // ms
    //const b = 0.1;
    //const a = 0.05;
    //const alpha = (-a*this.roflCount)+Math.log2(0.95);
    
    if ( this.popRoflTime != undefined && this.goneRoflTime != undefined ){
      // v1
      //this.popRoflTime = Math.floor(this.popRoflTimeIni*(Math.exp(alpha)+b));
      //this.goneRoflTime = Math.floor(this.goneRoflTimeIni*(Math.exp(alpha)+b));
      // v2
      this.popRoflTime  = Math.floor( this.popRoflTimeIni*( Math.exp(-this.roflCount * this.popRoflTimeSlope) ) ) + this.popRoflTimeOffset;
      this.goneRoflTime = Math.floor(this.goneRoflTimeIni*( Math.exp(-this.roflCount* this.goneRoflTimeSlope ) ) ) + this.goneRoflTimeOffset;
    } else {

      this.popRoflTime = this.popRoflTimeIni;
      this.goneRoflTime = this.goneRoflTimeIni;

    }

  }

  private updateLickquidatorTimers (){
    //const b = 0.1;
    //const a = 0.05;
    //const alpha = (-a*this.lickquidatorCount)+Math.log2(0.95);

    if ( this.popLickquidatorTime != undefined && this.goneLickquidatorTime != undefined ){
      // v1
      //this.popLickquidatorTime = Math.floor(this.popLickquidatorTimeIni*(Math.exp(alpha)+b));
      //this.goneLickquidatorTime = Math.floor(this.goneLickquidatorTimeIni*(Math.exp(alpha)+b));
      // v2
      this.popLickquidatorTime  = Math.floor( this.popLickquidatorTimeIni*( Math.exp(-this.lickquidatorCount * this.popLickquidatorTimeSlope) ) ) + this.popRoflTimeOffset;
      this.goneLickquidatorTime = Math.floor(this.goneLickquidatorTimeIni*( Math.exp(-this.lickquidatorCount* this.goneLickquidatorTimeSlope ) ) ) + this.goneRoflTimeOffset;

    } else {

      this.popLickquidatorTime = this.popLickquidatorTimeIni;
      this.goneLickquidatorTime = this.goneLickquidatorTimeIni;

    }

  }

  public getLocationX (positionIndex : number):number {
    let x=0;
    switch (true) {
      case positionIndex == 0:
        x = getGameWidth(this)  * ( 0.277 ); //-0.034
        break;
      case positionIndex == 1:
        x = getGameWidth(this)  * ( 0.145 );
        break;
      case positionIndex == 2:
        x = getGameWidth(this)  * ( 0.35 );
        break;
      case positionIndex == 3:
        x = getGameWidth(this)  * ( 0.723 );
        break;
      case positionIndex == 4:
        x = getGameWidth(this)  * ( 0.854 );
         break;
      case positionIndex >= 5:
        x= getGameWidth(this)  * ( 0.65 );
        break;
      default:
    }
    return x;
  }

  public getLocationY (positionIndex : number):number {
    let y=0;
    switch (true) {
      case positionIndex == 0:
        y = getGameHeight(this) * ( 0.87  ); //-0.062  
        break;
      case positionIndex == 1:
        y = getGameHeight(this) * ( 0.672 );
        break;
      case positionIndex == 2:
        y = getGameHeight(this) * ( 0.517 );
        break;
      case positionIndex == 3:
        y = getGameHeight(this) * ( 0.87  );
        break;
      case positionIndex == 4:
         y = getGameHeight(this) * ( 0.672 );
         break;
      case positionIndex >= 5:
         y = getGameHeight(this) * ( 0.517 );
        break; 
        default:
    }
    return y;
  }


  private createBackButton = () => {
    this.add
      .image(getRelative(54, this), getRelative(54, this), LEFT_CHEVRON)
      .setOrigin(0)
      .setInteractive({ useHandCursor: true })
      .setDisplaySize(getRelative(94, this), getRelative(94, this))
      .on('pointerdown', () => {
        this.back?.play();
        window.history.back();
      });
  };

  public useGrenade = () => {

    if (this.grenadeCount > 0){

      //Playback sound
      this.explosion?.play();

      // Updating grenade Count
      this.grenadeCount -= 1;
      this.usedGrenades += 1;
      this.socket?.emit('useGrenade');
      this.grenadeText?.setText('X' + this.grenadeCount.toString());
      
       // Kill-em-all, making sure that the rofl group is empty, a single call it seems to be not enough
       if (this.lickquidators != undefined){
         while ( this.lickquidators.countActive(true)>0 ){
                (this.lickquidators as Phaser.GameObjects.Group).getChildren().map(lickquidator => this.killLickquidator(lickquidator as Lickquidator));
         }
       }

      // Kill-em-all, making sure that the rofl group is empty, a single call it seems to be not enough
      if (this.rofls != undefined){
        while ( this.rofls.countActive(true)>0 ){
          (this.rofls as Phaser.GameObjects.Group).getChildren().map(rofl => this.squashRofl(rofl as Rofl));
        }
      }

    }
  }

  public useDrank = () => {

    if (this.drankCount > 0){
      // Playing can sound
      this.opencan?.play();

      // Clearing previous state in case a drank is being used
      if (this.freezeTimer != undefined ){
        this.freezeTimer.destroy();
        this.buttonTimeBar?.destroy();
        this.disableStoned;
      }

      // Adding extra time to the Rofl TimeOut
      this.roflStoned = true;

      // Updating drank Count
      this.drankCount -= 1;
      this.usedDranks += 1;
      this.socket?.emit('useDrank',this.freezeTime );
      this.drankText?.setText('X' + this.drankCount.toString());


      // Setting all present rofls stoned
      (this.rofls as Phaser.GameObjects.Group).getChildren().map(rofl => this.stoneRofl(rofl as Rofl, true));

      // Start event to disable stoned after certain time
      this.freezeTimer  = new Phaser.Time.TimerEvent({
        delay: this.freezeTime ,
        callback: this.disableStoned , 
        callbackScope: this,
        loop: false,
      });

      // Adding timebar to the drank button
      this.buttonTimeBar = new Phaser.GameObjects.Graphics(this);
      this.drawTimebar();
      this.add.existing(this.buttonTimeBar)

      // Activating goneTimer
      this.time.addEvent(this.freezeTimer);

    }
  
  }

    //// TIME BAR
    public drawTimebar ()
    {
        const yOffset = getGameHeight(this)*0.1;
        const barWidthBlack = getGameWidth(this)*0.045;
        const barWidthWhite = getGameWidth(this)*0.0445;
        const barHeightBlack = getGameWidth(this)*0.004;
        const barHeightWhite = getGameWidth(this)*0.0035;
        const barX = getGameWidth(this) * 0.425 ;
        const barY = getGameHeight(this) * 0.77 ;
  
        this.buttonTimeBar?.clear();
  
        let timeLeft= 1;
  
        if (this.freezeTimer != undefined ){
          timeLeft = (1-this.freezeTimer?.getOverallProgress()) * barWidthWhite ; 
        } 
  
        //  BG
        this.buttonTimeBar?.fillStyle(0x000000);
        this.buttonTimeBar?.fillRect( barX , barY + yOffset, barWidthBlack, barHeightBlack);
  
        //  Remaining Time
        this.buttonTimeBar?.fillStyle(0xffffff);
        this.buttonTimeBar?.fillRect( barX + 2, barY + 2 + yOffset, barWidthWhite, barHeightWhite);
  
        this.buttonTimeBar?.fillStyle(0xff0000);
  
        this.buttonTimeBar?.fillRect(  barX + 2, barY + 2 + yOffset, timeLeft, barHeightWhite);
    }
    //// 

  private endGame(){
    this.time.clearPendingEvents();
    window.history.back();
  }


  private onObjectClicked( pointer : Phaser.Input.Pointer , gameObject: Phaser.GameObjects.Image ){
    if ( gameObject.texture.key == GRENADE ){
      this.useGrenade();
    } else if( gameObject.texture.key == DRANK ){
      this.useDrank();
    }
  }

  public update(): void {
    
    
    // Initializing first liquidator after a timer
    if (this.firstRun){
      
      // Adding Rofls
      this.addRofls();
      
      // Adding event that triggers the first Lickquidator
      this.time.addEvent({
        delay: this.firstLickquidatorTime,
        callback: this.addLickquidators,
        callbackScope: this,
        loop: false,
      });
      
      this.firstRun = false;
      
    }
    
    // Every frame, we update the player
    this.player?.update();
    this.updateLivesCounter();

    if (this.player && !this.player?.getDead()) {
      // checking overlap between player and scoring element
      this.physics.overlap(
        this.player,
        this.rofls,
        (_, rofl) => {
          this.squashRofl(rofl as Rofl); 
        }
      )

      // checking overlap between player and penalizing element
      this.physics.overlap(
        this.player,
        this.lickquidators,
        (_, lickquidator) => {
          this.squashLickquidator(lickquidator as Lickquidator); 
        }
      )

      // Updating drank progress bar if active
      if (this.roflStoned) {
        this.drawTimebar();
      }

    } else {
      if ( this.endingGame == false ){
        // Play gameover sound
        this.gametune?.stop();
        this.epictune?.stop();
        this.gameover?.play();
        this.endingGame = true;
        this.isGameOver = true;
        const addedLifes = this.addedLifes ;
        const usedDranks = this.usedDranks ;
        const usedGrenades = this.usedGrenades;

        this.socket?.emit('gameOver', {score: this.score , addedLifes, usedDranks, usedGrenades}  ,'');
        //this.socket?.emit('gameOver', {score: this.score , bonusItems }  ,'');

        this.time.addEvent({
         delay: this.gameOverTime,
         callback: this.endGame,
          callbackScope: this,
          loop: false,
        });
      
      }
      
    }



  }
}
