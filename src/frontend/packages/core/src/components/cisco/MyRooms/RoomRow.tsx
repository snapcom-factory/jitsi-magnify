import { defineMessages } from '@formatjs/intl';
import { Button } from '@openfun/cunningham-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Box, Button as GrommetButton, ButtonExtendedProps, Card, DropButton, List, Menu, Notification, Spinner, Text } from 'grommet';
import { CircleInformation, Configure, FormTrash, Link, MoreVertical } from 'grommet-icons';
import React from 'react';
import { useIntl } from 'react-intl';
import { useModal } from '../../../context/modals';
import { useRouting } from '../../../context/routing';
import { useIsSmallSize } from '../../../hooks/useIsMobile';
import { commonMessages } from '../../../i18n/Messages/commonMessages';
import { MagnifyQueryKeys } from '../../../utils/constants/react-query';
import { MagnifyModalTypes } from '../../design-system/Modal';
import { CoSpaceInterface } from '../../../types/entities/cisco/room';
import CiscoCoSpaceRepository from '../../../services/cisco/cospaces.repository';
import { useNotification } from '../../../context';

export interface CiscoRoomRowProps {
  room: CoSpaceInterface;
}

const messages = defineMessages({
  admin: {
    id: 'components.rooms.RoomRow.admin',
    defaultMessage: 'Admin',
    description: 'Indicates that the user is an admin of the room',
  },
  join: {
    id: 'components.rooms.RoomRow.join',
    defaultMessage: 'Join',
    description: 'Join the room',
  },
  warningDelete: {
    id: 'components.ciscorooms.RoomRow.warningDelete',
    defaultMessage:
      'Are you sure you want to delete this room?',
    description: 'Waning message for a delete action',
  },
  deleteModalTitle: {
    id: 'components.rooms.RoomRow.deleteModalTitle',
    defaultMessage: 'Deleting a room',
    description: 'Title modal for delete action',
  },
  copyRoomLink: {
    id: 'components.rooms.RoomRow.copyRoomLink',
    defaultMessage: 'Copy link',
    description: 'Copy room link to the clipboard',
  },
  roomLinkWasCopied: {
    id: 'components.rooms.RoomRow.roomLinkWasCopied',
    defaultMessage: 'Room link copied to clipboard!',
    description: 'The link of the room was successfully copied',
  },
});

