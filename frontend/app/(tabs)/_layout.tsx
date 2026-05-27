import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: '#000', headerShown: true }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Shop',
        }}
      />
    </Tabs>
  );
}