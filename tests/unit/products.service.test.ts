import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { ProductsService } from "@/services/products.service";
import { api } from "@/lib/api";

vi.mock("@/lib/api", () => {
  const axios = {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
    interceptors: { response: { use: vi.fn() } },
  } as any;
  return { api: axios };
});

const sampleProduct = {
  id: "1",
  name: "Toy",
  category: "Toys",
  price: 20,
  rating: 4,
  stock: 10,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

describe("ProductsService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("getProducts construye el query y retorna datos", async () => {
    (api.get as any).mockResolvedValueOnce({
      data: { data: [sampleProduct], total: 1 },
    });
    const res = await ProductsService.getProducts({
      category: "Toys",
      page: 2,
      limit: 10,
    });
    expect(api.get).toHaveBeenCalledWith(expect.stringContaining("/products?"));
    expect(res.total).toBe(1);
    expect(res.data[0].id).toBe("1");
  });

  it("getProduct obtiene por id", async () => {
    (api.get as any).mockResolvedValueOnce({ data: sampleProduct });
    const res = await ProductsService.getProduct("1");
    expect(api.get).toHaveBeenCalledWith("/products/1");
    expect(res.id).toBe("1");
  });

  it("createProduct envía los datos (POST)", async () => {
    (api.post as any).mockResolvedValueOnce({ data: sampleProduct });
    const res = await ProductsService.createProduct({
      name: "Toy",
      category: "Toys",
      price: 20,
    });
    expect(api.post).toHaveBeenCalledWith(
      "/products",
      expect.objectContaining({ name: "Toy" })
    );
    expect(res.id).toBe("1");
  });

  it("updateProduct actualiza los datos (PATCH)", async () => {
    (api.patch as any).mockResolvedValueOnce({ data: sampleProduct });
    const res = await ProductsService.updateProduct("1", { price: 25 });
    expect(api.patch).toHaveBeenCalledWith("/products/1", { price: 25 });
    expect(res.id).toBe("1");
  });

  it("deleteProduct elimina por id", async () => {
    (api.delete as any).mockResolvedValueOnce({});
    await expect(ProductsService.deleteProduct("1")).resolves.toBeUndefined();
    expect(api.delete).toHaveBeenCalledWith("/products/1");
  });

  it("getCategories retorna arreglo", async () => {
    (api.get as any).mockResolvedValueOnce({ data: ["A", "B"] });
    const res = await ProductsService.getCategories();
    expect(api.get).toHaveBeenCalledWith("/products/categories");
    expect(res).toEqual(["A", "B"]);
  });

  it("getStatistics construye filtros y retorna estadística", async () => {
    (api.get as any).mockResolvedValueOnce({
      data: { totalProducts: 1, averagePrice: 10, byCategory: [] },
    });
    const res = await ProductsService.getStatistics({
      category: "Toys",
      minPrice: 1,
      maxPrice: 100,
      search: "toy",
    });
    expect(api.get).toHaveBeenCalledWith(
      expect.stringContaining("/products/statistics?")
    );
    expect(res.totalProducts).toBe(1);
  });
});
