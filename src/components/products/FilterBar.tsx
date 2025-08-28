"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, Filter, X } from "lucide-react";
import { ProductFilters } from "@/lib/types";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { debounce } from "@/lib/utils";

interface FilterBarProps {
  categories: string[];
  filters: ProductFilters;
  onFiltersChange: (filters: ProductFilters) => void;
  onClearFilters: () => void;
  totalResults: number;
}

export function FilterBar({
  categories,
  filters,
  onFiltersChange,
  onClearFilters,
  totalResults,
}: FilterBarProps) {
  const [localSearch, setLocalSearch] = useState(filters.search || "");
  const [showFilters, setShowFilters] = useState(false);

  const debouncedSearch = useCallback(
    debounce((...args: unknown[]) => {
      const value = args[0] as string;
      onFiltersChange({ search: value || undefined });
    }, 300),
    [onFiltersChange]
  );

  const [initialized, setInitialized] = useState(false);
  useEffect(() => {
    if (!initialized) {
      setInitialized(true);
      return;
    }
    debouncedSearch(localSearch);
  }, [localSearch, debouncedSearch, initialized]);

  const handleCategoryChange = (category: string) => {
    onFiltersChange({
      ...filters,
      category: category === "all" ? undefined : category,
    });
  };

  const handlePriceChange = (type: "min" | "max", value: string) => {
    const numValue = value ? parseFloat(value) : undefined;
    onFiltersChange({
      ...filters,
      [type === "min" ? "minPrice" : "maxPrice"]: numValue,
    });
  };

  const handleSortChange = (sortBy: string, sortOrder: string) => {
    onFiltersChange({
      ...filters,
      sortBy: sortBy as "name" | "price",
      sortOrder: sortOrder as "ASC" | "DESC",
    });
  };

  const clearFilters = () => {
    setLocalSearch("");
    onClearFilters();
  };

  const hasActiveFilters = !!(
    filters.category ||
    filters.minPrice ||
    filters.maxPrice ||
    filters.search ||
    filters.sortBy
  );

  const categoryOptions = [
    { value: "all", label: "Todas las categorías" },
    ...categories.map((cat) => ({ value: cat, label: cat })),
  ];

  const sortOptions = [
    { value: "name-ASC", label: "Nombre (A-Z)" },
    { value: "name-DESC", label: "Nombre (Z-A)" },
    { value: "price-ASC", label: "Precio (Menor a Mayor)" },
    { value: "price-DESC", label: "Precio (Mayor a Menor)" },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4 space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Buscar productos..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 text-gray-900 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2"
          >
            <Filter className="w-4 h-4" />
            <span>Filtros</span>
            {hasActiveFilters && (
              <span className="bg-blue-600 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                !
              </span>
            )}
          </Button>

          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearFilters}
              className="flex items-center space-x-1 text-red-600 hover:text-red-700"
            >
              <X className="w-4 h-4" />
              <span>Limpiar</span>
            </Button>
          )}
        </div>
      </div>

      {showFilters && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t">
          <Select
            label="Categoría"
            options={categoryOptions}
            value={filters.category || "all"}
            onChange={(e) => handleCategoryChange(e.target.value)}
          />

          <Input
            label="Precio mínimo"
            type="number"
            placeholder="0.00"
            value={filters.minPrice?.toString() || ""}
            onChange={(e) => handlePriceChange("min", e.target.value)}
            min="0"
            step="0.01"
          />

          <Input
            label="Precio máximo"
            type="number"
            placeholder="999.99"
            value={filters.maxPrice?.toString() || ""}
            onChange={(e) => handlePriceChange("max", e.target.value)}
            min="0"
            step="0.01"
          />

          <Select
            label="Ordenar por"
            options={[{ value: "", label: "Sin ordenar" }, ...sortOptions]}
            value={
              filters.sortBy && filters.sortOrder
                ? `${filters.sortBy}-${filters.sortOrder}`
                : ""
            }
            onChange={(e) => {
              if (e.target.value) {
                const [sortBy, sortOrder] = e.target.value.split("-");
                handleSortChange(sortBy, sortOrder);
              } else {
                onFiltersChange({
                  ...filters,
                  sortBy: undefined,
                  sortOrder: undefined,
                });
              }
            }}
          />
        </div>
      )}

      <div className="flex justify-between items-center text-sm text-gray-600 pt-2 border-t">
        <span>
          {totalResults} producto{totalResults !== 1 ? "s" : ""} encontrado
          {totalResults !== 1 ? "s" : ""}
        </span>

        {hasActiveFilters && (
          <div className="flex items-center space-x-2">
            <span className="text-xs">Filtros activos:</span>
            {filters.category && (
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                {filters.category}
              </span>
            )}
            {(filters.minPrice || filters.maxPrice) && (
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                ${filters.minPrice || 0} - ${filters.maxPrice || "∞"}
              </span>
            )}
            {filters.search && (
              <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs">
                &quot;{filters.search}&quot;
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
