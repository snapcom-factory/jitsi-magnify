import { Button, Box, Image, Menu, Nav, Sidebar } from 'grommet';
import React from 'react';
import { Projects, Group } from 'grommet-icons';
import { useIsMobile } from '../../../../hooks/useIsMobile';
import { useRouting } from '../../../../context';
import logoCisco from '../SimpleLayout/logo-cisco.png';
import logoWebconf from '../SimpleLayout/logo-webconf.jpg';

const SidebarButton = ({
  icon,
  ...rest
}: {
  icon: JSX.Element | undefined;
}) => (
  <Box>
    <Button {...rest} alignSelf="start" gap="medium" icon={icon} plain />
  </Box>
);

const SidebarHeader = () => {
  const isMobile = useIsMobile();
  const router = useRouting();
  return (
    <Box
      align="center"
      background="dark-2"
      gap="large"
      height={'74px'}
      pad={{ horizontal: 'auto', vertical: isMobile ? 'large' : 'medium' }}
    >
            <Menu
              dropProps={{ stretch: false, align: { top: 'bottom', right: 'right' }, background: "light-2" }}
              items={[
                {
                  onClick: () => router.goToRoomsList(),
                  label: (
                    <Box
                      alignSelf={'center'}
                      margin={{ left: 'xsmall' }}
                    >
                      <Image src={logoWebconf} />
                    </Box>
                  ),
                },
                {
                  onClick: () => router.goToCiscoRoomsList(),
                  label: (
                    <Box
                      alignSelf={'center'}
                      margin={{ left: 'xsmall' }}
                    >
                      <Image src={logoCisco} />
                    </Box>
                  ),
                },
              ]}
            >
              <SidebarButton icon={<Projects />} />
            </Menu>
    </Box>
  );
};

const MainNavigation = () => (
  <Nav
    aria-label="main navigation"
    gap="medium"
    margin={{ left: 'small', right: 'small', vertical: 'none' }}
    responsive={false}
  >
    <SidebarButton icon={<Group />} />
  </Nav>
);

export const Labels = () => (
  <Sidebar
    background="brand"
    header={<SidebarHeader />}
    pad={{ left: 'none', right: 'none', vertical: 'none' }}
    responsive={false}
  >
    <MainNavigation />
  </Sidebar>
);

Labels.args = {
  full: true,
};

export default {
  title: 'Layout/Sidebar/Labels',
};
