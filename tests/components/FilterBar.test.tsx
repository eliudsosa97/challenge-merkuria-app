import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";
import { FilterBar } from "@/components/products/FilterBar";
import { ProductFilters } from "@/lib/types";

describe("FilterBar", () => {
  const baseFilters: ProductFilters = {};

  it("llama onFiltersChange al escribir (con debounce)", () => {
    vi.useFakeTimers();
    const onFiltersChange = vi.fn();
    render(
      <FilterBar
        categories={["A", "B"]}
        filters={baseFilters}
        onFiltersChange={onFiltersChange}
        onClearFilters={vi.fn()}
        totalResults={0}
      />
    );

    const input = screen.getByPlaceholderText("Buscar productos...");
    fireEvent.change(input, { target: { value: "toy" } });
    // Avanza el debounce
    vi.advanceTimersByTime(300);
    expect(onFiltersChange).toHaveBeenCalledWith({ search: "toy" });
    vi.useRealTimers();
  });

  it("muestra conteo cuando hay filtros activos", () => {
    render(
      <FilterBar
        categories={["A"]}
        filters={{ category: "A" }}
        onFiltersChange={vi.fn()}
        onClearFilters={vi.fn()}
        totalResults={5}
      />
    );
    expect(screen.getByText("5 productos encontrados")).toBeInTheDocument();
  });
});
