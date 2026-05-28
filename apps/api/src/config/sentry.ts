import * as Sentry from '@sentry/react-native';

export const initSentry = () => {
  if (!__DEV__ && process.env.EXPO_PUBLIC_SENTRY_DSN) {
    Sentry.init({
      dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
      tracesSampleRate: 1.0,
    });
  }
};