import { Button } from '@openfun/cunningham-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Box, Heading, List, Spinner, Text } from 'grommet';
import * as React from 'react';
import { defineMessages } from 'react-intl';
import { useRouting } from '../../../context';
import { useTranslations } from '../../../i18n';
import { KeycloakService } from '../../../services';
import { MagnifyQueryKeys } from '../../../utils';
import { useParams } from 'react-router-dom';
import CiscoCoSpaceRepository from '../../../services/cisco/cospaces.repository';
import { StatusCritical, StatusGood } from 'grommet-icons';
import { CiscoRoomUsersConfig } from '../../../components/cisco/RoomConfig/RoomUsersConfig';
import { CiscoRoomSecurityConfig } from '../../../components/cisco/RoomConfig/RoomSecurityConfig';

const messages = defineMessages({
  title_part_one: {
    defaultMessage: 'API Credentials',
    id: 'view.cisco.configs.title_part_one',
    description: 'Main title part one',
  },
  title_part_two: {
    defaultMessage:
      'Please, provide your CISCO credentials here to allow system to interact with CISCO',
    id: 'view.cisco.configs.title_part_two',
    description: 'Main title',
  },
  username_label: {
    defaultMessage: 'username',
    id: 'view.cisco.configs.from_username_label',
    description: 'username',
  },
  username_text: {
    defaultMessage: 'type your username here',
    id: 'view.cisco.configs.from_username_text',
    description: 'username',
  },
  password_label: {
    defaultMessage: 'password',
    id: 'view.cisco.configs.from_password_label',
    description: 'password',
  },
  password_text: {
    defaultMessage: 'type your password here',
    id: 'view.cisco.configs.from_password_text',
    description: 'password',
  },
  submit_abel: {
    defaultMessage: 'Save',
    id: 'view.cisco.configs.from_submit_abel',
    description: 'save',
  },
  cisco_rooms_button: {
    defaultMessage: 'Return to meeting list',
    id: 'view.cisco.configs.cisco_rooms_button',
    description: 'Return to meeting list',
  },
});

export function CiscooConfigs() {
  const intl = useTranslations();
  const router = useRouting();
  const { id } = useParams();

  const { data, isLoading, status, isFetching, refetch } = useQuery(
    [MagnifyQueryKeys.CISCO_ROOM_CONFIGS],
    () => CiscoCoSpaceRepository.get(id || ""),
    {
      enabled: KeycloakService.isLoggedIn(),
      refetchOnMount: true
    },
  );
  const queryClient = useQueryClient();

  return (
    <>
      <Box align={'end'} direction={'column'} height={{ min: 'auto' }} justify={'end'}>
        <Button color="secondary" onClick={() => router.goToCiscoRoomsList()} size={'small'}>
          {intl.formatMessage(messages.cisco_rooms_button)}
        </Button>
      </Box>
      <Box align={'center'} direction={'column'} height={{ min: 'auto' }} justify={'center'}>
        {!isLoading && status == 'success' && (
          <Heading color={'brand'} level={1} margin="none" textAlign={'center'}>
            {data.name}
          </Heading>
        )}
        {isLoading && (
          <Box align={'center'} direction={'column'} height={{ min: 'auto' }} justify={'center'}>
            <Spinner />
          </Box>
        )}
      </Box>
      <Box align={'start'} direction={'row'} height={{ min: 'auto' }} justify={'start'} margin={{ top: "xlarge" }}>
        <Box align={'start'} direction={'column'} height={{ min: 'auto' }} justify={'start'} margin={{ left: "small" }} width={{ min: "50%" }}>
          {data?.role !== "member" && (
            <CiscoRoomSecurityConfig room={data} isFetching={isFetching} refetch={refetch} status={status} />
          )}

          {isLoading ? (
            <Box align={'center'} direction={'column'} height={{ min: 'auto' }} justify={'center'}>
              <Spinner />
            </Box>
          ) : (
            <CiscoRoomUsersConfig
              addUser={() => { }}
              onUpdateUser={() => { }}
              onDeleteUser={() => { }}
              room={data}
            />
          )}

        </Box>
        { false && (
          <Box align={'start'} background="white" direction={'column'} height={{ min: 'auto' }} justify={'stretch'} margin={{ right: "small" }} pad="large" width={{ min: "50%" }}>
            {!isFetching && status == 'success' && (
              <List
                margin="none"
                primaryKey="name"
                secondaryKey={(item: { name: string, value: any }) => (<Text>
                  {
                    typeof item.value == "boolean"
                      ? <>
                        {item.value == true ? <StatusGood /> : <StatusCritical />}
                      </>
                      : <>{item.value}</>
                  }
                </Text>)}
                data={
                  Object
                    .entries(data)
                    .map(([key, value]) => (
                      { name: key.replaceAll("_", " "), value: value }
                    ))
                    .filter(e => {
                      if(e.name.includes('owner') && data?.role === "member")
                        return false
                      return true
                    })

                }
              />
            )}
            {isFetching && (
              <Box align={'center'} direction={'column'} height={{ min: 'auto' }} justify={'center'}>
                <Spinner />
              </Box>
            )}

          </Box>
        )}
      </Box>


    </>
  );
}
