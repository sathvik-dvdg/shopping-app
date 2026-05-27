import React, { useContext } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, Button } from 'react-native';
import { useRouter } from 'expo-router';
import { CartContext } from '../../src/context/CartContext';

export default function CartScreen() {
  const cartContext = useContext(CartContext);
  const router = useRouter();

  if (!cartContext || cartContext.cartItems.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Your cart is empty.</Text>
        <Button title="Browse Products" onPress={() => router.push('/(tabs)')} />
      </View>
    );
  }

  const { cartItems, updateQuantity, removeFromCart, totalPrice } = cartContext;

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.cartItem}>
      <Image source={{ uri: item.product.image }} style={styles.image} />
      
      <View style={styles.itemDetails}>
        <Text style={styles.itemName} numberOfLines={1}>{item.product.name}</Text>
        <Text style={styles.itemPrice}>${item.product.price.toFixed(2)}</Text>
        
        <View style={styles.quantityContainer}>
          <TouchableOpacity 
            style={styles.qtyButton} 
            onPress={() => updateQuantity(item.product._id, item.quantity - 1)}
          >
            <Text style={styles.qtyText}>-</Text>
          </TouchableOpacity>
          
          <Text style={styles.qtyValue}>{item.quantity}</Text>
          
          <TouchableOpacity 
            style={styles.qtyButton} 
            onPress={() => updateQuantity(item.product._id, item.quantity + 1)}
          >
            <Text style={styles.qtyText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity 
        style={styles.removeButton} 
        onPress={() => removeFromCart(item.product._id)}
      >
        <Text style={styles.removeText}>X</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.product._id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />
      
      <View style={styles.footer}>
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total:</Text>
          <Text style={styles.totalValue}>${totalPrice.toFixed(2)}</Text>
        </View>
        <Button 
          title="Proceed to Checkout" 
          color="#2ecc71"
          onPress={() => router.push('/checkout')} 
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  emptyText: { fontSize: 18, marginBottom: 20, color: '#666' },
  list: { padding: 10 },
  cartItem: { 
    flexDirection: 'row', 
    backgroundColor: '#fff', 
    padding: 10, 
    marginBottom: 10, 
    borderRadius: 8, 
    alignItems: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 }
  },
  image: { width: 60, height: 60, borderRadius: 4, marginRight: 15 },
  itemDetails: { flex: 1, justifyContent: 'center' },
  itemName: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
  itemPrice: { fontSize: 14, color: '#2ecc71', marginBottom: 8 },
  quantityContainer: { flexDirection: 'row', alignItems: 'center' },
  qtyButton: { backgroundColor: '#e0e0e0', width: 28, height: 28, justifyContent: 'center', alignItems: 'center', borderRadius: 4 },
  qtyText: { fontSize: 18, fontWeight: 'bold' },
  qtyValue: { marginHorizontal: 12, fontSize: 16 },
  removeButton: { padding: 10 },
  removeText: { color: '#e74c3c', fontSize: 18, fontWeight: 'bold' },
  footer: { 
    backgroundColor: '#fff', 
    padding: 20, 
    borderTopWidth: 1, 
    borderColor: '#e0e0e0',
    paddingBottom: 40 // Extra padding for iOS bottom safe area if needed
  },
  totalContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  totalLabel: { fontSize: 18, fontWeight: 'bold' },
  totalValue: { fontSize: 20, fontWeight: 'bold', color: '#2ecc71' }
});