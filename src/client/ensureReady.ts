import { matchPath } from 'react-router-dom';
import { isLoadableComponent } from 'shared/utils/helpers';

/**
 * This helps us to make sure all the async code is loaded before rendering.
 */
export default async function ensureReady(routes: AsyncRouteProps[], pathname?: string) {
  let matchedComponent = null;
  await Promise.all(
    routes.map(route => {
      const match = matchPath(pathname || window.location.pathname, route);
      if(match && route && route.component) {
        match && route && route.component
      }
      if (match && route && route.component && isLoadableComponent(route.component) && route.component.load) {
        return route.component.load();
      }
      return undefined;
    })
  );

  let data;
  if (typeof window !== undefined && !!document) {
    // deserialize state from 'serialize-javascript' format
    data = eval('(' + (document as any).getElementById('server-app-state').textContent + ')');
  }
  return Promise.resolve(data);
}
