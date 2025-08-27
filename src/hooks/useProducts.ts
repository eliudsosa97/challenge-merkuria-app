"use client";

import { useState, useEffect, useCallback } from "react";
import { ProductsService } from "@/services/products.service";
import { Product, ProductFilters, ProductStats } from "@/lib/types";

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [statistics, setStatistics] = useState<ProductStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<ProductFilters>({});

  const fetchProducts = useCallback(
    async (currentFilters: ProductFilters = {}) => {
      try {
        setLoading(true);
        setError(null);
        const data = await ProductsService.getProducts(currentFilters);
        setProducts(data);
      } catch (err) {
        setError("Error al cargar los productos");
        console.error(err);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const fetchCategories = useCallback(async () => {
    try {
      const data = await ProductsService.getCategories();
      setCategories(data);
    } catch (err) {
      console.error("Error al cargar categorías:", err);
    }
  }, []);

  const fetchStatistics = useCallback(async () => {
    try {
      const data = await ProductsService.getStatistics();
      setStatistics(data);
    } catch (err) {
      console.error("Error al cargar estadísticas:", err);
    }
  }, []);

  const deleteProduct = async (id: string) => {
    try {
      await ProductsService.deleteProduct(id);
      await fetchProducts(filters);
      await fetchStatistics();
    } catch (err) {
      throw new Error("Error al eliminar el producto");
    }
  };

  const updateFilters = useCallback(
    (newFilters: ProductFilters) => {
      setFilters((prevFilters) => {
        const updatedFilters = { ...prevFilters, ...newFilters };
        fetchProducts(updatedFilters);
        return updatedFilters;
      });
    },
    [fetchProducts]
  );

  const refreshData = useCallback(() => {
    fetchProducts(filters);
    fetchCategories();
    fetchStatistics();
  }, [fetchProducts, fetchCategories, fetchStatistics, filters]);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchStatistics();
  }, [fetchProducts, fetchCategories, fetchStatistics]);

  return {
    products,
    categories,
    statistics,
    loading,
    error,
    filters,
    updateFilters,
    deleteProduct,
    refreshData,
  };
}
