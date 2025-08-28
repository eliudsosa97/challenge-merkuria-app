import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { ProductCard } from "@/components/products/ProductCard";
import { Product } from "@/lib/types";

const product: Product = {
  id: "1",
  name: "Premium Collar",
  category: "Accessories",
  price: 199.99,
  rating: 4.5,
  stock: 12,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

describe("ProductCard", () => {
  it("renderiza información del producto", () => {
    render(
      <ProductCard product={product} onEdit={vi.fn()} onDelete={vi.fn()} />
    );

    expect(screen.getByText("Accessories")).toBeInTheDocument();
    expect(screen.getByText("Premium Collar")).toBeInTheDocument();
    expect(screen.getByText(/Stock:/)).toBeInTheDocument();
  });
});
