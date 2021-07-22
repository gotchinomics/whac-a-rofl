import {   LEFT_CHEVRON, BG, CLICK , POP , GONE , SQUASH, LICKING, GAMETUNE, GAMEOVER, NET , GRENADE, DRANK } from 'game/assets';
import { AavegotchiGameObject } from 'types';
import { getGameWidth, getGameHeight, getRelative } from '../helpers';
import { Player , Rofl, Lickquidator, HeartCounter , Puddle , TimeBar } from 'game/objects';
import { Socket } from 'dgram';
import { ProvidedRequiredArgumentsRule } from 'graphql';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: 'Game',
};

/**
 * Scene where gameplay takes place
 */
export class GameScene extends Phaser.Scene {
  private socket?: Socket;
  private player?: Player;
  private selectedGotchi?: AavegotchiGameObject;
  private rofls?: Phaser.GameObjects.Group;
  private lickquidators?: Phaser.GameObjects.Group;
  private hearts?: Phaser.GameObjects.Group;
  private puddles?: Phaser.GameObjects.Group;
  private grenadeButton?: Phaser.GameObjects.Image;
  private drankButton?: Phaser.GameObjects.Image;
  private puddleArray?: Array<Phaser.GameObjects.Sprite>;

  // Sounds
  private back?: Phaser.Sound.BaseSound;
  private pop?: Phaser.Sound.BaseSound;
  private gone?: Phaser.Sound.BaseSound;
  private squash?: Phaser.Sound.BaseSound;
  private licking?: Phaser.Sound.BaseSound;
  private godlikesquash?: Phaser.Sound.BaseSound;
  private gametune?: Phaser.Sound.BaseSound;
  private gameover?: Phaser.Sound.BaseSound;

  // Score
  private score = 0;
  public lives?: number;
  private roflCount = 0;
  private lickquidatorCount = 0;
  private lickquidatorProb = 0.2 ; // Probabilty of Lickquidator [0-1]
  private scoreText?: Phaser.GameObjects.Text;
  private heartCounter?: HeartCounter;

  // Timer Settings
  private popRoflTimeIni = 3000;
  private goneRoflTimeIni = 8000;
  private popRoflTime?: number;
  private goneRoflTime?: number;
  private firstLickquidatorTime = 20000;
  private popLickquidatorTimeIni = 10000;
  private goneLickquidatorTimeIni = 2000;
  private popLickquidatorTime?: number;
  private goneLickquidatorTime?: number;
  private gameOverTime = 3000;
  
  // Timer handles
  private popRoflTimer?: Phaser.Time.TimerEvent;
  private goneRoflTimer?: Phaser.Time.TimerEvent;
  private popLickquidatorTimer?: Phaser.Time.TimerEvent;
  private goneLickquidatorTimer?: Phaser.Time.TimerEvent;
  private gameOverTimer?: Phaser.Time.TimerEvent;

  // Bonus variables
  private grenadeCount= 0;
  private grenadeText?: Phaser.GameObjects.Text;
  private drankCount=0;
  private drankText?: Phaser.GameObjects.Text;

  
  // Local states and aux  variables
  private endingGame =  false;
  private isGameOver =  false;
  private allPositions= [1,2,3,4,5,6];
  private takenPositions?: number[];
  private arrayTest?: Array<number>;
  private usedPosition= [false,false,false,false,false,false]; //Array<boolean>;
  public  roflStoned = false;
  private freezeTime = 3000; 
  private freezeUpdateInterval = 100;
  private firstRun = true;
  private sessionID = Math.random()*10000;
  private pointer?: Phaser.Input.Pointer;

  

  constructor() {
    super(sceneConfig);
  }

  init = (data: { selectedGotchi: AavegotchiGameObject }): void => {
    this.selectedGotchi = data.selectedGotchi;
  };

