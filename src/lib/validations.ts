import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(1, "El nombre es requerido").max(255),
  category: z.string().min(1, "La categoría es requerida").max(100),
  price: z.number().min(0, "El precio debe ser mayor a 0"),
  rating: z.number().min(1).max(5).nullable().default(null),
  stock: z.number().min(0).optional().default(0),
});

export type ProductFormData = z.infer<typeof productSchema>;
