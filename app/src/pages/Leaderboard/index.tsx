import { Layout } from 'components/Layout';
import { useServer } from 'server-store';
import { useWeb3 } from 'web3/context';
import { Leaderboard as LeaderboardComponent } from 'components/Leaderboard';
import globalStyles from 'theme/globalStyles.module.css';
import styles from './styles.module.css';

const Leaderboard = () => {
  const { state: { usersAavegotchis } } = useWeb3();
  const { highscores } = useServer();
  //const endDate = new Date('August 19, 2021 16:00:00') ;
  const endDate = new Date('September 24, 2021 16:00:00 UTC+2') ;

  const getReward = (position : number , score?:  number) => {
    /*
    if (position == 1) {
      return "15 XP + 1 XP Potion"
    } else if (position <= 100 ) {
      return "15 XP"
    } else if (position <= 500 ) {
      return "10 XP"
    } else if (score && score > 100 ) {
      return "5 XP"
    } else {
      return ""
    }
    */
    if (position == 1) {
      return "1 x MYTHICAL TICKET"
    } else if (position <= 3 ) {
      return "1 x LEGENDARY TICKET"
    } else if (position <= 5 ) {
      return "1 x RARE TICKET"
    } else if (position <= 10 ) {
      return "1 x UNCOMMON TICKET"
    } else {
      return ""
    }
  }

  const competition = { endDate , rewards:getReward };

  return (
    <Layout>
      <div className={styles.leaderboardHead}>
        <h1>Get ready for Raffle#5!</h1> 
        Our GotchiGang &apos;Ghost Squad&apos; has launched a contest between our guild members to win raffle tickets. Secure a position in the top 10 to win a prize! Only one gotchi is eligible per unique Discord member. Make sure to retweet the original announcement and join our Discord and/or Telegram to receive your reward:
          <ul>
              <li><a href="https://discord.gg/HA6qkpDPCY" rel="noreferrer"> <b>Discord</b> </a> </li>
              <li> <a href="https://t.me/gotchisquad" rel="noreferrer"> <b>Telegram</b> </a> </li>
          </ul>
        </div>
      <div className={globalStyles.container}>
        <LeaderboardComponent highscores={highscores} ownedGotchis={usersAavegotchis?.map((gotchi) => gotchi.id)} competition={competition}/>
      </div>
    </Layout>
  );
  // if there is a competition replace line 32 by:
  //<LeaderboardComponent highscores={highscores} ownedGotchis={usersAavegotchis?.map((gotchi) => gotchi.id)}  competition={competition}/> 
};

export default Leaderboard;
