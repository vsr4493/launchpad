import express from 'express';
import { render } from '@jaredpalmer/after';
import Document from 'server/Document';
import routes from './routes';

const assets = require(process.env.RAZZLE_ASSETS_MANIFEST);

const server = express();
server
  .disable('x-powered-by')
  .use(express.static(process.env.RAZZLE_PUBLIC_DIR))
  .get('/*', async (req, res) => {
    try {
      const html = await render({
        req,
        res,
        routes,
        assets,
        document: Document,
        // Anything else you add here will be made available
        // within getInitialProps(ctx)
        // e.g a redux store...
      });
      res.send(html);
    } catch (error) {
      console.log(error);
      res.json(error);
    }
  });

export default server;