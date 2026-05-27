import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

interface ProductCardProps {
  product: any;
  onAddToCart: () => void;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  // Force price to be a number, fallback to 0 if missing/corrupt
  const safePrice = Number(product?.price) || 0;
  // Fallback image if URI is missing
  const safeImage = product?.image || 'https://via.placeholder.com/200';

  return (
    <View style={styles.card}>
      <Image source={{ uri: safeImage }} style={styles.image} resizeMode="cover" />
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>{product?.name || 'Unknown Product'}</Text>
        <Text style={styles.price}>${safePrice.toFixed(2)}</Text>
        
        <TouchableOpacity 
          style={[styles.button, (!product?.isAvailable || product?.stock === 0) && styles.buttonDisabled]} 
          onPress={onAddToCart}
          disabled={!product?.isAvailable || product?.stock === 0}
        >
          <Text style={styles.buttonText}>
            {product?.isAvailable && product?.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#fff', borderRadius: 8, marginBottom: 15, overflow: 'hidden', elevation: 2 },
  image: { width: '100%', height: 200 },
  info: { padding: 15 },
  title: { fontSize: 18, fontWeight: '600', marginBottom: 5 },
  price: { fontSize: 16, color: '#666', marginBottom: 15 },
  button: { backgroundColor: '#000', padding: 12, borderRadius: 6, alignItems: 'center' },
  buttonDisabled: { backgroundColor: '#ccc' },
  buttonText: { color: '#fff', fontWeight: 'bold' },
});