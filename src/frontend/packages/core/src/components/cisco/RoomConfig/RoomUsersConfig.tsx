import { Button } from '@openfun/cunningham-react';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { RoomAccessRole, RoomUser, User } from '../../../types';
import { useMagnifyModal } from '../../design-system/Modal';
import { useAuthContext } from '../../../context';
import { SelectOption } from '../../../types/misc';
import { commonRoomMessages } from '../../../i18n/Messages/Room/commonRoomMessages';
import { MagnifyCard } from '../../design-system';
import MagnifyList from '../../design-system/List/MagnifyList';
import { UserSearchModal } from '../../users';
import { Box } from 'grommet';
import { CoSpaceInterface, CoSpaceUserAccesses, PostCoSpaceUserAccesses } from '../../../types/entities/cisco/room';
import { CiscoRoomUsersConfigRow } from './RoomUsersConfigRow';
import { useMutation, useQuery } from '@tanstack/react-query';
import { MagnifyQueryKeys } from '../../../utils';
import CiscoCospaceRolesRepository from '../../../services/cisco/cospaceroles.repository';
import { KeycloakService } from '../../../services';
import { AxiosError } from 'axios';

const roomConfigUserMessages = defineMessages({
  sectionTitle: {
    defaultMessage: 'Members',
    description: 'Ttitle for the members section ',
    id: 'components.rooms.config.users.sectionTitle',
  },
  addMember: {
    defaultMessage: 'Add a member',
    description: 'Text for the add member button',
    id: 'components.rooms.config.users.addMember',
  },
});

export interface CiscoRoomUsersConfigProps {
  addUser: (user: User) => void;
  onUpdateUser: (role: RoomAccessRole, userId: string, accessId: string) => void;
  onDeleteUser: (accessId: string) => void;
  room: CoSpaceInterface;
}

export const CiscoRoomUsersConfig = ({ room, ...props }: CiscoRoomUsersConfigProps) => {
  const intl = useIntl();
  const addUserModal = useMagnifyModal();
  const authContext = useAuthContext();
  const [currentUserRole, setCurrentUserRole] = useState<string>('owner');
  const [numberOfOwner, setNumberOfOwner] = useState(0);
  const [users, setUsers] = useState<CoSpaceUserAccesses[]>([])
  const getAllQuery = useQuery(
    [MagnifyQueryKeys.CISCO_ROOM_ROLES],
    () => CiscoCospaceRolesRepository.getAll(room.cisco_id),
    {
      enabled: KeycloakService.isLoggedIn(),
      refetchOnMount: true,
      onSuccess: (data) => {
        setUsers(data)
      },
    },
  );


  useEffect(() => {
    let numberOfOwner = 0;
    getAllQuery.data?.forEach((access) => {
      if (access.role === RoomAccessRole.OWNER) {
        numberOfOwner++;
      }
      if (access.user.id === authContext.user?.id) {
        setCurrentUserRole(access.role);
      }
    });
    setNumberOfOwner(numberOfOwner);
  }, [getAllQuery.data]);

  const createMutation = useMutation<Object, AxiosError, Object>(
    async (data) => {
      return await CiscoCospaceRolesRepository.create(data)
    },
    { onSuccess: getAllQuery.refetch }
  );

  const updateMutation = useMutation<Object, AxiosError, PostCoSpaceUserAccesses>(
    async (data: PostCoSpaceUserAccesses) => {
      return await CiscoCospaceRolesRepository.update(data.id, data)
    },
    { onSuccess: getAllQuery.refetch }
  );

  const deleteMutation = useMutation<Object, AxiosError, string>(
    async (roleId: string) => {
      return await CiscoCospaceRolesRepository.delete(roleId)
    },
    { onSuccess: getAllQuery.refetch }
  );

  const onSelectUser = (user?: User): void => {
    addUserModal.closeModal();
    if (!user) {
      return;
    }
    const accessRole = {
      user: user.id,
      cospace_cisco_id: room.cisco_id,
      role: RoomAccessRole.MEMBER
    }
    createMutation.mutate(accessRole)
    props.addUser(user);
  };

  const updateRole = (newRole: RoomAccessRole, userId: string, accessId: string): void => {
    const accessRole = {
      id: accessId,
      user: userId,
      cospace_cisco_id: room.cisco_id,
      role: newRole
    }
    updateMutation.mutate(accessRole)
    props.onUpdateUser(newRole, userId, accessId);
  };

  const getAvailableOptions = (user: RoomUser, userRole: RoomAccessRole): SelectOption[] => {
    const isCurrentUSer = user.id === authContext.user?.id;
    const currentUserIsOwner = currentUserRole === RoomAccessRole.OWNER;
    const isOwner = userRole === RoomAccessRole.OWNER;
    const isLastUser = getAllQuery.data?.length === 1;
    const isLastOwner = isOwner && numberOfOwner === 1;

    return [
      {
        value: RoomAccessRole.OWNER,
        label: intl.formatMessage(commonRoomMessages.role_owner),
        disabled:
          (isCurrentUSer && !currentUserIsOwner) ||
          (!isCurrentUSer && isOwner) ||
          isLastUser ||
          isLastOwner,
      },
      {
        value: RoomAccessRole.ADMINISTRATOR,
        label: intl.formatMessage(commonRoomMessages.role_administrator),
        disabled: (!isCurrentUSer && isOwner) || isLastUser || isLastOwner,
      },
      {
        value: RoomAccessRole.MEMBER,
        label: intl.formatMessage(commonRoomMessages.role_member),
        disabled: (!isCurrentUSer && isOwner) || isLastUser || isLastOwner,
      },
    ];
  };

  return (
    <Box pad={{ bottom: "medium" }}>
      <MagnifyCard
        gapContent="medium"
        title={intl.formatMessage(roomConfigUserMessages.sectionTitle)}
        actions={
          <>
            {room.role !== "member" && (
              <Button color="primary" onClick={addUserModal.openModal} size="small">
                {intl.formatMessage(roomConfigUserMessages.addMember)}
              </Button>
            )}
          </>
        }
        width={{ min: "30vw" }}
      >
        {getAllQuery.isFetching ? (
          <></>
        ) : (
          <MagnifyList
            rows={users}
            Row={(rowProps) => (
              <CiscoRoomUsersConfigRow
                {...rowProps}
                canUpdate={['owner', 'administrator'].includes(currentUserRole)}
                options={getAvailableOptions(rowProps.item.user, rowProps.item.role)}
                role={rowProps.item.role}
                user={rowProps.item.user}
                onDelete={() => {
                  deleteMutation.mutate(rowProps.item.id);
                }}
                onUpdateRole={(newRole: RoomAccessRole) =>
                  updateRole(newRole, rowProps.item.user.id, rowProps.item.id)
                }
              />
            )}
          />

        )}
      </MagnifyCard>

      <UserSearchModal
        {...addUserModal}
        modalUniqueId={'add-room-user'}
        onSelectUser={onSelectUser}
      />
    </Box>
  );
};
