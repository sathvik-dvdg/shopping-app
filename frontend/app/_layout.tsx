// app/_layout.tsx
import { useEffect, useContext } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { AuthProvider, AuthContext } from '../src/context/AuthContext';
import { CartProvider } from '../src/context/CartContext';

function RootLayoutNav() {
  const authContext = useContext(AuthContext);
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!authContext || authContext.isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!authContext.user && !inAuthGroup) {
      router.replace('/(auth)/login');
    } else if (authContext.user && inAuthGroup) {
      router.replace('/(tabs)');
    }
  }, [authContext?.user, authContext?.isLoading, segments]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <CartProvider>
        <RootLayoutNav />
      </CartProvider>
    </AuthProvider>
  );
}