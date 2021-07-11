import {   LEFT_CHEVRON, BG, CLICK , POP , GONE , SQUASH, GODLIKESQUASH, GAMETUNE, GAMEOVER } from 'game/assets';
import { AavegotchiGameObject } from 'types';
import { getGameWidth, getGameHeight, getRelative } from '../helpers';
import { Player , Rofl, Godrofl } from 'game/objects';
import { Socket } from 'dgram';

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
  private godrofls?: Phaser.GameObjects.Group;

  // Sounds
  private back?: Phaser.Sound.BaseSound;
  private pop?: Phaser.Sound.BaseSound;
  private gone?: Phaser.Sound.BaseSound;
  private squash?: Phaser.Sound.BaseSound;
  private godlikesquash?: Phaser.Sound.BaseSound;
  private gametune?: Phaser.Sound.BaseSound;
  private gameover?: Phaser.Sound.BaseSound;

  // Score
  private score = 0;
  private lives?: number;
  private roflCount = 0;
  private godroflCount = 0;
  private godroflProb = 0.2 ; // Probabilty of GodRofl [0-1]
  private scoreText?: Phaser.GameObjects.Text;
  private livesText?: Phaser.GameObjects.Text;

  // Timer Settings
  private popRoflTimerIni = 3000;
  private goneRoflTimerIni = 5000;
  private popRoflTimer?: number;
  private goneRoflTimer?: number;
  private popGodroflTimerIni = 10000;
  private goneGodroflTimerIni = 8000;
  private popGodroflTimer?: number;
  private goneGodroflTimer?: number;
  private gameOverTimer = 3000;

  // Local states and aux  variables
  private endingGame =  false;
  private isGameOver =  false;
  private allPositions= [1,2,3,4,5,6];
  private takenPositions?: number[];
  private arrayTest?: Array<number>;
  private usedPosition= [false,false,false,false,false,false]; //Array<boolean>;

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
     //const size = getGameHeight(this) / 7;
     const velocityY = -getGameHeight(this) *  0.75 ;
     const position = this.calculatePosition();
     const x = this.getLocationX(position);
     const y = this.getLocationY(position);



     //this.arrayTest?.push(position);

     //if (this.scoreText != undefined){
     //this.scoreText.setText(y.toString());}

     if (this.endingGame == false){
      this.roflCount += 1;

      this.addRofl(x, y, position, velocityY );

      this.updateRoflTimers(); 
    //this.updateGoneTimer();
    } else {
      //this.popRoflTimer = 100;
      //this.goneRoflTimer = 2000;
      //this.addRofl(x, y, position, velocityY );
    }

  };

  // Add Rofl
  private addRofl = (x: number, y: number, position: number, velocityY: number) : void =>{
    const rofl: Rofl = this.rofls?.get();

    rofl.activate(x, y, position, velocityY);

    this.pop?.play();
     
    // adding TimeOut and Next timer
    this.time.addEvent({
      delay: this.goneRoflTimer,
      callback: this.roflTimeOut, 
      args: [rofl as Rofl],
      loop: false,
    });

    this.time.addEvent({
      delay: this.popRoflTimer,
      callback: this.addRofls,
      callbackScope: this,
      loop: false,
    });

  };

  // GODROFLS
  private addGodrofls = () =>{
    //const size = getGameHeight(this) / 7;
    const position = this.calculatePosition();
    const x = this.getLocationX(position);
    const y = this.getLocationY(position);
    const velocityY = -getGameHeight(this) *  0.75 ;
   
    if (this.endingGame == false){
     this.godroflCount += 1;

     this.addGodrofl(x, y, position, velocityY );

     this.updateGodroflTimers(); 
   //this.updateGoneTimer();
   } 

 };

 // Add Godrofl
 private addGodrofl = (x: number, y: number, position: number, velocityY: number) : void =>{
   const godrofl: Godrofl = this.godrofls?.get();

   godrofl.activate(x, y, position, velocityY);

   this.pop?.play();
    
   // adding TimeOut and Next timer
   this.time.addEvent({
     delay: this.goneGodroflTimer,
     callback: this.godroflTimeOut, 
     args: [godrofl as Godrofl],
     loop: false,
   });

   this.time.addEvent({
     delay: this.popGodroflTimer,
     callback: this.addGodrofls,
     callbackScope: this,
     loop: false,
   });

 };



  

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
    this.godlikesquash = this.sound.add(GODLIKESQUASH, { loop: false });
    this.gametune = this.sound.add(GAMETUNE, { loop: true });
    this.gameover = this.sound.add(GAMEOVER, { loop: false });
    this.createBackButton();

    // Play main tune
    this.gametune?.play();

    // Add a player sprite that can be moved around.
    this.player = new Player({
      scene: this,
      x: getGameWidth(this) / 2,
      y: getGameHeight(this) / 2,
      key: this.selectedGotchi?.spritesheetKey || ''
    });

    // Initializing lives counter
    this.lives = this.player.getLives();

    // Score & Lives boards
    this.scoreText = this.add
    .text(getGameWidth(this) / 2, getGameHeight(this) / 2 - getRelative(190, this), this.score.toString(), { color: '#FFFFFF',   })
    .setFontSize(getRelative(94, this))
    .setOrigin(0.5)
    .setDepth(1);

    this.livesText = this.add
    .text(getGameWidth(this) * 0.1, getGameHeight(this) * 0.1,'Lives: '+ this.lives.toString(), { color: '#FFFFFF',  })
    .setFontSize(getRelative(70, this))
    .setOrigin(0.5)
    .setDepth(1);



    // Add Rofl group for pooling
    this.rofls = this.add.group({
      maxSize: 30,
      classType: Rofl,
      runChildUpdate: true,
     });

     this.godrofls = this.add.group({
      maxSize: 6,
      classType: Godrofl,
      runChildUpdate: true,
     });
     
     this.addRofls();

     this.time.addEvent({
      delay: this.popGodroflTimer,
      callback: this.addGodrofls,
      callbackScope: this,
      loop: false,
    });

  }

  // score-related functions
  private addScore = () => {
    if (this.scoreText) {
      this.score += 1;
      this.scoreText.setText(this.score.toString());
    }
  };

  // methods related to rolf interactions
  private squashRofl = (rofl : Rofl) => {
    this.squash?.play();
    if (rofl != undefined && rofl.position != undefined ){
      this.usedPosition[rofl.position] = false;
    }
    rofl.setDead(true);
    this.addScore();
  };

  private squashGodrofl = (godrofl : Godrofl) => {
    this.godlikesquash?.play();
    if (godrofl != undefined && godrofl.position != undefined ){
      this.usedPosition[godrofl.position] = false;
    }
    godrofl.setDead(true);
    if (this.player != undefined){
      this.player.removeLife();
      this.updateLivesCounter();
    }
  };

  private roflTimeOut = (rofl : Rofl) => {

    if (!rofl.isDead && this.player != undefined && this.endingGame == false ){
      
      this.player.removeLife();
      if (rofl != undefined && rofl.position != undefined ){
        this.usedPosition[rofl.position] = false;
      }
      this.updateLivesCounter();

      this.gone?.play();
      rofl.setDead(true);
    }

  };

  private godroflTimeOut = (godrofl : Godrofl) => {

    if (!godrofl.isDead && this.player != undefined && this.endingGame == false ){
      this.gone?.play();
      if (godrofl != undefined && godrofl.position != undefined ){
        this.usedPosition[godrofl.position] = false;
      }
      godrofl.setDead(true);
    }

  };

  // Updating live counter
  private updateLivesCounter= () => {
    if ( this.player != undefined && this.livesText != undefined){ //
      this.lives = this.player.getLives();
      this.livesText.setText( 'Lives: ' + this.lives.toString() );
   }
  };


  // timer settings
  // reference (negative exponential model): y = t0* ( exp(-a*x+log(1-b)) +b ) = t0*(exp(alpha)+b)
  private updateRoflTimers (){
    const b = 0.1;
    const a = 0.05;
    const alpha = (-a*this.roflCount)+Math.log2(0.95);

    if ( this.popRoflTimer != undefined && this.goneRoflTimer != undefined ){
      
      this.popRoflTimer = Math.floor(this.popRoflTimerIni*(Math.exp(alpha)+b));
      this.goneRoflTimer = Math.floor(this.goneRoflTimerIni*(Math.exp(alpha)+b));

    } else {

      this.popRoflTimer = this.popRoflTimerIni;
      this.goneRoflTimer = this.goneRoflTimerIni;

    }

  }

  private updateGodroflTimers (){
    const b = 0.1;
    const a = 0.05;
    const alpha = (-a*this.godroflCount)+Math.log2(0.95);

    if ( this.popGodroflTimer != undefined && this.goneGodroflTimer != undefined ){
      
      this.popGodroflTimer = Math.floor(this.popGodroflTimerIni*(Math.exp(alpha)+b));
      this.goneGodroflTimer = Math.floor(this.goneGodroflTimerIni*(Math.exp(alpha)+b));

    } else {

      this.popGodroflTimer = this.popGodroflTimerIni;
      this.goneGodroflTimer = this.goneGodroflTimerIni;

    }

  }

  public getLocationX (positionIndex : number):number {
    let x=0;
    switch (true) {
      case positionIndex == 1:
        x = getGameWidth(this)  * ( 0.215-0.034 );
        break;
      case positionIndex == 2:
        x = getGameWidth(this)  * ( 0.145-0.034 );
        break;
      case positionIndex == 3:
        x = getGameWidth(this)  * ( 0.332-0.034 );
        break;
      case positionIndex == 4:
        x = getGameWidth(this)  * ( 0.797-0.034 );
        break;
      case positionIndex == 5:
        x = getGameWidth(this)  * ( 0.854-0.034 );
         break;
      case positionIndex >= 6:
        x= getGameWidth(this)  * ( 0.671-0.034 );
        break;
      default:
    }
    console.log(x);
    return x;
  }

  public getLocationY (positionIndex : number):number {
    let y=0;
    switch (true) {
      case positionIndex == 1:
        y = getGameHeight(this) * ( 0.89-0.062  );
        break;
      case positionIndex == 2:
        y = getGameHeight(this) * ( 0.672-0.062 );
        break;
      case positionIndex == 3:
        y = getGameHeight(this) * ( 0.517-0.062 );
        break;
      case positionIndex == 4:
        y = getGameHeight(this) * ( 0.89-0.062  );
        break;
      case positionIndex == 5:
         y = getGameHeight(this) * ( 0.672-0.062 );
         break;
      case positionIndex >= 6:
         y = getGameHeight(this) * ( 0.517-0.062 );
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

  private endGame(){
    window.history.back();
  }

  public update(): void {
    // Every frame, we update the player
    this.player?.update();

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
        this.godrofls,
        (_, godrofl) => {
          this.squashGodrofl(godrofl as Godrofl); 
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
         delay: this.gameOverTimer,
         callback: this.endGame,
          callbackScope: this,
          loop: false,
        });
      
      }
      
    }



  }
}
