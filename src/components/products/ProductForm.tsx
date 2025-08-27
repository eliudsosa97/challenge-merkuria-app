"use client";

import { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, Save, Package } from "lucide-react";
import { Product, CreateProductDto } from "@/lib/types";
import { productSchema, ProductFormData } from "@/lib/validations";
import { ProductsService } from "@/services/products.service";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";

interface ProductFormProps {
  product?: Product | null;
  categories: string[];
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function ProductForm({
  product,
  categories,
  isOpen,
  onClose,
  onSuccess,
}: ProductFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const isEditing = !!product;

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = form;

  useEffect(() => {
    if (product) {
      reset(product);
    } else {
      reset({
        name: "",
        category: "",
        price: undefined,
        rating: undefined,
        stock: undefined,
      });
    }
  }, [product, reset]);

  const categoryOptions = [
    { value: "", label: "Selecciona una categoría" },
    ...categories.map((cat) => ({ value: cat, label: cat })),
    { value: "new", label: "+ Nueva categoría" },
  ];

  const [showNewCategory, setShowNewCategory] = useState(false);
  const [newCategory, setNewCategory] = useState("");

  const onSubmit: SubmitHandler<ProductFormData> = async (data) => {
    setIsLoading(true);

    try {
      const finalData: CreateProductDto = {
        name: data.name,
        category: showNewCategory ? newCategory : data.category,
        price: data.price,
        rating: data.rating,
        stock: data.stock,
      };

      if (isEditing && product) {
        await ProductsService.updateProduct(product.id, finalData);
      } else {
        await ProductsService.createProduct(finalData);
      }

      onSuccess();
      onClose();
      reset();
      setShowNewCategory(false);
      setNewCategory("");
    } catch (error) {
      console.error("Error al guardar producto:", error);
      alert("Error al guardar el producto. Inténtalo de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategoryChange = (value: string) => {
    if (value === "new") {
      setShowNewCategory(true);
      setValue("category", "");
    } else {
      setShowNewCategory(false);
      setValue("category", value);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Package className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {isEditing ? "Editar Producto" : "Crear Producto"}
              </h2>
              {isEditing && (
                <p className="text-sm text-gray-500">
                  Modificando: {product?.name}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <Input
            label="Nombre del producto *"
            placeholder="Ej: Collar para perros premium"
            {...register("name")}
            error={errors.name?.message}
          />

          <div className="space-y-2">
            {!showNewCategory ? (
              <Select
                label="Categoría *"
                options={categoryOptions}
                {...register("category")}
                onChange={(e) => handleCategoryChange(e.target.value)}
                error={errors.category?.message}
              />
            ) : (
              <div>
                <Input
                  label="Nueva categoría *"
                  placeholder="Ej: Accesorios, Comida, Juguetes"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  error={!newCategory ? "La categoría es requerida" : ""}
                />
                <button
                  type="button"
                  onClick={() => {
                    setShowNewCategory(false);
                    setNewCategory("");
                  }}
                  className="text-sm text-blue-600 hover:text-blue-700 mt-1"
                >
                  ← Seleccionar categoría existente
                </button>
              </div>
            )}
          </div>

          <Input
            label="Precio *"
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            {...register("price", { valueAsNumber: true })}
            error={errors.price?.message}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Calificación"
              type="number"
              step="0.1"
              min="1"
              max="5"
              placeholder="4.5"
              {...register("rating", {
                valueAsNumber: true,
                setValueAs: (value) =>
                  value === "" ? undefined : Number(value),
              })}
              error={errors.rating?.message}
            />

            <Input
              label="Stock"
              type="number"
              min="0"
              placeholder="100"
              {...register("stock", { valueAsNumber: true })}
              error={errors.stock?.message}
            />
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Información</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Los campos marcados con * son obligatorios</li>
              <li>• La calificación debe ser entre 1 y 5 estrellas</li>
              <li>• El precio debe ser mayor a 0</li>
              <li>• El stock se establece en 0 por defecto</li>
            </ul>
          </div>

          <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 space-y-2 space-y-reverse sm:space-y-0 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isLoading || (showNewCategory && !newCategory)}
              className="flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Guardando...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>
                    {isEditing ? "Guardar Cambios" : "Crear Producto"}
                  </span>
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
