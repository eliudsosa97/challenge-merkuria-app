"use client";

import { useState, useEffect, useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ProductsService } from "@/services/products.service";
import { Product, ProductFilters, ProductStats } from "@/lib/types";

const ITEMS_PER_PAGE = 10;

export function useProducts() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [statistics, setStatistics] = useState<ProductStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState<ProductFilters>(() => {
    const params = new URLSearchParams(searchParams.toString());
    return {
      category: params.get("category") || undefined,
      search: params.get("search") || undefined,
      minPrice: params.get("minPrice")
        ? Number(params.get("minPrice"))
        : undefined,
      maxPrice: params.get("maxPrice")
        ? Number(params.get("maxPrice"))
        : undefined,
      sortBy: (params.get("sortBy") as "name" | "price") || undefined,
      sortOrder: (params.get("sortOrder") as "ASC" | "DESC") || undefined,
    };
  });

  const [currentPage, setCurrentPage] = useState(
    () => Number(searchParams.get("page")) || 1
  );
  const [itemsPerPage, setItemsPerPage] = useState(
    () => Number(searchParams.get("limit")) || ITEMS_PER_PAGE
  );

  const [totalProducts, setTotalProducts] = useState(0);
  const totalPages = Math.ceil(totalProducts / itemsPerPage);

  const fetchData = useCallback(
    async (currentFilters: ProductFilters, page: number, limit: number) => {
      try {
        setLoading(true);
        setError(null);
        const query = { ...currentFilters, page, limit };

        const [productsResponse, statsResponse] = await Promise.all([
          ProductsService.getProducts(query),
          ProductsService.getStatistics(query),
        ]);

        setProducts(productsResponse.data);
        setTotalProducts(productsResponse.total);
        setStatistics(statsResponse);
      } catch (err) {
        setError("Error al cargar los datos");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.category) params.set("category", filters.category);
    if (filters.search) params.set("search", filters.search);
    if (filters.minPrice) params.set("minPrice", String(filters.minPrice));
    if (filters.maxPrice) params.set("maxPrice", String(filters.maxPrice));
    if (filters.sortBy) params.set("sortBy", filters.sortBy);
    if (filters.sortOrder) params.set("sortOrder", filters.sortOrder);
    if (currentPage > 1) params.set("page", String(currentPage));
    if (itemsPerPage !== ITEMS_PER_PAGE)
      params.set("limit", String(itemsPerPage));

    router.replace(`${pathname}?${params.toString()}`);
    fetchData(filters, currentPage, itemsPerPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, currentPage, itemsPerPage]);

  useEffect(() => {
    ProductsService.getCategories().then(setCategories).catch(console.error);
  }, []);

  const updateFilters = useCallback((patch: Partial<ProductFilters>) => {
    setFilters((prev) => {
      const next: ProductFilters = { ...prev, ...patch };
      const equal =
        prev.category === next.category &&
        prev.search === next.search &&
        prev.minPrice === next.minPrice &&
        prev.maxPrice === next.maxPrice &&
        prev.sortBy === next.sortBy &&
        prev.sortOrder === next.sortOrder;

      if (!equal) {
        setCurrentPage(1);
      }
      return next;
    });
  }, []);

  const clearFilters = useCallback(() => {
    setCurrentPage(1);
    setFilters({});
  }, []);

  const goToPage = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

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
    clearFilters,
    deleteProduct,
    refreshData,
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
