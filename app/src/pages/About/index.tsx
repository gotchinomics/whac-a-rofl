import { Layout } from 'components/Layout';
import styles from './styles.module.css';

const About = () => {

  return (
    <Layout>
      <div className={styles.container}>

        <h1>About me</h1>
        <div className={styles.imageText_Row} >
              <img src="assets/images/yoda.png" alt="Yoda#3934" width="256" height="256" />
              
              <div className={styles.descriptionText} >
                <p>  
                  I am a data scientist fascinated by Aavegotchi and the Gotchiverse Realm. 
                  If you have any feedback/suggestions go ahead and send me a PM via Twitter. 
                  <ul>
                    <li> <a href="https://twitter.com/gotchinomics" rel="noreferrer"> <b> twitter.com/gotchinomics </b> </a></li>
                  </ul>
                </p>
                
              </div>
        </div>

        <br />

        <h1>Ghost Squad</h1>
        <div className={styles.imageText_Row} >
              <img src="assets/images/ghostSquad.jpg" alt="Ghost Squad" width="256" height="256" />
              
              <div className={styles.descriptionText} >
                <p>  
                If you would like to keep up with the latest updates and future games, feel free to join our GotchiGang! 
                <ul>
                  <li> <a href="https://discord.gg/HA6qkpDPCY" rel="noreferrer"> <b>Discord</b> </a></li>
                  <li> <a href="https://t.me/gotchisquad" rel="noreferrer"> <b>Telegram</b> </a> </li>
                </ul>
                </p>
              </div>
        </div>

        <br />

        If you enjoyed playing the game and you are feeling generous, you can send a tip to the following address: 0xccd93d99090523C70A15cFFa1E7087D0160D0329

      </div>
    </Layout>
  );
};

export default About;
