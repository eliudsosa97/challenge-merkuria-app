import { api } from "@/lib/api";
import {
  Product,
  ProductFilters,
  ProductStats,
  CreateProductDto,
  PaginatedProducts,
} from "@/lib/types";

export class ProductsService {
  private static readonly BASE_PATH = "/products";

  static async getProducts(
    filters?: ProductFilters
  ): Promise<PaginatedProducts> {
    const params = new URLSearchParams();

    if (filters?.category) params.append("category", filters.category);
    if (filters?.minPrice !== undefined)
      params.append("minPrice", filters.minPrice.toString());
    if (filters?.maxPrice !== undefined)
      params.append("maxPrice", filters.maxPrice.toString());
    if (filters?.search) params.append("search", filters.search);
    if (filters?.sortBy) params.append("sortBy", filters.sortBy);
    if (filters?.sortOrder) params.append("sortOrder", filters.sortOrder);

    if (filters?.page) params.append("page", filters.page.toString());
    if (filters?.limit) params.append("limit", filters.limit.toString());

    const response = await api.get(`${this.BASE_PATH}?${params}`);
    return response.data;
  }

  static async getProduct(id: string): Promise<Product> {
    const response = await api.get(`${this.BASE_PATH}/${id}`);
    return response.data;
  }

  static async createProduct(data: CreateProductDto): Promise<Product> {
    const response = await api.post(this.BASE_PATH, data);
    return response.data;
  }

  static async updateProduct(
    id: string,
    data: Partial<CreateProductDto>
  ): Promise<Product> {
    const response = await api.patch(`${this.BASE_PATH}/${id}`, data);
    return response.data;
  }

  static async deleteProduct(id: string): Promise<void> {
    await api.delete(`${this.BASE_PATH}/${id}`);
  }

  static async getCategories(): Promise<string[]> {
    const response = await api.get(`${this.BASE_PATH}/categories`);
    return response.data;
  }

  static async getStatistics(filters?: ProductFilters): Promise<ProductStats> {
    const params = new URLSearchParams();
    if (filters?.category) params.append("category", filters.category);
    if (filters?.minPrice !== undefined)
      params.append("minPrice", filters.minPrice.toString());
    if (filters?.maxPrice !== undefined)
      params.append("maxPrice", filters.maxPrice.toString());
    if (filters?.search) params.append("search", filters.search);

    const response = await api.get(`${this.BASE_PATH}/statistics?${params}`);
    return response.data;
  }
}
