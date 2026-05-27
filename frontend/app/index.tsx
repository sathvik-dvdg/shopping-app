// frontend/app/index.tsx
import { Redirect } from 'expo-router';
import { useContext } from 'react';
import { AuthContext } from '../src/context/AuthContext';
import { View, ActivityIndicator } from 'react-native';

export default function Index() {
  const auth = useContext(AuthContext);

  if (auth?.isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!auth?.user) {
    return <Redirect href="/login" />;
  }

  return <Redirect href="/(tabs)" />;
}