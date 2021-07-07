import {
  LEFT_CHEVRON, BG, CLICK
} from 'game/assets';
import { AavegotchiGameObject } from 'types';
import { getGameWidth, getGameHeight, getRelative } from '../helpers';
import { Player , Rofl } from 'game/objects';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: 'Game',
};

/**
 * Scene where gameplay takes place
 */
export class GameScene extends Phaser.Scene {
  private player?: Player;
  private selectedGotchi?: AavegotchiGameObject;
  private rofls?: Phaser.GameObjects.Group;

  // Sounds
  private back?: Phaser.Sound.BaseSound;

  // Rofls
  private addRofls = () =>{
     const size = getGameHeight(this) / 7;
     const x = getGameWidth(this)  / 2;
     const y = getGameHeight(this) / 2;
     const velocityY = -getGameHeight(this) / 4;
     const position = Math.floor(Math.random() * 6) + 1;
    
     // 1: x = W * 1/5 ; y = H * 6/8
     // 2: x = W * 1/10 ; y = H * 3/5
     // 3: x = W * 3/10 ; y = H * 4/10
     
     /*
     if (position == 1){
       const x = getGameWidth(this)  * ( 2 / 10 );
       const y = getGameHeight(this) * ( 6 / 8 );
     }
     if (position == 2){
      const x = getGameWidth(this)  * ( 1 / 10 );
      const y = getGameHeight(this) * ( 6 / 10 );
     }
     if (position == 3){
      const x = getGameWidth(this)  * ( 3 / 10 );
      const y = getGameHeight(this) * ( 4 / 10 );
     } else {
      const x = getGameWidth(this)  / 2;
      const y = getGameHeight(this) / 2;
     }
     

     switch (true) {
      case position == 1:
        const x = getGameWidth(this)  * ( 2 / 10 );
        const y = getGameHeight(this) * ( 6 / 8 );
        break;
      case position == 2:
        const x = getGameWidth(this)  * ( 2 / 10 );
        const y = getGameHeight(this) * ( 6 / 8 );
        break;
        
      default: const x = getGameWidth(this)  * ( 3 / 10 );
      const y = getGameHeight(this) * ( 4 / 10 );
    }
 
     */

    
    for (let i = 0; i < 6; i++){
      if (i == position) {
        this.addRofl(x, y, position, velocityY );
      }
     }


  };

  // Add Rofl
  private addRofl = (x: number, y: number, position: number, velocityY: number) : void =>{
    const rofl: Rofl = this.rofls?.get();
    rofl.activate(x, y, position, velocityY);
     
    // adding killer timer
     this.time.addEvent({
      delay: 5000,
      callback: rofl.timeOut,
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
    // Add layout
    this.add.image(getGameWidth(this) / 2, getGameHeight(this) / 2, BG).setDisplaySize(getGameWidth(this), getGameHeight(this));
    this.back = this.sound.add(CLICK, { loop: false });
    this.createBackButton();

    // Add a player sprite that can be moved around.
    this.player = new Player({
      scene: this,
      x: getGameWidth(this) / 2,
      y: getGameHeight(this) / 2,
      key: this.selectedGotchi?.spritesheetKey || ''
    });

    // Add Rofl group for pooling
    this.rofls = this.add.group({
      maxSize: 10,
      classType: Rofl,
      runChildUpdate: true,
     });

     this.addRofls();

     // Adding Rofl to the scene
     this.time.addEvent({
        delay: 3000,
        callback: this.addRofls,
        callbackScope: this,
        loop: true,
     });



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

  public update(): void {
    // Every frame, we update the player
    this.player?.update();
  }
}
