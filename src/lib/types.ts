export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  rating: number;
  stock: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  sortBy?: "name" | "price";
  sortOrder?: "ASC" | "DESC";
}

export interface ProductStats {
  totalProducts: number;
  averagePrice: number;
  byCategory: {
    category: string;
    count: number;
    percentage: string;
  }[];
}

export interface CreateProductDto {
  name: string;
  category: string;
  price: number;
  rating?: number;
  stock?: number;
}
