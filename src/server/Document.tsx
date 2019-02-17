import React from 'react';
import { AfterRoot, AfterData } from '@jaredpalmer/after';
import { Route, Switch } from 'react-router-dom';
import Layout from 'shared/pages/Shell';
import globalStyles from './styles'; 
import { Global, css } from "@emotion/core";

const modPageFn = function<Props>(PageRenderer: React.ComponentType<Props>) {
  return (props: Props) => console.log(props) || (
    <Layout {...props}>
      <PageRenderer {...props} />
    </Layout>
  );
};

class Document extends React.Component {
  static async getInitialProps({ assets, data, renderPage }) {
    const page = await renderPage(modPageFn);
    return { assets, data, ...page };
  }

  render() {
    const { helmet, assets, data } = this.props;
    // get attributes from React Helmet
    const htmlAttrs = helmet.htmlAttributes.toComponent();
    const bodyAttrs = helmet.bodyAttributes.toComponent();

    return (
      <html {...htmlAttrs}>
        <head>
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
          <meta charSet="utf-8" />
          <title>Welcome to the Afterparty</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          {helmet.title.toComponent()}
          {helmet.meta.toComponent()}
          {helmet.link.toComponent()}
          {assets.client.css && (
            <link rel="stylesheet" href={assets.client.css} />
          )}
          <Global styles={globalStyles}/>
          <script 
            dangerouslySetInnerHTML={{
              __html: `
                if ('serviceWorker' in navigator) {
                  window.addEventListener('load', () => {
                    navigator.serviceWorker.register('/service-worker.js')
                    .then((registration) => {
                      console.log('Service Worker registration completed with scope: ',
                        registration.scope)
                    }, (err) => {
                      console.log('Service Worker registration failed', err)
                    })
                  })
                } else {
                  console.log('Service Workers not supported')
                }
            `}}
          />
        </head>
        <body {...bodyAttrs}>
          <AfterRoot />
          <AfterData data={data} />
          <script
            type="text/javascript"
            src={assets.client.js}
            defer
            crossOrigin="anonymous"
          />
        </body>
      </html>
    );
  }
}

export default Document;