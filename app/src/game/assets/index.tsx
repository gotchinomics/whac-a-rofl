export interface Asset {
  key: string;
  src: string;
  type: 'IMAGE' | 'SVG' | 'SPRITESHEET' | 'AUDIO';
  data?: {
    frameWidth?: number;
    frameHeight?: number;
  };
}

export interface SpritesheetAsset extends Asset {
  type: 'SPRITESHEET';
  data: {
    frameWidth: number;
    frameHeight: number;
  };
}

export const BG = 'bg';
export const FULLSCREEN = 'fullscreen';
export const LEFT_CHEVRON = 'left_chevron';
export const CLICK = 'click';
export const POP = 'pop';
export const GONE = 'gone';
export const SQUASH = 'squash';
export const GODLIKESQUASH = 'godlikesquash';
export const GAMETUNE = 'gametune';
export const GAMEOVER = 'gameover';
export const ROFL = 'rofl';
export const GODROFL = 'godrofl';


// Save all in game assets in the public folder
export const assets: Array<Asset | SpritesheetAsset> = [
  {
    key: BG,
    src: 'assets/images/bg.png',
    type: 'IMAGE',
  },
  {
    key: LEFT_CHEVRON,
    src: 'assets/icons/chevron_left.svg',
    type: 'SVG',
  },
  {
    key: CLICK,
    src: 'assets/sounds/click.mp3',
    type: 'AUDIO',
  },
  {
    key: POP,
    src: 'assets/sounds/pop.mp3',
    type: 'AUDIO',
  },
  {
    key: GONE,
    src: 'assets/sounds/gone.mp3',
    type: 'AUDIO',
  },
  {
    key: SQUASH,
    src: 'assets/sounds/squash.mp3',
    type: 'AUDIO',
  },
  {
    key: GODLIKESQUASH,
    src: 'assets/sounds/godlikesquash.mp3',
    type: 'AUDIO',
  },
  {
    key: GAMETUNE,
    src: 'assets/sounds/gametune.mp3',
    type: 'AUDIO',
  },
  {
    key: GAMEOVER,
    src: 'assets/sounds/gameover.mp3',
    type: 'AUDIO',
  },
  {
    key: ROFL,
    src: 'assets/sprites/rofl.png',
    type: 'SPRITESHEET',
    data: {
      frameWidth: 553 / 1,
      frameHeight: 553 / 1,
    }
  },
  {
    key: GODROFL,
    src: 'assets/sprites/godrofl.png',
    type: 'SPRITESHEET',
    data: {
      frameWidth: 553 / 1,
      frameHeight: 553 / 1,
    }
  },
];
