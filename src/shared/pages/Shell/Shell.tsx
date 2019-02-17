import React from 'react';
import * as styles from './styles';
import { Switch, Link, Route } from 'react-router-dom';

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

class Shell extends React.Component<any, HomeState> {

  constructor(props: any) {
    super(props);
    this.state = {
      isClicked: false,
    };
  }

  render() {
    const { location, routes, children } = this.props;

    return (
      <div>
        <h1>Header</h1>
        <Link to='/page-1'>Page 1 </Link>
        {children}
      </div>
    );
  }
}

export default Shell;