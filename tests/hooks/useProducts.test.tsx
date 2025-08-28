import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useProducts } from "@/hooks/useProducts";

// Mocks de next/navigation usados dentro del hook
vi.mock("next/navigation", () => {
  return {
    useRouter: () => ({ replace: vi.fn() }),
    usePathname: () => "/test",
    useSearchParams: () => new URLSearchParams(""),
  };
});

// Mocks del ProductsService
vi.mock("@/services/products.service", () => {
  return {
    ProductsService: {
      getProducts: vi.fn().mockResolvedValue({ data: [], total: 0 }),
      getStatistics: vi.fn().mockResolvedValue({
        totalProducts: 0,
        averagePrice: 0,
        byCategory: [],
      }),
      getCategories: vi.fn().mockResolvedValue(["A", "B"]),
      deleteProduct: vi.fn().mockResolvedValue(undefined),
    },
  };
});

describe("useProducts", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("inicializa y obtiene datos", async () => {
    const { result } = renderHook(() => useProducts());

    expect(result.current.loading).toBe(true);

    // Esperar a que se resuelvan los efectos
    await act(async () => {
      await Promise.resolve();
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.categories).toEqual(["A", "B"]);
    expect(result.current.pagination.totalProducts).toBe(0);
  });

  it("actualiza filtros y reinicia página", async () => {
    const { result } = renderHook(() => useProducts());

    await act(async () => {
      result.current.updateFilters({ category: "X" });
      await Promise.resolve();
    });

    expect(result.current.filters.category).toBe("X");
    expect(result.current.pagination.currentPage).toBe(1);
  });
});
