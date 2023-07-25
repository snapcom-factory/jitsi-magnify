import { Button } from '@openfun/cunningham-react';
import { useQuery } from '@tanstack/react-query';
import { Box, Heading, Spinner } from 'grommet';
import * as React from 'react';
import { defineMessages } from 'react-intl';
import { useRouting } from '../../../context';
import { useTranslations } from '../../../i18n';
import { KeycloakService } from '../../../services';
import CiscoCoSpaceRepository from '../../../services/cisco/cospaces.repository';
import { MagnifyQueryKeys } from '../../../utils';

interface CoSpace {
  name: string;
  cisco_id: string;
  call_id: string;
  secret: string;
  owner_call_id?: string;
  is_owner_ask_for_secret?: boolean;
  owner_secret?: string;
  guest_call_id?: string;
  is_guest_ask_for_secret?: boolean;
  guest_secret?: string;
  owner_jid?: string;
  owner_url?: string;
  guest_url?: string;
}

const messages = defineMessages({
  title_part_one: {
    defaultMessage: 'Secure CISCO conference',
    id: 'view.cisco.rooms.title_part_one',
    description: 'Main title part one',
  },
  title_part_two: {
    defaultMessage: 'and quality up to XXX people',
    id: 'view.cisco.rooms.title_part_two',
    description: 'Main title',
  },
  cisco_cettings_button: {
    defaultMessage: 'Configure your cisco credentials',
    id: 'view.cisco.rooms.cisco_cettings_button',
    description: 'Configure your cisco credentials',
  },
});

export function CiscoRoomsListView() {
  const intl = useTranslations();

  const { data, isLoading } = useQuery(
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
    },
  );
  const router = useRouting();

  return (
    <>
      <Box align={'end'} direction={'column'} height={{ min: 'auto' }} justify={'end'}>
        <Button color="secondary" onClick={() => router.goToCiscoSettings()} size={'small'}>
          {intl.formatMessage(messages.cisco_cettings_button)}
        </Button>
      </Box>
      <Box align={'center'} direction={'column'} height={{ min: 'auto' }} justify={'center'}>
        <Heading color={'brand'} level={1} margin="none" textAlign={'center'}>
          {intl.formatMessage(messages.title_part_one)}
        </Heading>
        <Heading color={'brand'} level={3} margin="none" textAlign={'center'}>
          {intl.formatMessage(messages.title_part_two)}
        </Heading>
      </Box>
      {isLoading && (
        <Box align={'center'} direction={'column'} height={{ min: 'auto' }} justify={'center'}>
          <Spinner />
        </Box>
      )}
      {data && (
        <Box direction={'column'} height={{ min: 'auto' }} justify={'center'}>
          <ul>
            {data.map((record: CoSpace) => (
              <li key={record.call_id} style={{ paddingBottom: '10px' }}>
                <p>{record.name}</p>
                {record.guest_url && (
                  <p>
                    Lien invité :{' '}
                    <a href={record.guest_url} rel="noopener noreferrer" target="_blank">
                      {record.guest_url}
                    </a>
                  </p>
                )}
                {record.owner_url && (
                  <p>
                    Lien organisateur :{' '}
                    <a href={record.owner_url} rel="noopener noreferrer" target="_blank">
                      {record.owner_url}
                    </a>
                  </p>
                )}
              </li>
            ))}
          </ul>
        </Box>
      )}
    </>
  );
}
