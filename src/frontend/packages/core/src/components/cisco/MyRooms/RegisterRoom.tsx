import { Button } from '@openfun/cunningham-react';
import { Box, Layer } from 'grommet';
import React, { useState } from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { CunninghamIcon } from '../../design-system/Icon/CunninghamIcon';
import { CiscoRegisterRoomForm } from './RegisterRoomForm';
import { CoSpaceInterface } from '../../../types/entities/cisco/room';

const messages = defineMessages({
  registerNewRoomLabel: {
    id: 'components.rooms.registerRoom.registerNewRoomLabel',
    defaultMessage: 'Register new room',
    description: 'Label for the button to register a new room',
  },
  addNewRoomLabel: {
    id: 'components.rooms.registerRoom.addNewRoomLabel',
    defaultMessage: 'Room',
    description: 'Label for the button to register a new room',
  },
});

export interface RegisterRoomProps {
  onAddRoom?: (room: CoSpaceInterface | undefined) => void;
}

export const CiscoRegisterRoom = ({ ...props }: RegisterRoomProps) => {
  const intl = useIntl();
  const [open, setOpen] = useState(false);

  const handleOpen = (event: React.MouseEvent) => {
    event.preventDefault();
    setOpen(true);
  };

  const handleClose = (event?: React.MouseEvent | React.KeyboardEvent) => {
    event?.preventDefault();
    setOpen(false);
  };

  const onAddSuccess = (room?: CoSpaceInterface): void => {
    if (props.onAddRoom) {
      props.onAddRoom(room);
    }
    handleClose();
  };

  return (
    <>
      <Button color="primary" icon={<CunninghamIcon iconName="add" />} onClick={handleOpen}>
        {intl.formatMessage(messages.addNewRoomLabel)}
      </Button>
      {open && (
        <Layer
          id="confirmDelete"
          onClickOutside={handleClose}
          onEsc={handleClose}
          position="center"
          role="dialog"
        >
          <Box pad="medium" width={'medium'}>
            <CiscoRegisterRoomForm onSuccess={onAddSuccess} />
          </Box>
        </Layer>
      )}
    </>
  );
};
