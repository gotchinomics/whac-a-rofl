import React from 'react';
import { AavegotchiObject } from 'types';
import styles from './styles.module.css';

interface Props {
  selectedGotchi?: AavegotchiObject;
}

export const DetailsPanel = ({ selectedGotchi }: Props) => {
  
  const calculatePercentage = (number: number) => {
    if (number > 100) {
      return '100%';
    }
    if (number < 0) {
      return '0';
    }
    return `${number}%`;
  };
  

  const calculateInversePercentage = (number: number) => {
    const invNumber = 100-number;
    if (invNumber > 100) {
      return '100%';
    }
    if (invNumber < 0) {
      return '0';
    }
    return `${invNumber}%`;
  };

  const calculateBonusPercentage = (gotchiTrait: number) => {
  
      if (gotchiTrait <10 ){
        return `${5}%`;
       } else if ( gotchiTrait >= 10 && gotchiTrait < 25 ){
        return `${25}%`;
       } else if ( gotchiTrait >= 25 && gotchiTrait < 74 ){
        return `${50}%`;
       } else if ( gotchiTrait >= 74 && gotchiTrait < 91 ){
        return `${75}%`;
       } else if ( gotchiTrait >= 91  ){
        return `${100}%`;
       } else {
        return `${0}%`;
       }
  };

  const calculateInverseBonusPercentage = (gotchiTrait: number) => {
  
    if (gotchiTrait <10 ){
      return `${100}%`;
     } else if ( gotchiTrait >= 10 && gotchiTrait < 25 ){
      return `${75}%`;
     } else if ( gotchiTrait >= 25 && gotchiTrait < 74 ){
      return `${50}%`;
     } else if ( gotchiTrait >= 74 && gotchiTrait < 91 ){
      return `${25}%`;
     } else if ( gotchiTrait >= 91  ){
      return `${5}%`;
     } else {
      return `${0}%`;
     }
  };

  const getLivesLabel = (): string => {
    const gotchiTrait = (selectedGotchi?.withSetsNumericTraits[0] as number);
    
    if (gotchiTrait <10 ){
      return `1`;
     } else if ( gotchiTrait >= 10 && gotchiTrait < 25 ){
      return `2`;
     } else if ( gotchiTrait >= 25 && gotchiTrait < 74 ){
      return `3`;
     } else if ( gotchiTrait >= 74 && gotchiTrait < 91 ){
      return `4`;
     } else if ( gotchiTrait >= 91  ){
      return `5`;
     } else {
      return `ERROR`;
     }

  };

  const getPercentageLabel = ( value: string) => {
  
    if ( value ==  `5%` ){
      return `1%`;
     } else if ( value ==  `25%` ){
      return `2%`;
     } else if (  value ==  `50%` ){
      return `3%`;
     } else if (  value ==  `75%` ){
      return `4%`;
     } else if (  value ==  `100%`  ){
      return `5%`;
     } else {
      return `ERROR`;
     }

};

  const renderModifier = (name: string, percentage: string ,  label: string) => (
    <div className={styles.modifierRow}>
      <p>{name}</p>
      <div className={styles.modifierMeter}>
        <div className={styles.labelStyles}>
          <span className={styles.progress} style={{ width: percentage }}>
            <span className={styles.labelStyles}>
              {`${label}`}
            </span>
          </span>
      </div>
      </div>
    </div>
  );

  // Change this variable if the are modified in game-scene.ts 
  const livesPercentage = calculateBonusPercentage(selectedGotchi?.withSetsNumericTraits[0] as number);
  const godlikePercentage = calculateInverseBonusPercentage(selectedGotchi?.withSetsNumericTraits[0] as number);
  const grenadierPercentage = calculateBonusPercentage(selectedGotchi?.withSetsNumericTraits[1] as number);
  const liquidatorTime = String (Math.floor( 10 * ( 1.8 - ((selectedGotchi?.withSetsNumericTraits[1] as number)/100)  ) ) );
  const drankPercentage = calculateInverseBonusPercentage(selectedGotchi?.withSetsNumericTraits[3] as number);
  const goneRoflTimeIni =  Math.floor( 3.5 * ( 1.8 - ((selectedGotchi?.withSetsNumericTraits[2] as number)/100) ) *10)/10  ;  // 1.8 :  0= 1.8; 50=1.3; 100=0.8
  const goneLickquidatorTimeIni = Math.floor(  2 * ( 1.8 - ((selectedGotchi?.withSetsNumericTraits[2] as number)/100) )*10)/10 ;
  const freezeTime = Math.floor( 3 * ( 0.8 + ((selectedGotchi?.withSetsNumericTraits[3] as number)/100)  )*10)/10  ;  // 1.8 :  0= 0.8; 50=1.3; 100=1.8

  const renderTrait = (i: number) => {
    switch (i) {
      case 0:
        return (
          <>
            <div className={styles.traitRow}>
              <p>
                <span className={styles.emoji}>⚡️</span>
                {' '}
                Energy
              </p>
              <p>{selectedGotchi?.withSetsNumericTraits[0]}</p>
            </div>
            {renderModifier('Lifes', livesPercentage , getLivesLabel() )  }
            {renderModifier('Godlike Rofls', godlikePercentage ,  getPercentageLabel(godlikePercentage)  )}
          </>
        );
      case 1:
        return (
          <>
            <div className={styles.traitRow}>
              <p>
                <span className={styles.emoji}>👹</span>
                {' '}
                Aggression
              </p>
              <p>{selectedGotchi?.withSetsNumericTraits[1]}</p>
            </div>
            {renderModifier('Grenadier Rofls', grenadierPercentage , getPercentageLabel(grenadierPercentage))}
            {renderModifier('Lickquidator Spawn', calculateInversePercentage(selectedGotchi?.withSetsNumericTraits[i] as number), `${liquidatorTime}s` )}
          </>
        );
      case 2:
        return (
          <>
            <div className={styles.traitRow}>
              <p>
                <span className={styles.emoji}>👻</span>
                {' '}
                Spookiness
              </p>
              <p>{selectedGotchi?.withSetsNumericTraits[2]}</p>
            </div>
            {renderModifier('Lickquidator TimeOut', calculateInversePercentage(selectedGotchi?.withSetsNumericTraits[i] as number), `${goneLickquidatorTimeIni}s`)}
            {renderModifier('Rofl TimeOut', calculateInversePercentage(selectedGotchi?.withSetsNumericTraits[i] as number), `${goneRoflTimeIni}s`)}
          </>
        );
      case 3:
        return (
          <>
            <div className={styles.traitRow}>
              <p>
                <span className={styles.emoji}>🧠</span>
                {' '}
                Brain size
              </p>
              <p>{selectedGotchi?.withSetsNumericTraits[3]}</p>
            </div>
            {renderModifier('Lil Pump Rofls', drankPercentage , getPercentageLabel(drankPercentage) )}
            {renderModifier('Freeze duration', calculatePercentage(selectedGotchi?.withSetsNumericTraits[i] as number), `${freezeTime}s`)}
          </>
        );
      default:
    }
  };

  return (
    <div className={styles.detailsPanel}>
      <hr />
      <h1>
        {selectedGotchi
          ? `${selectedGotchi?.name} (${selectedGotchi?.id})`
          : 'Fetching Aavegotchi...'}
      </h1>
      <hr />
      {selectedGotchi?.withSetsNumericTraits.map((_, i) => (
        <React.Fragment key={i}>
          {renderTrait(i)}
        </React.Fragment>
      ))}
      <hr />
    </div>
  );
};
