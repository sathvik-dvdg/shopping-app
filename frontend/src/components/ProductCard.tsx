import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Product } from '../hooks/useProducts';

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const router = useRouter();

  return (
    <TouchableOpacity 
      style={styles.card} 
      onPress={() => router.push({ pathname: '/product/[id]', params: { id: product._id } })}
    >
      <Image source={{ uri: product.image }} style={styles.image} resizeMode="cover" />
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={2}>{product.name}</Text>
        <Text style={styles.price}>${product.price.toFixed(2)}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { 
    flex: 1, 
    margin: 8, 
    backgroundColor: '#fff', 
    borderRadius: 8, 
    overflow: 'hidden', 
    elevation: 2, 
    shadowColor: '#000', 
    shadowOpacity: 0.1, 
    shadowRadius: 4, 
    shadowOffset: { width: 0, height: 2 } 
  },
  image: { width: '100%', height: 150 },
  info: { padding: 12 },
  name: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
  price: { fontSize: 14, color: '#2ecc71', fontWeight: 'bold' }
});