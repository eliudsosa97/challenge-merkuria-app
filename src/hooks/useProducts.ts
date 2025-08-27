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
  const [totalProducts, setTotalProducts] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const totalPages = Math.ceil(totalProducts / itemsPerPage);

  const fetchData = useCallback(
    async (currentFilters: ProductFilters, page: number, limit: number) => {
      try {
        setLoading(true);
        setError(null);

        const query = { ...currentFilters, page, limit };

        // Pedimos productos y estadísticas en paralelo para más velocidad
        const [productsResponse, statsResponse] = await Promise.all([
          ProductsService.getProducts(query),
          ProductsService.getStatistics(query),
        ]);

        setProducts(productsResponse.data);
        setTotalProducts(productsResponse.total);
        setStatistics(statsResponse);
      } catch (err) {
        setError("Error al cargar los datos");
        console.error(err);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchData(filters, currentPage, itemsPerPage);
  }, [filters, currentPage, itemsPerPage, fetchData]);

  useEffect(() => {
    ProductsService.getCategories()
      .then(setCategories)
      .catch((err) => console.error(err));
  }, []);

  const updateFilters = useCallback((newFilters: Partial<ProductFilters>) => {
    setCurrentPage(1);
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  const goToPage = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const clearFilters = useCallback(() => {
    setCurrentPage(1);
    setFilters({});
  }, []);

  const changeItemsPerPage = (newLimit: number) => {
    setCurrentPage(1);
    setItemsPerPage(newLimit);
  };

  const refreshData = useCallback(() => {
    fetchData(filters, currentPage, itemsPerPage);
  }, [fetchData, filters, currentPage, itemsPerPage]);

  const deleteProduct = async (id: string) => {
    try {
      await ProductsService.deleteProduct(id);
      refreshData();
    } catch (err) {
      throw new Error("Error al eliminar el producto");
    }
  };

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
    clearFilters,
    pagination: {
      currentPage,
      totalPages,
      totalProducts,
      itemsPerPage,
      goToPage,

      changeItemsPerPage,
    },
  };
}
