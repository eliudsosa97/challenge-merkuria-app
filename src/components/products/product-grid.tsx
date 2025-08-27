"use client";

import { Product } from "@/lib/types";
import { ProductCard } from "./product-card";
import { Package } from "lucide-react";

interface ProductGridProps {
  products: Product[];
  loading: boolean;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => Promise<void>;
}

export function ProductGrid({
  products,
  loading,
  onEdit,
  onDelete,
}: ProductGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse"
          >
            <div className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center space-x-2">
                  <div className="w-9 h-9 bg-gray-200 rounded-lg"></div>
                  <div className="w-16 h-5 bg-gray-200 rounded-full"></div>
                </div>
              </div>
              <div className="w-3/4 h-6 bg-gray-200 rounded mb-2"></div>
              <div className="w-1/2 h-4 bg-gray-200 rounded mb-3"></div>
              <div className="w-1/3 h-8 bg-gray-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="p-4 bg-gray-100 rounded-full mb-4">
          <Package className="w-12 h-12 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          No hay productos disponibles
        </h3>
        <p className="text-gray-600 text-center max-w-md">
          No se encontraron productos que coincidan con los filtros actuales.
          Intenta ajustar los criterios de búsqueda.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <div key={product.id} className="group">
          <ProductCard product={product} onEdit={onEdit} onDelete={onDelete} />
        </div>
      ))}
    </div>
  );
}
