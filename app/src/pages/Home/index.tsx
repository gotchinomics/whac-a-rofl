import { useCallback, useEffect, useState } from 'react';
import {
  Layout, GotchiSelector, DetailsPanel, Modal, GotchiSVG,
} from 'components';
import { Link } from 'react-router-dom';
import globalStyles from 'theme/globalStyles.module.css';
import { useServer } from 'server-store';
import { useWeb3, updateAavegotchis } from 'web3/context';
import {
  getDefaultGotchi
} from 'helpers/aavegotchi';
import gotchiLoading from 'assets/gifs/loading.gif';
import { playSound } from 'helpers/hooks/useSound';
import styles from './styles.module.css';
import { Scale } from 'phaser';

const Home = () => {
  const {
    state: {
      usersAavegotchis, address, selectedAavegotchiId, networkId
    },
    dispatch,
  } = useWeb3();
  const { highscores } = useServer();
  const [showRulesModal, setShowRulesModal] = useState(false);

  const useDefaultGotchi = () => {
    dispatch({ type: "SET_USERS_AAVEGOTCHIS", usersAavegotchis: [getDefaultGotchi()]});
  }

  /**
   * Updates global state with selected gotchi
   */
  const handleSelect = useCallback(
    (gotchiId: string) => {
      dispatch({ type: "SET_SELECTED_AAVEGOTCHI", selectedAavegotchiId: gotchiId });
    },
    [dispatch],
  );

  useEffect(() => {
    if (process.env.REACT_APP_OFFCHAIN) return useDefaultGotchi();

    if (address) {
      const prevGotchis = usersAavegotchis || [];
      if (prevGotchis.find(gotchi => gotchi.owner.id.toLowerCase() === address.toLowerCase())) return;

      dispatch({ type: "SET_SELECTED_AAVEGOTCHI", selectedAavegotchiId: undefined });
      updateAavegotchis(dispatch, address);
    }
  }, [address]);

  if (networkId !== 137) {
    return (
      <Layout>
        <div className={globalStyles.container}>
          <div className={styles.errorContainer}>
            <h1>{!networkId ? "Not connected" : "Wrong network"}</h1>
            <p className={styles.secondaryErrorMessage}>
              Please connect to the Polygon network.
            </p>
          </div>
        </div>
      </Layout>
    )
  }

  if (usersAavegotchis && usersAavegotchis?.length <= 0) {
    return (
      <Layout>
        <div className={globalStyles.container}>
          <div className={styles.errorContainer}>
            <p>No Aavegotchis found for address - Please make sure the correct wallet is connected.</p>
            <p className={styles.secondaryErrorMessage}>
              Don’t have an Aavegotchi? Visit the Baazaar to get one.
            </p>
            <a
              href="https://aavegotchi.com/baazaar/portals-closed?sort=latest"
              target="__blank"
              className={globalStyles.primaryButton}
            >
              Visit Bazaar
            </a>
            {/* Allows developers to build without the requirement of owning a gotchi */}
            {process.env.NODE_ENV === 'development' && (
              <button
                onClick={useDefaultGotchi}
                className={globalStyles.primaryButton}
              >
                Use Default Gotchi
              </button>
            )}
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {showRulesModal && (
        <Modal onHandleClose={() => setShowRulesModal(false)}>
          <div className={styles.modalContent}>
            <h1>WHAC-A-ROFL</h1>
            <p>
            Dear Fren, we need your help! The Lickquidators have invaded Rolf Reefs causing a yuuuge migration of MEME frogs to Poly Lakes. Try to be quick and get rid of the Rofls before it is too late! But be careful, Lickquidators are lurking around and they can suck the life out of your Gotchi with their disgusting tongue. Good luck on your mission, Gotchigang is stronk and together we will stop the plague!
            
            <h2>Rofl types:</h2>

            <div className={styles.imageText_Row} >
              <img src="assets/sprites/commonrofl.png" alt="Common Rofl" width="64" height="64" />
              
              <div className={styles.descriptionText} >  
                  <b>Common</b>: The most popular type of MEME frogs. 
              </div>
             </div>

             <div className={styles.imageText_Row} >
              <img src="assets/sprites/grenaderofl.png" alt="Grenadier Rofl" width="64" height="64" />
               
              <div className={styles.descriptionText} >  
                <b>Grenadier</b>: these Rofls usually carry a grenade, that can be handy if the puddles get crowded.
              </div>
             </div>

             <div className={styles.imageText_Row} >
              <img src="assets/sprites/drankrofl.png" alt="LilPump Rofl" width="64" height="64" />
              
              <div className={styles.descriptionText} >  
              <b>LilPump</b>: rap is very popular among Rofls, being Lil Pump their greatest idol. They love to drink Lean, which gets them chill but freezes their brain.
              </div>
             </div>

             <div className={styles.imageText_Row} >
              <img src="assets/sprites/heartrofl.png" alt="Godlike Rofl" width="64" height="64" />
              
              <div className={styles.descriptionText} >  
                <b>Godlike</b>: the only Rofl in the Gotchiverse that can fly. If you catch one you will see how your Gotchi health increases.
              </div>
             </div>

            </p>
          </div>
        </Modal>
      )}
      <div className={globalStyles.container}>
        <div className={styles.homeContainer}>
          <div className={styles.selectorContainer}>
            <GotchiSelector
              initialGotchiId={selectedAavegotchiId}
              gotchis={usersAavegotchis}
              selectGotchi={handleSelect}
            />
          </div>
          <div style={{ 
            backgroundRepeat: 'no-repeat',
            backgroundSize: "cover",
            backgroundPosition: "center",
            height: "100%",
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <div className={styles.gotchiContainer}>
            {selectedAavegotchiId ? (
              <GotchiSVG tokenId={selectedAavegotchiId} options={{ animate: true, removeBg: true }}  />
            ) : (
              <img src={gotchiLoading} alt="Loading Aavegotchi"/>
            )}
            <h1 className={styles.highscore}>
              Highscore:
              {' '}
              {usersAavegotchis && highscores?.find((score) => score.tokenId === selectedAavegotchiId)
                ?.score || 0}
            </h1>
            <div className={styles.buttonContainer}>
              <Link
                to="/play"
                className={`${globalStyles.primaryButton} ${
                  (!usersAavegotchis) ? globalStyles.disabledLink : ''
                }`}
                onClick={() => playSound('send')}
              >
                Start
              </Link>
              <button
                onClick={() => {
                  //playSound('click');
                  setShowRulesModal(true);
                }}
                className={`${globalStyles.secondaryButton} ${globalStyles.circleButton}`}
              >
                ?
              </button>
            </div>
          </div>
          </div>
          <div className={styles.detailsPanelContainer}>
            <DetailsPanel selectedGotchi={usersAavegotchis?.find(gotchi => gotchi.id === selectedAavegotchiId)} />
          </div>
        </div>
      </div>
      <div style={{ 
      backgroundImage: "url(assets/images/grid.png)",
      backgroundRepeat: 'no-repeat',
      backgroundSize: "cover",
      height: "25vh",
       backgroundPosition: "center",
      }}>
        
      </div>
    </Layout>
  );
};

export default Home;