  public create(): void {
    // communicating gameStarted to socket
    this.socket = this.game.registry.values.socket;
    this.socket?.emit('gameStarted');

    // Add layout
    this.add.image(getGameWidth(this) / 2, getGameHeight(this) / 2, BG).setDisplaySize(getGameWidth(this), getGameHeight(this));
    this.back = this.sound.add(CLICK, { loop: false });
    this.pop = this.sound.add(POP, { loop: false });
    this.gone = this.sound.add(GONE, { loop: false });
    this.squash = this.sound.add(SQUASH, { loop: false });
    this.licking = this.sound.add(LICKING, { loop: false });
    this.gametune = this.sound.add(GAMETUNE, { loop: true });
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
    .text(getGameWidth(this) * 0.5, getGameHeight(this) * 0.93, 'X' + this.grenadeCount.toString(), { color: '#FFFFFF',   })
    .setFontSize(getRelative(60, this))
    .setOrigin(0.5)
    .setDepth(1);

    // drank board
    this.drankText = this.add
    .text(getGameWidth(this) * 0.6, getGameHeight(this) * 0.93, 'X' + this.drankCount.toString(), { color: '#FFFFFF',   })
    .setFontSize(getRelative(60, this))
    .setOrigin(0.5)
    .setDepth(1);

    // Add Rofl group for pooling
    this.rofls = this.add.group({
      maxSize: 30,
      classType: Rofl,
      runChildUpdate: true,
     });

     // Add Liquidators group
     this.lickquidators = this.add.group({
      maxSize: 6,
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
   const puddle6: Puddle = this.puddles?.get();
   puddle6.setPuddle(this.getLocationX(6),this.getLocationY(6));
   this.puddleArray.push(puddle6);

   // Creating buttons
   this.grenadeButton = this.add.image( getGameWidth(this) * 0.45, getGameHeight(this) * 0.93, GRENADE ) ;
   this.grenadeButton.displayHeight = getGameHeight(this) * 0.09 ;
   this.grenadeButton.displayWidth = getGameHeight(this) * 0.09 ;
   this.drankButton = this.add.image( getGameWidth(this) * 0.55, getGameHeight(this) * 0.93, DRANK ) ;
   this.drankButton.displayHeight = getGameHeight(this) * 0.09 ;
   this.drankButton.displayWidth = getGameHeight(this) * 0.09 ;

   // Adding callbacks to the buttons
   this.grenadeButton.setInteractive();
   this.drankButton.setInteractive();
   this.grenadeButton.on('pointerup', this.useGrenade, this);
   this.drankButton.on('pointerup', this.useDrank, this);



   //this.input.on('gameobjectdown',this.onObjectClicked);

    // Add heart counter
    this.heartCounter = new HeartCounter(this);    
   /*
    // Create first timer Event
    this.popRoflTimer = new Phaser.Time.TimerEvent({
      delay: this.popRoflTime,
      callback: this.addRofls,
      callbackScope: this,
      loop: false,
    });
    
    this.popRoflTimer = this.time.addEvent({
      delay: this.popRoflTime,
      callback: this.addRofls,
      callbackScope: this,
      loop: false,
     });
     */

  }
  /// END OF CREATE VOID  ////

  private calculatePosition=():number => {
    let positionIndex= 1;
    let validIndex = false;
    let maxCount = 50;

    while(!validIndex && maxCount>0 ){
      positionIndex = Math.floor(Math.random() * 6) + 1;
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

    /*
    rofl.goneTimer = this.time.addEvent({
      delay: this.goneRoflTime,
      callback: this.roflTimeOut, 
      args: [rofl as Rofl],
      loop: false,
    });
        */    

    //if (this.roflStoned == true){
    //  rofl.goneTimer.paused = true;
    //}
   
    // popping sound
    this.pop?.play();

    // popping animation
    if (this.puddleArray != undefined){
      (this.puddleArray[position-1] as Puddle).splash();
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
    //const size = getGameHeight(this) / 7;
    const position = this.calculatePosition();
    const x = this.getLocationX(position);
    const y = this.getLocationY(position);
    const velocityY = -getGameHeight(this) *  0.75 ;
   
    if (this.endingGame == false){
     this.lickquidatorCount += 1;

     this.updateLickquidatorTimers(); 

     this.addLickquidator(x, y, position, velocityY );

    //this.updateGoneTimer();
   } 

 };

 // Add Lickquidator
 private addLickquidator = (x: number, y: number, position: number, velocityY: number) : void =>{
   const lickquidator: Lickquidator = this.lickquidators?.get();

   lickquidator.activate(x, y, position, velocityY, this.sessionID);

   this.pop?.play();

   // playing puddle animation
   if (this.puddleArray != undefined){
    (this.puddleArray[position-1] as Puddle).splash();
  }
    
   // adding TimeOut and Next timer
   //this.updateLickquidatorTimers();
   
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
    }
  };

  private stoneRofl= (rofl : Rofl) => {
    rofl.isStoned = true;
    rofl.updateRoflImage();
  };

  // methods related to rolf interactions
  private squashRofl = (rofl : Rofl) => {
    const rarityType = rofl.getRarity();

    this.addScore();
    rofl.setDead(true);

    if (rofl != undefined && this.puddleArray != undefined) {
      
      this.squash?.play();
      
      (this.puddleArray[rofl.positionIndex-1] as Puddle).showHitting();

    if (rofl != undefined && rofl.positionIndex != undefined ){
      this.usedPosition[rofl.positionIndex] = false;
    }



    // SPECIAL ROFL POWERS 
    // unique actions related to the Rofl type
    if ( rarityType == 'uncommon'){

      // Additng one drank to the counter: extra goneTimeOut BONUS
      this.drankCount += 1;
      this.drankText?.setText('X'+ this.drankCount.toString());

    } else
     if ( rarityType == 'rare'){
     
      // Adding grenade : kill-em-all BONUS
      this.grenadeCount += 1;
      this.grenadeText?.setText('X'+ this.grenadeCount.toString());


    } else if( rarityType == 'mythical'){
      // Adding extra life
      this.player?.addLife();
      this.updateLivesCounter();
    
    }

    
  }
    
  };

  private disableStoned(){
    this.roflStoned = false;
  }

  private squashLickquidator = (lickquidator : Lickquidator) => {
    
    this.licking?.play();


    if (lickquidator != undefined && this.puddleArray != undefined && lickquidator.positionIndex != undefined ){
      this.usedPosition[lickquidator.positionIndex] = false;
      (this.puddleArray[lickquidator.positionIndex-1] as Puddle).showHitting();
    }
    lickquidator.setDead(true);
    if (this.player != undefined){
      this.player.removeLife();
      this.updateLivesCounter();
    }
  };

  private killLickquidator = (lickquidator : Lickquidator) => {
    if (lickquidator != undefined && this.puddleArray != undefined ){
    if (lickquidator != undefined && lickquidator.positionIndex != undefined ){
      (this.puddleArray[lickquidator.positionIndex-1] as Puddle).showHitting();
      this.usedPosition[lickquidator.positionIndex] = false;
    }
    lickquidator.setDead(true);
  }
  };

  private roflTimeOut = (rofl : Rofl) => {
    

    if (!rofl.isDead && this.player != undefined && this.endingGame == false  ){
      

      this.player.removeLife();
      if (rofl != undefined && rofl.positionIndex != undefined ){
        this.usedPosition[rofl.positionIndex] = false;
      }
      this.updateLivesCounter();

      this.gone?.play();
      
      rofl.popTimer?.destroy;
      rofl.goneTimer?.destroy;
      
      rofl.setDead(true);

    } 

  };

  private lickquidatorTimeOut = (lickquidator : Lickquidator) => {

    if (!lickquidator.isDead && this.player != undefined && this.endingGame == false ){
     // this.gone?.play();
      if (lickquidator != undefined && lickquidator.positionIndex != undefined ){
        this.usedPosition[lickquidator.positionIndex] = false;
      }
      lickquidator.setDead(true);
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
    const tOffset = 300; // ms
    //const b = 0.1;
    //const a = 0.05;
    //const alpha = (-a*this.roflCount)+Math.log2(0.95);
    
    if ( this.popRoflTime != undefined && this.goneRoflTime != undefined ){
      // v1
      //this.popRoflTime = Math.floor(this.popRoflTimeIni*(Math.exp(alpha)+b));
      //this.goneRoflTime = Math.floor(this.goneRoflTimeIni*(Math.exp(alpha)+b));
      // v2
      this.popRoflTime  = Math.floor( this.popRoflTimeIni*( Math.exp(-this.roflCount/35) ) ) + tOffset;
      this.goneRoflTime = Math.floor(this.goneRoflTimeIni*( Math.exp(-this.roflCount/35) ) ) + tOffset;
    } else {

      this.popRoflTime = this.popRoflTimeIni;
      this.goneRoflTime = this.goneRoflTimeIni;

    }

  }

  private updateLickquidatorTimers (){
    const b = 0.1;
    const a = 0.05;
    const alpha = (-a*this.lickquidatorCount)+Math.log2(0.95);

    if ( this.popLickquidatorTime != undefined && this.goneLickquidatorTime != undefined ){
      
      this.popLickquidatorTime = Math.floor(this.popLickquidatorTimeIni*(Math.exp(alpha)+b));
      this.goneLickquidatorTime = Math.floor(this.goneLickquidatorTimeIni*(Math.exp(alpha)+b));

    } else {

      this.popLickquidatorTime = this.popLickquidatorTimeIni;
      this.goneLickquidatorTime = this.goneLickquidatorTimeIni;

    }

  }

  public getLocationX (positionIndex : number):number {
    let x=0;
    switch (true) {
      case positionIndex == 1:
        x = getGameWidth(this)  * ( 0.277 ); //-0.034
        break;
      case positionIndex == 2:
        x = getGameWidth(this)  * ( 0.145 );
        break;
      case positionIndex == 3:
        x = getGameWidth(this)  * ( 0.35 );
        break;
      case positionIndex == 4:
        x = getGameWidth(this)  * ( 0.723 );
        break;
      case positionIndex == 5:
        x = getGameWidth(this)  * ( 0.854 );
         break;
      case positionIndex >= 6:
        x= getGameWidth(this)  * ( 0.65 );
        break;
      default:
    }
    return x;
  }

  public getLocationY (positionIndex : number):number {
    let y=0;
    switch (true) {
      case positionIndex == 1:
        y = getGameHeight(this) * ( 0.87  ); //-0.062  
        break;
      case positionIndex == 2:
        y = getGameHeight(this) * ( 0.672 );
        break;
      case positionIndex == 3:
        y = getGameHeight(this) * ( 0.517 );
        break;
      case positionIndex == 4:
        y = getGameHeight(this) * ( 0.87  );
        break;
      case positionIndex == 5:
         y = getGameHeight(this) * ( 0.672 );
         break;
      case positionIndex >= 6:
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

      // Updating grenade Count
      this.grenadeCount -= 1;
      this.grenadeText?.setText('X' + this.grenadeCount.toString());
      
       // Kill-em-all, making sure that the rofl group is empty, a single call it seems to be not enough
       if (this.lickquidators != undefined){
         while ( this.lickquidators.countActive(true)>0 ){
                (this.lickquidators as Phaser.GameObjects.Group).getChildren().map(lickquidator => this.squashLickquidator(lickquidator as Lickquidator));
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

      // Updating drank Count
      this.drankCount -= 1;
      this.drankText?.setText('X' + this.drankCount.toString());

      // Adding extra time to the Rofl TimeOut
      this.roflStoned = true;

      // Setting all present rofls stoned
      (this.rofls as Phaser.GameObjects.Group).getChildren().map(rofl => this.stoneRofl(rofl as Rofl));

      // Start event to disable stoned after certain time
      this.time.addEvent({
        delay: this.freezeTime ,
        callback: this.disableStoned , 
        callbackScope: this,
        loop: false,
      });

    }
  
  }

  private endGame(){
    this.time.clearPendingEvents();
    window.history.back();
  }

//  private startGame = () =>{
//
//  }

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

    } else {
      if ( this.endingGame == false ){
        // Play gameover sound
        this.gametune?.stop();
        this.gameover?.play();
        this.endingGame = true;
        this.isGameOver = true;
        this.socket?.emit('gameOver', {score: this.score});

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
