import { useState, useEffect } from 'react';
import { apiClient } from '../api/client';

export interface Product {
  _id: string;
  name: string;
  price: number;
  stock: number;
  description: string;
  image: string;
  category: string;
  rating: number;
  isAvailable: boolean;
}

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.get('/api/products');
      // The backend returns { success: true, count: X, data: [...] }
      setProducts(response.data.data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch products');
    } finally {
      setIsLoading(false);
    }
  };

  return { products, isLoading, error, refetch: fetchProducts };
};