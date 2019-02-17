import React from 'react';
import { hydrate, render } from 'react-dom';
import { BrowserRouter, Switch, Route, Link } from 'react-router-dom';
import { After } from '@jaredpalmer/after';
import ensureReady from 'client/ensureReady';
import { loadInitialProps } from '@jaredpalmer/after';
import Layout from 'shared/pages/Shell';
import routes from './routes';

const isEmpty = obj => obj == null || Object.keys(obj).length === 0; 

class StateFetcher extends React.Component {

  constructor(props) {
    super(props);
    this.state = { 
      data: props.data,
    };
  }

  async componentDidMount() {
    if(isEmpty(this.state.data)) {
      // Fetch data from matched component
      const { match, data } = await loadInitialProps(routes, window.location.pathname, {});
      this.setState({
        data,
      });
    }
  }
  render() {
    const { data } = this.state;
    if(!isEmpty(data)) {
      return (
        <After data={data} routes={routes} />
      );
    }
    // Return app shell loader to match html from service worker
    return null;
  }
}

ensureReady(routes).then((data) => {
  hydrate (
    <BrowserRouter>
      <Layout routes={routes}>
        <StateFetcher data={data} />
      </Layout>
    </BrowserRouter>,
    document.getElementById('root')
  );
});

if (module.hot) {
  module.hot.accept();
}