import React from 'react';
import * as styles from './styles';
import { css } from '@emotion/core';

interface HomeState {
  isClicked: boolean;
}

const actions = {
  toggleClick: (state: HomeState) => {
    return {
      isClicked: !state.isClicked 
    };
  }
}

class Home extends React.Component<any, HomeState> {

  constructor(props: any) {
    super(props);
    this.state = {
      isClicked: false,
    };
  }

  static async getInitialProps({ req, res, match, history, location, ...ctx }: any) {
    return new Promise((resolve, reject) => {
      setTimeout(() => resolve({ name: 'vsr' }), 200);
    });
  }

  onClick = () => this.setState(actions.toggleClick);

  render() {
    console.log('hey');
    return (
      <div onClick={this.onClick} css={css`
        ${styles.header}
        background-color: ${this.state.isClicked ? '#e74c3c' : '#c0392b'};
      `}>
        <div className='somestuff'>
          <h1>Page 1</h1>
        </div>
      </div>
    );
  }
}

export default Home;