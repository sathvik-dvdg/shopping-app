export default ({ config }) => {
  // Note: EAS sets APP_VARIANT to "preview" during a preview build
  const variant = process.env.APP_VARIANT || 'development';
  
  // Never use 127.0.0.1. Use your LAN IP for local testing, or the cloud URL for EAS
  let apiUrl = process.env.EXPO_PUBLIC_API_URL || 'http://10.77.102.68:5000'; 

  if (variant === 'staging' || variant === 'preview' || variant === 'production') {
    apiUrl = process.env.EXPO_PUBLIC_API_URL || 'https://shopping-cart-api-sih1.onrender.com';
  }

  // Hardcode a safety fallback in case app.json is missing the package name
  const basePackage = config.android?.package || 'com.sathvikd.shoppingapp';
  const baseBundle = config.ios?.bundleIdentifier || 'com.sathvikd.shoppingapp';

  return {
    ...config,
    name: variant === 'production' ? (config.name || 'ShoppingApp') : `${config.name || 'ShoppingApp'} (${variant})`,
    ios: {
      ...config.ios,
      bundleIdentifier: variant === 'production' ? baseBundle : `${baseBundle}.${variant}`
    },
    android: {
      ...config.android,
      package: variant === 'production' ? basePackage : `${basePackage}.${variant}`
    },
    extra: {
      ...config.extra,
      apiUrl,
      variant,
    },
    // Sentry is completely removed to prevent Gradle crashes
    plugins: [
      ...(config.plugins || []).filter(p => !p.includes('sentry'))
    ]
  };
};