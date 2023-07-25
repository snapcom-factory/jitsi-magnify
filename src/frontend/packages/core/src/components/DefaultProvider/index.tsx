import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { RoutingContextProvider } from '../../context';
import { KeycloakService } from '../../services';
import { JitsiPath } from '../../utils/routes/jitsi';
import { RoomsPath } from '../../utils/routes/rooms';
import { RootPath } from '../../utils/routes/root';
import { UserPath } from '../../utils/routes/users';

export interface DefaultProviderProps {
  children: React.ReactNode;
}

export const DefaultProvider = ({ ...props }: DefaultProviderProps) => {
  const navigate = useNavigate();

  return (
    <RoutingContextProvider
      routes={{
        goToDefaultPage: () => navigate(RootPath.HOME),
        goToLogout: () => {
          KeycloakService._kc.logout({
            redirectUri: window.location.href,
          });
        },
        goToLogin: () =>
          KeycloakService._kc.login({
            redirectUri: window.location.href,
          }),
        goToPreferences: () => {
          navigate(UserPath.PREFERENCES);
        },
        goToRegister: () =>
          KeycloakService._kc.register({
            redirectUri: window.location.href,
          }),
        goToAccount: () => {
          KeycloakService._kc.accountManagement();
        },
        goToJitsiRoom: (roomId: string) => {
          navigate(JitsiPath.WEB_CONF.replace(':id', roomId));
        },
        goToRoomsList: () => navigate(RootPath.HOME),
        goToCiscoRoomsList: () => navigate(RootPath.CISCO),
        goToCiscoSettings: () => navigate(RootPath.CISCO_SETTINGS),
        goToRoomSettings: (roomId?: string) => {
          if (roomId) {
            navigate(RoomsPath.ROOMS_SETTINGS.replace(':id', roomId));
          }
        },
      }}
    >
      {props.children}
    </RoutingContextProvider>
  );
};
