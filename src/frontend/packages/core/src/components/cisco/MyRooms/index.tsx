import { Button } from '@openfun/cunningham-react';
import { Box, Text } from 'grommet';
import { Spinner } from 'grommet/components';
import React from 'react';
import { defineMessages } from 'react-intl';
import { useRouting } from '../../../context';
import { useTranslations } from '../../../i18n';
import { KeycloakService } from '../../../services';
import { Room } from '../../../types/entities/room';
import { MagnifyCard } from '../../design-system';
import { MagnifyListContainer } from '../../design-system/List/MagnifyListContainer';
import { CiscoRoomRow } from './RoomRow';

export interface CoSpaceInterface {
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
  myRoomCardTitle: {
    id: 'components.rooms.myRooms.myRoomCardTitle',
    defaultMessage: 'List of rooms',
    description: 'Label for the button to register a new room',
  },
  emptyRoomListMessage: {
    id: 'components.rooms.myRooms.emptyRoomListMessage',
    defaultMessage: 'No room was created yet. Click on the button " + Room" to create one.',
    description: 'The message to display when there are no rooms.',
  },
  claim_room: {
    id: 'components.rooms.myRooms.claim_room',
    defaultMessage: 'Claiming a room',
    description: 'Claiming a room label',
  },
  refrech: {
    defaultMessage: 'Refrech list',
    id: 'view.cisco.rooms.refrech_list_button',
    description: 'Refrech list',
  },
});

export interface MyCiscoRoomsProps {
  rooms?: CoSpaceInterface[] | undefined;
  refetch: () => void;
  isLoading?: boolean;
  isError?: boolean;
}

export const MyCiscoRooms = ({ rooms = [], refetch, ...props }: MyCiscoRoomsProps) => {
  const intl = useTranslations();
  const routing = useRouting();
  const isLog = KeycloakService.isLoggedIn();

  if (!isLog) return null;

  return (
    <>
      <MagnifyCard
        // actions={<>{isLog && <RegisterRoom />}</>}
        title={`${intl.formatMessage(messages.myRoomCardTitle)} ${
          rooms?.length > 0 ? ` (${rooms?.length})` : ''
        }`}
      >
        <MagnifyListContainer pad="none">
          {isLog && (
            <>
              {props.isLoading && (
                <Box align={'center'} height={'100px'} justify={'center'}>
                  <Spinner />
                </Box>
              )}
              {props.isError && (
                <Box align={'center'} direction={'row'} justify={'center'}>
                  <Button color="secondary" onClick={refetch} size={'small'}>
                    {intl.formatMessage(messages.refrech)}
                  </Button>
                </Box>
              )}
              { rooms?.length > 0 ? (
                rooms.map((room) => {
                  return <CiscoRoomRow key={room.call_id}  room={room} />;
                })
              ) : (
                <>
                  {!props.isLoading &&
                    <Text alignSelf="center" size="small">
                      {intl.formatMessage(messages.emptyRoomListMessage)}
                    </Text>                
                  }
                </>
              )}
            </>
          )}
        </MagnifyListContainer>
      </MagnifyCard>
    </>
  );
};
