import { useQuery } from '@tanstack/react-query';
import { Box, Heading, Spinner } from 'grommet';
import * as React from 'react';
import { defineMessages } from 'react-intl';
import { useRouting } from '../../../context';
import { useTranslations } from '../../../i18n';
import { KeycloakService } from '../../../services';
import CiscoCoSpaceRepository from '../../../services/cisco/cospaces.repository';
import { MagnifyQueryKeys } from '../../../utils';
import { CoSpaceInterface, MyCiscoRooms } from '../../../components/cisco/MyRooms';

const messages = defineMessages({
  title_part_one: {
    defaultMessage: `Webconférences sécurisées de l'État`,
    id: 'view.cisco.rooms.title_part_one',
    description: 'Main title part one',
  },
  title_part_two: {
    defaultMessage: ` `,
    id: 'view.cisco.rooms.title_part_two',
    description: 'Main title',
  },
  login: {
    defaultMessage: 'Please logIn',
    id: 'view.cisco.rooms.login_request_message',
    description: 'Please logIn',
  },
});

export function CiscoRoomsListView() {
  const intl = useTranslations();

  const { data, isLoading, isError, refetch } = useQuery(
    [MagnifyQueryKeys.CISCO_ROOMS],
    CiscoCoSpaceRepository.getAll,
    {
      enabled: KeycloakService.isLoggedIn(),
      onError: (err: any) => {
        console.log(err);

        if (err.response?.data?.error) {
          alert(err.response.data?.error);
        } else if (err.response.status === 404) {
          alert('Please, configure your CISCO credentials');
        }
      },
    }
  );
  const router = useRouting();

  return (
    <>
      <Box align={'center'} direction={'column'} height={{ min: 'auto' }} justify={'center'}>
        <Heading color={'brand'} level={1} margin="none" textAlign={'center'}>
          {intl.formatMessage(messages.title_part_one)}
        </Heading>
        <Heading color={'brand'} level={3} margin="none" textAlign={'center'}>
          {intl.formatMessage(messages.title_part_two)}
        </Heading>
      </Box>
      {KeycloakService.isLoggedIn() ? (
        <MyCiscoRooms rooms={data} isLoading={isLoading} isError={isError} refetch={refetch} />
      ) : (
        <Box align={'center'} direction={'column'} height={{ min: 'auto' }} justify={'center'}>
          {intl.formatMessage(messages.login)}
        </Box>
      )}
    </>
  );
}
