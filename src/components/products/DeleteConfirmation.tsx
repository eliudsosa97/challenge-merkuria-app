"use client";

import { useState } from "react";
import { Trash2, AlertTriangle, X } from "lucide-react";
import { Product } from "@/lib/types";
import { Button } from "@/components/ui/Button";

interface DeleteConfirmationProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (id: string) => Promise<void>;
}

export function DeleteConfirmation({
  product,
  isOpen,
  onClose,
  onConfirm,
}: DeleteConfirmationProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirm = async () => {
    if (!product) return;

    setIsDeleting(true);
    try {
      await onConfirm(product.id);
      onClose();
    } catch (error) {
      console.error("Error al eliminar:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-50 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">
              Confirmar Eliminación
            </h2>
          </div>
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          <div className="text-center mb-6">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <Trash2 className="w-8 h-8 text-red-600" />
            </div>

            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              ¿Eliminar producto?
            </h3>

            <p className="text-gray-600 mb-4">
              Estás a punto de eliminar el siguiente producto:
            </p>

            <div className="bg-gray-50 p-4 rounded-lg text-left">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Nombre:</span>
                  <span className="text-gray-900">{product.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Categoría:</span>
                  <span className="text-gray-900">{product.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Precio:</span>
                  <span className="text-gray-900">
                    ${Number(product.price).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Stock:</span>
                  <span className="text-gray-900">
                    {product.stock} unidades
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-red-50 border border-red-200 p-4 rounded-lg mt-4">
              <p className="text-sm text-red-800">
                ⚠️ <strong>Esta acción no se puede deshacer.</strong>
                <br />
                El producto será eliminado permanentemente de la base de datos.
              </p>
            </div>
          </div>

          <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-3 space-y-3 space-y-reverse sm:space-y-0">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isDeleting}
              className="flex-1 sm:flex-none"
            >
              Cancelar
            </Button>

            <Button
              type="button"
              variant="danger"
              onClick={handleConfirm}
              disabled={isDeleting}
              className="flex-1 sm:flex-none flex items-center justify-center space-x-2"
            >
              {isDeleting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Eliminando...</span>
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4" />
                  <span>Sí, Eliminar</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