const CiscoRoomLinks = ({ room }: CiscoRoomRowProps) => {
  const intl = useIntl();
  const notification = useNotification();

  const copyLinkToClipboard = (lnk: string | undefined): void => {
    navigator.clipboard.writeText(lnk || "").then(
      () => {
        notification.showNotification({
          status: 'info',
          title: intl.formatMessage(messages.roomLinkWasCopied),
        });
      },
      () => {},
    );
  };

  return (
    <>
      <List
        margin="none"
        primaryKey="name"
        secondaryKey="value"
        style={{whiteSpace: "nowrap"}}
        data={
          [
            ...(
              room.role && ['owner', 'administrator'].includes(room.role) 
              ? [{
                name: "Rejoindre depuis le web en tant qu'organisateur:",
                value: (
                  <GrommetButton
                    plain
                    onClick={() => copyLinkToClipboard(room.owner_url)}
                  >
                    {room.owner_url} <Link size='small'/>
                  </GrommetButton>
                )
              }]
              : []
            ),
            {
              name: "Rejoindre depuis le web en tant qu'invité:",
              value: (
                <GrommetButton
                  plain
                  onClick={() => copyLinkToClipboard(room.guest_url)}
                >
                  {room.guest_url} <Link size='small'/>
                </GrommetButton>
              )
            },
            {
              name: "Rejoindre depuis un terminal de visioconférence SIP:",
              value: (
                <GrommetButton
                  plain
                  onClick={() => copyLinkToClipboard(room.sip_url)}
                >
                  {room.sip_url} <Link size='small'/>
                </GrommetButton>)
            },
          ]
        }
      />
    </>
  )
}
export const CiscoRoomRow = ({ room }: CiscoRoomRowProps) => {
  const intl = useIntl();
  const routing = useRouting();

  const isSmallSize = useIsSmallSize();
  const modals = useModal();
  const queryClient = useQueryClient();

  const { mutate, isLoading } = useMutation(
    async (roomId: string) => {
      return await CiscoCoSpaceRepository.delete(roomId);
    },
    {
      onSuccess: () => {
        queryClient.setQueryData([MagnifyQueryKeys.CISCO_ROOMS], (rooms: CoSpaceInterface[] = []) => {
          const newRooms = [...rooms];
          const index = newRooms.findIndex((roomItem) => {
            return roomItem.call_id === room.call_id;
          });

          if (index >= 0) {
            newRooms.splice(index, 1);
          }
          return newRooms;
        });
      },
    },
  );

  const openDeleteModal = () => {
    modals.showModal({
      modalUniqueId: 'deleteRoomModal',
      type: MagnifyModalTypes.WARNING,
      validateButtonColor: 'accent-1',
      validateButtonCallback: () => mutate(room.cisco_id),
      validateButtonLabel: intl.formatMessage(commonMessages.delete),
      titleModal: intl.formatMessage(messages.deleteModalTitle),
      children: (
        <Notification message={intl.formatMessage(messages.warningDelete)} status={'info'} />
      ),
    });
  };

  const getMoreActionsItems = (): ButtonExtendedProps[] => {
    let result: ButtonExtendedProps[] = [
      {
        icon: (
          <Box alignSelf={'center'}>
            <Configure size={'14px'} />
          </Box>
        ),
        label: (
          <Box alignSelf={'center'} margin={{ left: 'xsmall' }}>
            {intl.formatMessage(commonMessages.settings)}
          </Box>
        ),
        onClick: () => routing.goToCiscoRoomSettings(room.cisco_id),
      },
    ];

    if (room.role && ['owner', 'administrator'].includes(room.role)) {
      const settingsButtonProps: ButtonExtendedProps = {
        icon: <FormTrash />,
        label: (
          <Box alignSelf={'center'} margin={{ left: 'xsmall' }}>
            {intl.formatMessage(commonMessages.delete)}
          </Box>
        ),
        onClick: openDeleteModal,
      };
      result = result.concat([settingsButtonProps]);
    }

    return result;
  };

  return (
    <Card background="light-2" elevation="0" pad="xsmall" style={{ position: 'relative' }}>
      {isLoading && (
        <Box
          align={'center'}
          background={'#ffffff8c'}
          justify={'center'}
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
        >
          <Spinner />
        </Box>
      )}
      <Box
        align={'center'}
        direction={isSmallSize ? 'column' : 'row'}
        gap={'20px'}
        justify={isSmallSize ? 'center' : 'between'}
      >
        <Box direction="row" gap="small" margin="auto 0px">
          <DropButton
            icon={<CircleInformation />}
            margin="xxsmall"
            focusIndicator={false}
            dropContent={
              <Box pad="large" background="white">
                <CiscoRoomLinks room={room} />
              </Box>
            }
          />          

          <Box direction="row" margin="auto 0px">
            <Text color="brand" size="medium" truncate={'tip'} weight="bold">
              {room.name}
            </Text>
          </Box>
        </Box>

        <Box align={'center'} direction="row">
          <Box margin={{ left: 'small' }} />
          {(room.role && ['owner', 'administrator'].includes(room.role)) ? (
            <>
              {room.owner_url &&
                <Button color="primary" onClick={() => window.open(room.owner_url, '_blank')} size="small">
                  {intl.formatMessage(messages.join)}
                </Button>
              }            
            </>
          ) : (
            <>
              {room.guest_url && (
                <Button color="primary" onClick={() => window.open(room.guest_url, '_blank')} size="small">
                  {intl.formatMessage(messages.join)}
                </Button>
              )}
            </>
          )}
          <Menu
            dropProps={{ stretch: false, align: { top: 'bottom', right: 'right' } }}
            icon={<MoreVertical size={'medium'} />}
            items={[getMoreActionsItems()]}
            justifyContent={'center'}
          />
        </Box>
      </Box>
    </Card>
  );
};