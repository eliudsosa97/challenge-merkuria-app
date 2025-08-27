"use client";

import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { ProductGrid } from "@/components/products/ProductGrid";
import { FilterBar } from "@/components/products/FilterBar";
import { StatsPanel } from "@/components/products/StatsPanel";
import { useProducts } from "@/hooks/useProducts";
import { Product } from "@/lib/types";

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

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    // TODO: Abrir modal de edición
    console.log("Editar producto:", product);
  };

  const handleCreate = () => {
    setShowCreateForm(true);
    // TODO: Abrir modal de creación
    console.log("Crear nuevo producto");
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteProduct(id);
    } catch (error) {
      console.error("Error al eliminar:", error);
      alert("Error al eliminar el producto");
    }
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
            onDelete={handleDelete}
          />
        </div>

        {!loading && (
          <div className="text-center py-4">
            <p className="text-sm text-gray-500">
              🟢 Conectado • Última actualización:{" "}
              {new Date().toLocaleTimeString()}
            </p>
          </div>
        )}
      </main>

      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Crear Producto</h3>
            <p className="text-gray-600">Modal de creación</p>
            <button
              onClick={() => setShowCreateForm(false)}
              className="mt-4 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {editingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">
              Editar: {editingProduct.name}
            </h3>
            <p className="text-gray-600">Modal de edición</p>
            <button
              onClick={() => setEditingProduct(null)}
              className="mt-4 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
