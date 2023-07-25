import { Button } from '@openfun/cunningham-react';
import { Image, Box, Header, Menu } from 'grommet';
import * as React from 'react';
import { PropsWithChildren } from 'react';
import { defineMessages } from 'react-intl';
import { useRouting } from '../../../../context';
import { useTranslations } from '../../../../i18n';
import { KeycloakService } from '../../../../services';
import { ResponsiveLayoutHeaderAvatar } from '../Header';
import { Labels } from '../Sidebar/Sidebar';
import logoCiscoLg from './logo-cisco-lg.png';
import logoCisco from './logo-cisco.png';
import logoWebconfLg from './logo-webconf-lg.jpg';
import logoWebconf from './logo-webconf.jpg';

interface Props {}

const messages = defineMessages({
  logout: {
    defaultMessage: 'Logout',
    id: 'components.designSystem.layout.simpleLayout.logout',
    description: 'label to logout',
  },
  login: {
    defaultMessage: 'Log in',
    id: 'components.designSystem.layout.simpleLayout.login',
    description: 'label to login',
  },
  register: {
    defaultMessage: 'Create an account',
    id: 'components.designSystem.layout.simpleLayout.register',
    description: 'label to register',
  },
});

export const ManganelliLayout = ({ ...props }: PropsWithChildren<Props>) => {
  const intl = useTranslations();
  const router = useRouting();
  const isLog = KeycloakService.isLoggedIn();

  return (
    <Box direction="row" height={{ min: '100%' }}>
      <Labels />
      <Box width={'100%'}>
        <Header background="light-4" direction="row" height={'74px'} pad="small">
          <Box direction={'row'} style={{ gap: '20px' }}>
            <Menu
              dropProps={{ stretch: true, align: { top: 'bottom', right: 'right' } }}
              items={[
                {
                  onClick: () => router.goToRoomsList(),
                  label: (
                    <Box alignSelf={'center'} margin={{ left: 'xsmall' }}>
                      <Image src={logoWebconf} />
                    </Box>
                  ),
                },
                {
                  onClick: () => router.goToCiscoRoomsList(),
                  label: (
                    <Box alignSelf={'center'} margin={{ left: 'xsmall' }}>
                      <Image src={logoCisco} />
                    </Box>
                  ),
                },
              ]}
            >
              Mes espaces virtuelles
            </Menu>
          </Box>
          <div>
            {!window.location.pathname.startsWith('/app/users/preferences') && (
              <Image
                src={window.location.pathname.startsWith('/cisco') ? logoCiscoLg : logoWebconfLg}
                width={'200px'}
              />
            )}
            {window.location.pathname.startsWith('/cisco')}
          </div>
          <Box direction={'row'} style={{ gap: '20px' }}>
            {!isLog && (
              <>
                {window.config.MAGNIFY_SHOW_REGISTER_LINK && (
                  <Button color="secondary" onClick={() => router.goToRegister()} size={'small'}>
                    {intl.formatMessage(messages.register)}
                  </Button>
                )}

                <Button color="primary" onClick={router.goToLogin} size={'small'}>
                  {intl.formatMessage(messages.login)}
                </Button>
              </>
            )}

            {isLog && <ResponsiveLayoutHeaderAvatar />}
          </Box>
        </Header>
        <Box
          background={'light-2'}
          height={'100%'}
          pad={'4rem 2rem 2rem 2rem'}
          style={{
            width: '100%',
            marginLeft: '0%',
            overflow: 'auto',
          }}
        >
          <div>
            <Box style={{ gap: '10px' }}>{props.children}</Box>
          </div>
        </Box>
      </Box>
    </Box>
  );
};
