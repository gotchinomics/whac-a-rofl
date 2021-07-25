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
export const NET = 'net';
export const DRANK = 'drank';
export const GRENADE = 'grenade';
export const FULLSCREEN = 'fullscreen';
export const LEFT_CHEVRON = 'left_chevron';
export const CLICK = 'click';
export const POP = 'pop';
export const GONE = 'gone';
export const SQUASH = 'squash';
export const LICKING = 'licking';
export const GODLIKESQUASH = 'godlikesquash';
export const GAMETUNE = 'gametune';
export const GAMEOVER = 'gameover';
export const HEART = 'heart';
export const COMMONROFL = 'commonrofl';
export const UNCOMMONROFL = 'uncommonrofl';
export const RAREROFL = 'rarerofl';
export const MYTHICALROFL = 'mythicalrofl';
export const COMMONROFLJOINT = 'commonrofljoint';
export const UNCOMMONROFLJOINT = 'uncommonrofljoint';
export const RAREROFLJOINT = 'rarerofljoint';
export const MYTHICALROFLJOINT = 'mythicalrofl_oint';
export const LICKQUIDATOR = 'lickquidator';
export const SPLASH = 'splash';
export const HITTING = 'hitting';


// Save all in game assets in the public folder
export const assets: Array<Asset | SpritesheetAsset> = [
  {
    key: BG,
    src: 'assets/images/bg2.png',
    type: 'IMAGE',
  },
  {
    key: NET,
    src: 'assets/icons/cursor_net.cur',
    type: 'IMAGE',
  },
  {
    key: DRANK,
    src: 'assets/icons/lilpumpdrank.png',
    type: 'IMAGE',
  },
  {
    key: GRENADE,
    src: 'assets/icons/grenade.png',
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
    key: LICKING,
    src: 'assets/sounds/licking.wav',
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
    key: HEART,
    src: 'assets/sprites/heart.png',
    type: 'SPRITESHEET',
    data: {
      frameWidth: 64 / 1,
      frameHeight: 64 / 1,
    }
  },
  {
    key: COMMONROFL,
    src: 'assets/sprites/commonrofl.png',
    type: 'SPRITESHEET',
    data: {
      frameWidth: 512 / 1,
      frameHeight: 512 / 1,
    }
  },
  {
    key: UNCOMMONROFL,
    src: 'assets/sprites/lilmythicalrofl.png',
    type: 'SPRITESHEET',
    data: {
      frameWidth: 512 / 1,
      frameHeight: 512 / 1,
    }
  },
  {
    key: RAREROFL,
    src: 'assets/sprites/rarerofl2.png',
    type: 'SPRITESHEET',
    data: {
      frameWidth: 512 / 1,
      frameHeight: 512 / 1,
    }
  },
  {
    key: MYTHICALROFL,
    src: 'assets/sprites/godlikerofl.png',
    type: 'SPRITESHEET',
    data: {
      frameWidth: 512 / 1,
      frameHeight: 512 / 1,
    }
  },
  {
    key: COMMONROFLJOINT,
    src: 'assets/sprites/commonrofl_drank.png',
    type: 'SPRITESHEET',
    data: {
      frameWidth: 512 / 1,
      frameHeight: 512 / 1,
    }
  },
  {
    key: UNCOMMONROFLJOINT,
    src: 'assets/sprites/lilmythicalrofl_drank.png',
    type: 'SPRITESHEET',
    data: {
      frameWidth: 512 / 1,
      frameHeight: 512 / 1,
    }
  },
  {
    key: RAREROFLJOINT,
    src: 'assets/sprites/rarerofl2_drank.png',
    type: 'SPRITESHEET',
    data: {
      frameWidth: 512 / 1,
      frameHeight: 512 / 1,
    }
  },
  {
    key: MYTHICALROFLJOINT,
    src: 'assets/sprites/godlikerofl_drank.png',
    type: 'SPRITESHEET',
    data: {
      frameWidth: 512 / 1,
      frameHeight: 512 / 1,
    }
  },
  {
    key: LICKQUIDATOR,
    src: 'assets/sprites/liquidator_sprite.png',
    type: 'SPRITESHEET',
    data: {
      frameWidth: 7500 / 12,
      frameHeight: 625 / 1,
    }
  },
  {
    key: SPLASH,
    src: 'assets/sprites/splash_spritev2.png',
    type: 'SPRITESHEET',
    data: {
      frameWidth: 4977 / 9,
      frameHeight: 553 / 1,
    }
  },
  {
    key: HITTING,
    src: 'assets/sprites/hitting_sprite_px.png',
    type: 'SPRITESHEET',
    data: {
      frameWidth: 2048 / 4,
      frameHeight: 2048 / 4,
    }
  },
];


/*
{
    key: LICKQUIDATOR,
    src: 'assets/sprites/lickquidator.png',
    type: 'SPRITESHEET',
    data: {
      frameWidth: 553 / 1,
      frameHeight: 553 / 1,
    }
  },
*/