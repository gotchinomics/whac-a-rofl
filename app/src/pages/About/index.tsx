import { Layout } from 'components/Layout';
import globalStyles from 'theme/globalStyles.module.css';

const About = () => {

  return (
    <Layout>
      <div className={globalStyles.container}>
      <h1>THIS IS A TEST</h1>
        <ul>
          <li>SOMETHING</li>
          <li>WHATEVER</li>
          <li>CHECK</li>
        </ul>
      </div>
    </Layout>
  );
};

export default About;
