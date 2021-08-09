import { Layout } from 'components/Layout';
import globalStyles from 'theme/globalStyles.module.css';
import styles from './styles.module.css';

const About = () => {

  return (
    <Layout>
      <div className={styles.container}>
      <h1>Description</h1>
      <img src="assets/images/yoda.png" alt="Yoda#3934" width="128" height="128" />
        <ul>
          <li>Discord: </li>
          <li>Telegram: </li>
          <li>Email: </li>
        </ul>
      </div>
    </Layout>
  );
};

export default About;
