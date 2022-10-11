import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Grommet } from 'grommet';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { MessageFormatElement } from 'react-intl';
import {
  AuthContextProvider,
  ModalContextProvider,
  NotificationContextProvider,
} from '../../../context';
import { ControllerProvider, LogController } from '../../../controller';
import { loadLocaleData, TranslationProvider } from '../../../i18n';
import { FormErrors } from '../../../i18n/FormErrors';
import { AuthMiddleware } from '../../../middleware';
import { defaultTheme } from '../../../themes';
import { User } from '../../../types/entities/user';
import { Maybe } from '../../../types/misc';

async function getTranslation(
  locale: string,
): Promise<Maybe<Record<string, string> | Record<string, MessageFormatElement[]>>> {
  let translatedMessages: Maybe<Record<string, string> | Record<string, MessageFormatElement[]>>;
  try {
    translatedMessages = await loadLocaleData(locale);
  } catch (error) {
    translatedMessages = {};
  }
  return translatedMessages;
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 0,
      retryOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
    },
  },
});

export interface MagnifyProviderProps {
  children?: React.ReactNode;
  initialUser?: User;
  translations?: any;
}

const locale = 'en-US';
const controller = new LogController(process.env.REACT_APP_TEST_TOKEN as string);

export function MagnifyProvider({ ...props }: MagnifyProviderProps) {
  const [translations, setTranslations] = useState<
    Maybe<Record<string, string> | Record<string, MessageFormatElement[]>>
  >({});

  useEffect(() => {
    getTranslation(locale).then((initTranslation) => {
      setTranslations(initTranslation);
    });
  }, []);

  return (
    <TranslationProvider defaultLocale="en-US" locale={locale} messages={translations || {}}>
      <FormErrors />
      <Grommet full theme={defaultTheme}>
        <QueryClientProvider client={queryClient}>
          <ReactQueryDevtools initialIsOpen={false} />
          <AuthContextProvider initialUser={props.initialUser}>
            <AuthMiddleware>
              <ControllerProvider controller={controller}>
                <NotificationContextProvider>
                  <ModalContextProvider>{props.children}</ModalContextProvider>
                </NotificationContextProvider>
              </ControllerProvider>
            </AuthMiddleware>
          </AuthContextProvider>
        </QueryClientProvider>
      </Grommet>
    </TranslationProvider>
  );
}