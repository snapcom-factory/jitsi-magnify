import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { Form, Formik, FormikHelpers } from 'formik';
import React, { useMemo } from 'react';
import { defineMessages, useIntl } from 'react-intl';
import * as Yup from 'yup';
import { useErrors } from '../../../hooks/useErrors';
import { formLabelMessages } from '../../../i18n/Messages/formLabelMessages';
import { Maybe } from '../../../types/misc';
import { MagnifyQueryKeys } from '../../../utils/constants/react-query';
import { FormikInput } from '../../design-system/Formik/Input/FormikInput';
import { FormikSubmitButton } from '../../design-system/Formik/SubmitButton/FormikSubmitButton';
import { CoSpaceInterface } from '../../../types/entities/cisco/room';
import CiscoCoSpaceRepository from '../../../services/cisco/cospaces.repository';

const messages = defineMessages({
  namePlaceholder: {
    id: 'components.rooms.registerRoomForm.namePlaceholder',
    defaultMessage: 'Room name (ex: Interview with John)',
    description: 'Placeholder for the name field',
  },
  registerRoomDialogLabel: {
    id: 'components.rooms.registerRoomForm.registerRoomDialogLabel',
    defaultMessage: 'Register new room',
    description: 'Label for the dialog to register a new room',
  },
  registerRoomSubmitLabel: {
    id: 'components.rooms.registerRoomForm.registerRoomSubmitLabel',
    defaultMessage: 'Register room',
    description: 'Label for the submit button to register a new room',
  },
});

export interface RegisterRoomFormProps {
  /**
   * Function to call when the form is successfully submited,
   * after the request to register the room has succeeded
   */
  onSuccess: (room?: CoSpaceInterface) => void;
}

interface RegisterRoomFormValues {
  name: string;
}

interface FormErrors {
  slug?: string[];
}

export const CiscoRegisterRoomForm = ({ onSuccess }: RegisterRoomFormProps) => {
  const intl = useIntl();
  const errors = useErrors();
  const validationSchema = Yup.object().shape({ name: Yup.string().required() });
  const queryClient = useQueryClient();
  const mutation = useMutation<CoSpaceInterface, AxiosError, RegisterRoomFormValues>(CiscoCoSpaceRepository.create, {
    onSuccess: (newRoom) => {
      queryClient.setQueryData([MagnifyQueryKeys.ROOMS], (rooms: CoSpaceInterface[] = []) => {
        return [...rooms, newRoom];
      });
      onSuccess(newRoom);
    },
  });

  const initialValues: RegisterRoomFormValues = useMemo(
    () => ({
      name: '',
    }),
    [],
  );

  const handleSubmit = (
    values: RegisterRoomFormValues,
    actions: FormikHelpers<RegisterRoomFormValues>,
  ) => {
    mutation.mutate(values, {
      onError: (error) => {
        const formErrors = error?.response?.data as Maybe<FormErrors>;
        if (formErrors?.slug) {
          actions.setFieldError('name', formErrors.slug.join(','));
        } else {
          errors.onError(error);
        }
      },
    });
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      validationSchema={validationSchema}
    >
      <Form>
        <FormikInput
          {...{ autoFocus: true }}
          fullWidth
          label={intl.formatMessage(formLabelMessages.name)}
          name="name"
          text={intl.formatMessage(messages.namePlaceholder)}
        />
        <FormikSubmitButton
          isLoading={mutation.isLoading}
          label={intl.formatMessage(messages.registerRoomSubmitLabel)}
        />
      </Form>
    </Formik>
  );
};
