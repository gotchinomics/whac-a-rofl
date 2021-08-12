import { Layout } from 'components/Layout';
import { useServer } from 'server-store';
import { useWeb3 } from 'web3/context';
import { Leaderboard as LeaderboardComponent } from 'components/Leaderboard';
import globalStyles from 'theme/globalStyles.module.css';

const Leaderboard = () => {
  const { state: { usersAavegotchis } } = useWeb3();
  const { highscores } = useServer();
  const endDate = new Date('August 19, 2021 16:00:00') ;

  const getReward = (position : number , score?:  number) => {

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
  }

  const competition = { endDate , rewards:getReward };

  return (
    <Layout>
      <div className={globalStyles.container}>
        <LeaderboardComponent highscores={highscores} ownedGotchis={usersAavegotchis?.map((gotchi) => gotchi.id)} competition={competition} />
      </div>
    </Layout>
  );
};

export default Leaderboard;
