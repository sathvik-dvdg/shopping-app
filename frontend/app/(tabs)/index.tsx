// frontend/app/(tabs)/index.
import React, { useEffect, useState, useContext } from 'react';
import { View, FlatList, ActivityIndicator, StyleSheet, Text, RefreshControl } from 'react-native';
import { apiClient } from '../../src/api/client';
import ProductCard from '../../src/components/ProductCard';
import { CartContext } from '../../src/context/CartContext';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const cart = useContext(CartContext);

  const fetchProducts = async () => {
    try {
      // Your backend serves products on the root route "/"
      const response = await apiClient.get('/products');
      if (response.data.success) {
        setProducts(response.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchProducts();
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  if (products.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={styles.emptyText}>No products available right now.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={products}
        keyExtractor={(item: any) => String(item._id)}
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            onAddToCart={() => cart?.addToCart(item)}
          />
        )}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  list: { padding: 15 },
  emptyText: { fontSize: 16, color: '#666' }
});