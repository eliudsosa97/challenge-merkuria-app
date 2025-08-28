import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { ProductGrid } from "@/components/products/ProductGrid";
import { Product } from "@/lib/types";

describe("ProductGrid", () => {
  it("muestra skeletons cuando loading", () => {
    render(
      <ProductGrid
        products={[]}
        loading={true}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />
    );
    // Verifica elementos con la clase de skeleton
    expect(document.querySelectorAll(".animate-pulse").length).toBeGreaterThan(
      0
    );
  });

  it("muestra estado vacío", () => {
    render(
      <ProductGrid
        products={[]}
        loading={false}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />
    );
    expect(
      screen.getByText("No hay productos disponibles")
    ).toBeInTheDocument();
  });

  it("renderiza productos", () => {
    const products: Product[] = [
      {
        id: "1",
        name: "A",
        category: "Electronics",
        price: 1,
        rating: 4,
        stock: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "2",
        name: "B",
        category: "Toys",
        price: 2,
        rating: 5,
        stock: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
    render(
      <ProductGrid
        products={products}
        loading={false}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />
    );
    expect(screen.getByText("A")).toBeInTheDocument();
    expect(screen.getByText("B")).toBeInTheDocument();
  });
});
