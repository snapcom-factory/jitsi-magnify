import * as React from 'react';
import {
  createBrowserRouter,
  Navigate,
  Outlet,
  RouteObject,
  RouterProvider,
} from 'react-router-dom';
import { useTranslations } from '../../i18n';
import { getJitsiRoutes } from '../../utils/routes/jitsi';
import { getRoomsRoutes } from '../../utils/routes/rooms';
import { getRootRoute, RootPath } from '../../utils/routes/root';

import { getUsersRoutes } from '../../utils/routes/users';
import { CiscooConfigs } from '../../views/cisco/configs';
import { CiscoRoomsListView } from '../../views/cisco/list';
import { RoomsListView } from '../../views/rooms/list';
import { DefaultProvider } from '../DefaultProvider';
import { ManganelliLayout } from '../design-system';

export const AppRouter = () => {
  const intl = useTranslations();

  let routes: RouteObject[] = [
    {
      path: RootPath.HOME,
      element: (
        <DefaultProvider>
          <Outlet />
        </DefaultProvider>
      ),
      children: [
        {
          ...getRootRoute(intl, [
            { index: true, element: <Navigate to={RootPath.HOME} /> },
            { ...getRoomsRoutes(intl) },
            { ...getUsersRoutes(intl) },
          ]),
        },

        { ...getJitsiRoutes() },
        {
          index: true,
          element: (
            <ManganelliLayout>
              <RoomsListView />
            </ManganelliLayout>
          ),
        },
        {
          path: RootPath.CISCO,
          element: (
            <ManganelliLayout>
              <CiscoRoomsListView />
            </ManganelliLayout>
          ),
        },
        {
          index: true,
          path: '/cisco/configs',
          element: (
            <ManganelliLayout>
              <CiscooConfigs />
            </ManganelliLayout>
          ),
        },
        { path: '*', element: <Navigate to={RootPath.HOME} /> },
      ],
    },
  ];

  let router = createBrowserRouter(routes);

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
};
