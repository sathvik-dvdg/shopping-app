import React, { useEffect, useState, useContext } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator, Button, ScrollView, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { apiClient } from '../../src/api/client';
import { CartContext } from '../../src/context/CartContext';
import { Product } from '../../src/hooks/useProducts';

export default function ProductDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const cartContext = useContext(CartContext);
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await apiClient.get(`/products/${id}`);
        setProduct(response.data.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error || !product) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error || 'Product not found'}</Text>
        <Button title="Go Back" onPress={() => router.back()} />
      </View>
    );
  }

  const handleAddToCart = () => {
    if (product.stock <= 0) {
      Alert.alert('Out of Stock', 'This item is currently unavailable.');
      return;
    }
    cartContext?.addToCart(product);
    Alert.alert('Success', 'Added to cart');
  };

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: product.image }} style={styles.image} resizeMode="cover" />
      <View style={styles.infoContainer}>
        <Text style={styles.title}>{product.name}</Text>
        <Text style={styles.price}>${product.price.toFixed(2)}</Text>
        
        <View style={styles.badge}>
           <Text style={styles.badgeText}>{product.category}</Text>
        </View>

        <Text style={styles.stock}>
          {product.stock > 0 ? `In Stock: ${product.stock}` : 'Out of Stock'}
        </Text>
        
        <Text style={styles.description}>{product.description}</Text>
        
        <View style={styles.buttonContainer}>
          <Button 
            title={product.stock > 0 ? "Add to Cart" : "Out of Stock"} 
            onPress={handleAddToCart}
            disabled={product.stock <= 0}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  image: { width: '100%', height: 300 },
  infoContainer: { padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 8 },
  price: { fontSize: 22, color: '#2ecc71', fontWeight: '600', marginBottom: 12 },
  badge: { alignSelf: 'flex-start', backgroundColor: '#e0e0e0', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4, marginBottom: 12 },
  badgeText: { fontSize: 12, color: '#333' },
  stock: { fontSize: 16, marginBottom: 16, color: '#555' },
  description: { fontSize: 16, lineHeight: 24, color: '#666', marginBottom: 24 },
  buttonContainer: { marginTop: 10 },
  errorText: { color: 'red', fontSize: 16, marginBottom: 16 }
});