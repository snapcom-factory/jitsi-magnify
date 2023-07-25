import { Button } from '@openfun/cunningham-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { Form, Formik } from 'formik';
import { Box, Heading } from 'grommet';
import * as React from 'react';
import { defineMessages } from 'react-intl';
import { FormikInput } from '../../../components/design-system/Formik/Input';
import { FormikSubmitButton } from '../../../components/design-system/Formik/SubmitButton/FormikSubmitButton';
import { useRouting } from '../../../context';
import { useTranslations } from '../../../i18n';
import { KeycloakService } from '../../../services';
import { CiscoApiCredentialRepository } from '../../../services/cisco';
import { MagnifyQueryKeys } from '../../../utils';

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

  const { data, isLoading, status } = useQuery(
    [MagnifyQueryKeys.CISCO_CONFIGS],
    CiscoApiCredentialRepository.get,
    {
      enabled: KeycloakService.isLoggedIn(),
    },
  );
  const queryClient = useQueryClient();

  const mutation = useMutation<Object, AxiosError, Object>(CiscoApiCredentialRepository.update, {
    onSuccess: (newCredentials) => {
      queryClient.setQueryData([MagnifyQueryKeys.CISCO_CONFIGS], () => {
        return newCredentials;
      });
      //   onSuccess(newCredentials);
    },
  });

  const handleSubmit = (values: Object) => {
    mutation.mutate(values, {
      onError: (error) => {
        console.log(error);
      },
    });
  };

  return (
    <>
      <Box align={'end'} direction={'column'} height={{ min: 'auto' }} justify={'end'}>
        <Button color="secondary" onClick={() => router.goToCiscoRoomsList()} size={'small'}>
          {intl.formatMessage(messages.cisco_rooms_button)}
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
      {!isLoading && status == 'success' && (
        <Formik initialValues={data ? data : {}} onSubmit={handleSubmit}>
          <Form>
            <FormikInput
              {...{ autoFocus: true }}
              fullWidth
              label={intl.formatMessage(messages.username_label)}
              name="username"
              text={intl.formatMessage(messages.username_text)}
            />
            <FormikInput
              {...{ autoFocus: true }}
              fullWidth
              label={intl.formatMessage(messages.password_label)}
              name="password"
              text={intl.formatMessage(messages.password_text)}
            />
            <FormikSubmitButton
              isLoading={mutation.isLoading}
              label={intl.formatMessage(messages.submit_abel)}
            />
          </Form>
        </Formik>
      )}
      {/* <MyRooms baseJitsiUrl={'/j'} isLoading={isLoading} rooms={rooms ?? []} /> */}
    </>
  );
}
