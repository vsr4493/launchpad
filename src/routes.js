import React from 'react';
import { asyncComponent } from '@jaredpalmer/after';

const PageShell = () => null;

export default [
  {
    path: '/',
    exact: true,
    component: asyncComponent({
      loader: () => import('./shared/pages/Home'), // required
      Placeholder: () => <div>...LOADING...</div>, // this is optional, just returns null by default
    }),
  },
  {
    path: '/page-1',
    exact: true,
    component: asyncComponent({
      loader: () => import('./shared/pages/Page1'), // required
      Placeholder: () => <div>...LOADING...</div>, // this is optional, just returns null by default
    }),
  },
  {
    path: '/page-2',
    exact: true,
    component: asyncComponent({
      loader: () => import('./shared/pages/Page2'), // required
      Placeholder: () => <div>...LOADING...</div>, // this is optional, just returns null by default
    }),
  },
  {
    path: '/shell',
    exact: true,
    component: PageShell,
  },
];