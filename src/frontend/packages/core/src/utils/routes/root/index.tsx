import React from 'react';
import { defineMessages, IntlShape } from 'react-intl';
import { Navigate, Outlet, RouteObject } from 'react-router-dom';
import { ManganelliLayout } from '../../../components';
import { RoomsPath } from '../rooms';

export enum RootPath {
  ROOT = '/app',
  HOME = '/',
  CISCO = '/cisco',
  CISCO_SETTINGS = '/cisco/configs',
  CISCO_ROOM_SETTINGS = '/cisco/:id/configs',
}

const rootRouteLabels = defineMessages({
  [RootPath.ROOT]: {
    defaultMessage: 'Home',
    description: 'Label of the home view.',
    id: 'utils.routes.root.root.label',
  },
});

export const getRootRoute = (intl: IntlShape, children: RouteObject[]): RouteObject => {
  return {
    path: RootPath.ROOT,
    element: (
      <ManganelliLayout>
        <Outlet />
      </ManganelliLayout>
    ),
    children: [
      ...children,
      {
        index: true,
        element: <Navigate to={RoomsPath.ROOMS} />,
      },
    ],
  };
};
