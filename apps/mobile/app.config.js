export default ({ config }) => {
  const variant = process.env.APP_VARIANT || 'development';
  let apiUrl = 'http://127.0.0.1:5000'; 

  if (variant === 'staging') {
    apiUrl = process.env.EXPO_PUBLIC_API_URL || 'https://shopping-cart-api-sih1.onrender.com';
  } else if (variant === 'production') {
    // Ensure you replace this with your actual Render URL
    apiUrl = process.env.EXPO_PUBLIC_API_URL || 'https://shopping-cart-api-sih1.onrender.com';
  }

  return {
    ...config,
    name: variant === 'production' ? config.name : `${config.name} (${variant})`,
    ios: {
      ...config.ios,
      bundleIdentifier: variant === 'production' ? config.ios?.bundleIdentifier : `${config.ios?.bundleIdentifier}.${variant}`
    },
    android: {
      ...config.android,
      package: variant === 'production' ? config.android?.package : `${config.android?.package}.${variant}`
    },
    extra: {
      ...config.extra,
      apiUrl,
      variant,
    },
    plugins: [
      ...(config.plugins || []),
      "@sentry/react-native"
    ]
  };
};