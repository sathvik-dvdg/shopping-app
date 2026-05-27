import React, { useContext } from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';
import { AuthContext } from '../../src/context/AuthContext';

export default function ProfileScreen() {
  const authContext = useContext(AuthContext);

  if (!authContext?.user) {
    return (
      <View style={styles.centered}>
        <Text>Loading profile...</Text>
      </View>
    );
  }

  const handleLogout = async () => {
    Alert.alert('Logout', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { 
        text: 'Logout', 
        style: 'destructive',
        onPress: async () => {
          await authContext.logout();
          // The routing guard in _layout.tsx will automatically detect 
          // the null user state and redirect to /(auth)/login.
        }
      }
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarPlaceholder}>
          <Text style={styles.avatarText}>
            {authContext.user.name ? authContext.user.name.charAt(0).toUpperCase() : '?'}
          </Text>
        </View>
        <Text style={styles.name}>{authContext.user.name}</Text>
        <Text style={styles.role}>Role: {authContext.user.role || 'customer'}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account Details</Text>
        <Text style={styles.infoText}>User ID: {authContext.user._id}</Text>
        {/* Email is omitted because the backend does not return it in the auth payload */}
      </View>

      <View style={styles.logoutContainer}>
        <Button title="Logout" color="#e74c3c" onPress={handleLogout} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { alignItems: 'center', padding: 30, backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#eee' },
  avatarPlaceholder: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#3498db', justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
  avatarText: { fontSize: 36, color: '#fff', fontWeight: 'bold' },
  name: { fontSize: 24, fontWeight: 'bold', color: '#333' },
  role: { fontSize: 16, color: '#7f8c8d', marginTop: 5, textTransform: 'capitalize' },
  section: { backgroundColor: '#fff', padding: 20, marginTop: 20, borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#eee' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, color: '#333' },
  infoText: { fontSize: 16, color: '#555', marginBottom: 10 },
  logoutContainer: { padding: 20, marginTop: 20 }
});