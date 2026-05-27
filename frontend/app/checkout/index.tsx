import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, Button, ScrollView, TextInput, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { CartContext } from '../../src/context/CartContext';

export default function CheckoutScreen() {
  const cartContext = useContext(CartContext);
  const router = useRouter();
  
  const [address, setAddress] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!cartContext || cartContext.cartItems.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>No items to checkout.</Text>
        <Button title="Go Back" onPress={() => router.back()} />
      </View>
    );
  }

  const handlePaymentSimulation = () => {
    if (!address.trim()) {
      Alert.alert('Validation Error', 'Please enter a shipping address.');
      return;
    }

    setIsProcessing(true);

    // Simulate network delay for payment processing
    setTimeout(() => {
      setIsProcessing(false);
      Alert.alert(
        'Order Placed!',
        'This is a simulation. No real order was saved to the database.',
        [
          { 
            text: 'OK', 
            onPress: () => {
              cartContext.clearCart();
              router.replace('/(tabs)');
            } 
          }
        ]
      );
    }, 1500);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Order Summary</Text>
      
      <View style={styles.summaryCard}>
        {cartContext.cartItems.map((item) => (
          <View key={item.product._id} style={styles.itemRow}>
            <Text style={styles.itemName} numberOfLines={1}>
              {item.quantity}x {item.product.name}
            </Text>
            <Text style={styles.itemPrice}>
              ${(item.product.price * item.quantity).toFixed(2)}
            </Text>
          </View>
        ))}
        
        <View style={styles.divider} />
        
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total to Pay:</Text>
          <Text style={styles.totalValue}>${cartContext.totalPrice.toFixed(2)}</Text>
        </View>
      </View>

      <Text style={styles.header}>Shipping Details</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter full shipping address"
        value={address}
        onChangeText={setAddress}
        multiline
        numberOfLines={3}
      />

      <View style={styles.buttonContainer}>
        {isProcessing ? (
          <ActivityIndicator size="large" color="#2ecc71" />
        ) : (
          <Button 
            title="Simulate Payment" 
            color="#2ecc71" 
            onPress={handlePaymentSimulation} 
          />
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 20 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  errorText: { fontSize: 16, marginBottom: 20 },
  header: { fontSize: 20, fontWeight: 'bold', marginTop: 10, marginBottom: 15, color: '#333' },
  summaryCard: { backgroundColor: '#fff', padding: 15, borderRadius: 8, marginBottom: 20, elevation: 2, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 3, shadowOffset: { width: 0, height: 1 } },
  itemRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  itemName: { flex: 1, fontSize: 16, color: '#555', paddingRight: 10 },
  itemPrice: { fontSize: 16, fontWeight: '600' },
  divider: { height: 1, backgroundColor: '#eee', marginVertical: 10 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  totalLabel: { fontSize: 18, fontWeight: 'bold' },
  totalValue: { fontSize: 20, fontWeight: 'bold', color: '#2ecc71' },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 15, fontSize: 16, textAlignVertical: 'top', marginBottom: 20 },
  buttonContainer: { marginTop: 10, marginBottom: 40 }
});