import { Button, Box, Nav, Sidebar } from 'grommet';
import React from 'react';
import { Projects, Group } from 'grommet-icons';
import { useIsMobile } from '../../../../hooks/useIsMobile';

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
  return (
    <Box
      align="center"
      background="dark-2"
      gap="large"
      height={'74px'}
      pad={{ horizontal: 'auto', vertical: isMobile ? 'large' : 'medium' }}
    >
      <SidebarButton icon={<Projects />} />
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
