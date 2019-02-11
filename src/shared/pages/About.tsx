import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import * as styles from './styles';

class Home extends Component {
  static async getInitialProps(...args) {
    console.log("CAlling this", args);

    return new Promise((req, res) => {
      setTimeout(() => res({ about: 'vsr' }), 3000);
    });
  }

  componentDidUpdate() {
    console.log(this.props);
  }

  render() {
    console.log(this.props)
    return (
      <div css={styles.header}>
        <h1>About page</h1>
        <Link to='/'>Home</Link>
      </div>
    );
  }
}

export default Home;