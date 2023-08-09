import { Form, Formik } from "formik";
import { CoSpaceInterface } from "../../../types/entities/cisco/room";
import { MagnifyCard } from "../../design-system";
import { defineMessages } from "react-intl";
import { useTranslations } from "../../../i18n";
import { Box, Spinner, Text } from "grommet";
import { FormikSwitch } from "../../design-system/Formik/Switch/FormikSwitch";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { FormikInput } from "../../design-system/Formik/Input";
import { FormikSubmitButton } from "../../design-system/Formik/SubmitButton/FormikSubmitButton";
import { CiscoCoSpaceRepository } from "../../../services/cisco";

const messages = defineMessages({
    card_title: {
        defaultMessage: 'Sécurité',
        id: 'view.cisco.configs.security_form.card_title',
        description: 'Sécurité',
    },
    ask_for_secret: {
        defaultMessage: 'Demander le mot de passe',
        id: 'view.cisco.configs.security_form.ask_for_secret',
        description: 'Demander le mot de passe',
    },
    secret_label: {
        defaultMessage: 'Mot de passe de la salle',
        id: 'view.cisco.configs.security_form.secret_label',
        description: 'Mot de passe de la salle',
    },
    secret_text: {
        defaultMessage: 'Entrer un mot de passe',
        id: 'view.cisco.configs.security_form.ask_for_secret',
        description: 'Entrer un mot de passe',
    },
    submit_abel: {
        defaultMessage: 'Save',
        id: 'view.cisco.configs.from_submit_abel',
        description: 'save',
    },
});

interface CiscoRoomSecurityFormData {
    cisco_id: string,
    is_guest_ask_for_secret: boolean,
    is_owner_ask_for_secret: boolean,
    guest_secret: string,
    owner_secret: string
}
export interface CiscoRoomSecurityConfigProps {
    room: CoSpaceInterface;
    isFetching: boolean;
    refetch: () => void;
    status: "error" | "success" | "loading"
}
export const CiscoRoomSecurityConfig = ({ room, ...props }: CiscoRoomSecurityConfigProps) => {
    const intl = useTranslations();
    const extractFormData = (data: CoSpaceInterface): CiscoRoomSecurityFormData => {
        return {
            cisco_id: data.cisco_id,
            is_guest_ask_for_secret: data.is_guest_ask_for_secret || false,
            is_owner_ask_for_secret: data.is_owner_ask_for_secret || false,
            guest_secret: data.guest_secret || "",
            owner_secret: data.owner_secret|| ""
        }
    }
    const mutation = useMutation<Object, AxiosError, {cospaceId: string, owner_secret: string, guest_secret: string}>(
        CiscoCoSpaceRepository.updateSecrets, 
        {
            onSuccess: props.refetch,
        }
    );
    const handleSubmit = (values: CiscoRoomSecurityFormData) => {
        mutation.mutate({
            cospaceId: values.cisco_id,
            owner_secret: values.owner_secret,
            guest_secret: values.guest_secret,
        }, {
            onSuccess: props.refetch,
            onError: (e) => {
                console.log(e);
            }
        })
    };

    return (
        <Box pad={{ bottom: "medium" }}>
            <MagnifyCard title={intl.formatMessage(messages.card_title)} width={{ min: "25vw" }}>
                {!props.isFetching && props.status == 'success' && (
                    <Formik initialValues={extractFormData(room)} onSubmit={handleSubmit}>
                        {({
                            values
                        }) => (
                            <Form>
                                <Box align={'center'} direction={'row'} justify={'start'}>
                                    <FormikSwitch
                                        label={intl.formatMessage(messages.ask_for_secret)}
                                        name="is_owner_ask_for_secret"
                                        disabled
                                    />
                                    <Text style={{ fontStyle: "italic" }}>owner</Text>
                                </Box>
                                {values.is_owner_ask_for_secret &&
                                    <FormikInput
                                        fullWidth
                                        label={intl.formatMessage(messages.secret_label)}
                                        name="owner_secret"
                                        type='password'
                                        text={intl.formatMessage(messages.secret_text)}
                                    />
                                }

                                <Box align={'center'} direction={'row'} justify={'start'}>
                                    <FormikSwitch
                                        label={intl.formatMessage(messages.ask_for_secret)}
                                        name="is_guest_ask_for_secret"
                                        disabled
                                    />
                                    <Text style={{ fontStyle: "italic" }}>invité</Text>
                                </Box>
                                {values.is_guest_ask_for_secret &&
                                    <FormikInput
                                        fullWidth
                                        label={intl.formatMessage(messages.secret_label)}
                                        name="guest_secret"
                                        type='password'
                                        text={intl.formatMessage(messages.secret_text)}
                                    />
                                }

                                <FormikSubmitButton
                                    isLoading={false}
                                    // isLoading={mutation.isLoading}
                                    label={intl.formatMessage(messages.submit_abel)}
                                />
                            </Form>
                        )}

                    </Formik>
                )}
                {props.isFetching && (
                    <Box align={'center'} direction={'column'} height={{ min: 'auto' }} justify={'center'}>
                        <Spinner />
                    </Box>
                )}
            </MagnifyCard>
        </Box>
    )
}