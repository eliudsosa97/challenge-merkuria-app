import { test, expect, Page, Route } from "@playwright/test";

// Datos mock para responder a las llamadas del API durante el E2E
const products = {
  data: [
    {
      id: "1",
      name: "Toy",
      category: "Toys",
      price: 20,
      rating: 4,
      stock: 10,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
  total: 1,
};

const stats = {
  totalProducts: 1,
  averagePrice: 20,
  byCategory: [{ category: "Toys", count: 1, percentage: "100%" }],
};
const categories = ["Toys"];

// Interceptar el backend y responder con mocks para que la UI renderice sin servidor real
async function mockApi(page: Page) {
  // Ajusta los patrones si cambias la URL base del backend
  await page.route("**/products?**", (route: Route) =>
    route.fulfill({ json: products })
  );
  await page.route("**/products/statistics?**", (route: Route) =>
    route.fulfill({ json: stats })
  );
  await page.route("**/products/categories", (route: Route) =>
    route.fulfill({ json: categories })
  );
}

test("home page renders list and pagination", async ({ page, baseURL }) => {
  await mockApi(page);
  await page.goto(baseURL || "/");

  // Product shows up
  await expect(page.getByText("Toy")).toBeVisible();

  // Pagination text
  await expect(page.getByText(/Página 1 de/i)).toBeVisible();
});
