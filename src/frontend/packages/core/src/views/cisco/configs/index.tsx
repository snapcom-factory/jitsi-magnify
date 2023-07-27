import { Button } from '@openfun/cunningham-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
// import { Form, Formik } from 'formik';
import { Box, Heading, List, Spinner, Text } from 'grommet';
import * as React from 'react';
import { defineMessages } from 'react-intl';
// import { FormikInput } from '../../../components/design-system/Formik/Input';
// import { FormikSubmitButton } from '../../../components/design-system/Formik/SubmitButton/FormikSubmitButton';
import { useRouting } from '../../../context';
import { useTranslations } from '../../../i18n';
import { KeycloakService } from '../../../services';
import { CiscoApiCredentialRepository } from '../../../services/cisco';
import { MagnifyQueryKeys } from '../../../utils';
import { useParams } from 'react-router-dom';
import CiscoCoSpaceRepository from '../../../services/cisco/cospaces.repository';
import { StatusCritical, StatusGood } from 'grommet-icons';

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

  const { data, isLoading, status, isFetching } = useQuery(
    [MagnifyQueryKeys.CISCO_ROOM_CONFIGS],
    () => CiscoCoSpaceRepository.get(id || ""),
    {
      enabled: KeycloakService.isLoggedIn(),
      refetchOnMount: true
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
      {isFetching && (
        <Box align={'center'} direction={'column'} height={{ min: 'auto' }} justify={'center'}>
          <Spinner />
        </Box>
      )}
      {!isFetching && status == 'success' && (
        <>
          <Box align={'end'} direction={'column'} height={{ min: 'auto' }} justify={'end'}>
            <Button color="secondary" onClick={() => router.goToCiscoRoomsList()} size={'small'}>
              {intl.formatMessage(messages.cisco_rooms_button)}
            </Button>
          </Box>
          <Box align={'center'} direction={'column'} height={{ min: 'auto' }} justify={'center'}>
            <Heading color={'brand'} level={1} margin="none" textAlign={'center'}>
              {data.name}
            </Heading>
          </Box>
          <Box align={'start'} direction={'row'} height={{ min: 'auto' }} justify={'start'} margin={{top: "xlarge"}}>
            <Box align={'start'} background="white" direction={'column'} height={{ min: 'auto' }} justify={'stretch'} margin={{right: "small"}} pad="large" width={{min: "50%"}}>
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
                }
              />
            </Box>
            <Box align={'start'} direction={'column'} height={{ min: 'auto' }} justify={'start'} margin={{left: "small"}} width={{min: "50%"}}>
              TODO: Edit form and delete button
              {/*
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
              */}
            </Box>
          </Box>


        </>
      )}
    </>
  );
}
