import { describe, it, expect } from "vitest";
import { productSchema } from "@/lib/validations";

describe("productSchema", () => {
  it("acepta un producto válido", () => {
    const valid = {
      name: "Collar",
      category: "Accessories",
      price: 10,
      rating: 4.5,
      stock: 5,
    };
    expect(() => productSchema.parse(valid)).not.toThrow();
  });

  it("rechaza valores inválidos", () => {
    const invalid = {
      name: "",
      category: "",
      price: -1,
      rating: 6,
      stock: -2,
    } as any;
    const res = productSchema.safeParse(invalid);
    expect(res.success).toBe(false);
    if (!res.success) {
      const issues = res.error.issues.map(
        (i) => i.path.join(".") + ":" + i.message
      );
      expect(issues.join("|")).toMatch(/name|category|price|rating|stock/);
    }
  });
});
