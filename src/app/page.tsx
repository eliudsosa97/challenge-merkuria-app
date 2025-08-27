"use client";

import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { ProductGrid } from "@/components/products/ProductGrid";
import { FilterBar } from "@/components/products/FilterBar";
import { StatsPanel } from "@/components/products/StatsPanel";
import { CategoryChart } from "@/components/charts/CategoryChart";
import { ProductForm } from "@/components/products/ProductForm";
import { DeleteConfirmation } from "@/components/products/DeleteConfirmation";
import { useProducts } from "@/hooks/useProducts";
import { Product } from "@/lib/types";
import { toast } from "sonner";

export default function HomePage() {
  const {
    products,
    categories,
    statistics,
    loading,
    error,
    filters,
    updateFilters,
    deleteProduct,
    refreshData,
  } = useProducts();

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
  };

  const handleCreate = () => {
    setShowCreateForm(true);
  };

  const handleDeleteRequest = async (product: Product): Promise<void> => {
    setDeletingProduct(product);
    return Promise.resolve();
  };

  const handleDeleteConfirm = async (id: string) => {
    try {
      await deleteProduct(id);
      toast.success("Producto eliminado exitosamente");
      setDeletingProduct(null);
    } catch (error) {
      toast.error("Error al eliminar el producto");
      throw error;
    }
  };

  const handleFormSuccess = () => {
    refreshData();
    toast.success(
      editingProduct
        ? "Producto actualizado exitosamente"
        : "Producto creado exitosamente"
    );
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Error de Conexión
          </h2>
          <p className="text-gray-600 mb-4">
            No se pudo conectar con el servidor backend.
          </p>
          <p className="text-sm text-gray-500 mb-4">
            Asegúrate de que el servidor NestJS esté corriendo en
            http://localhost:3000
          </p>
          <button
            onClick={refreshData}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
          >
            Reintentar Conexión
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header onCreateClick={handleCreate} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <StatsPanel statistics={statistics} loading={loading} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CategoryChart statistics={statistics} type="doughnut" />
          <CategoryChart statistics={statistics} type="bar" />
        </div>

        <FilterBar
          categories={categories}
          filters={filters}
          onFiltersChange={updateFilters}
          totalResults={products.length}
        />

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              Productos Disponibles
            </h2>

            {!loading && products.length > 0 && (
              <div className="text-sm text-gray-500">
                Mostrando {products.length} productos
              </div>
            )}
          </div>

          <ProductGrid
            products={products}
            loading={loading}
            onEdit={handleEdit}
            onDelete={handleDeleteRequest}
          />
        </div>

        {!loading && (
          <div className="text-center py-4">
            <p className="text-sm text-gray-500">
              🟢 Conectado • Última actualización:{" "}
              {new Date().toLocaleTimeString()}
            </p>
            <p>Desarrollado por Eliud Sosa. 2025</p>
          </div>
        )}
      </main>

      <ProductForm
        product={editingProduct}
        categories={categories}
        isOpen={showCreateForm || !!editingProduct}
        onClose={() => {
          setShowCreateForm(false);
          setEditingProduct(null);
        }}
        onSuccess={handleFormSuccess}
      />

      <DeleteConfirmation
        product={deletingProduct}
        isOpen={!!deletingProduct}
        onClose={() => setDeletingProduct(null)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
