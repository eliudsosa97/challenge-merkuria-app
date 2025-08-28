import { describe, it, expect, vi } from "vitest";
import { cn, formatPrice, formatRating, debounce } from "@/lib/utils";

describe("utils", () => {
  it("cn combina clases", () => {
    expect(cn("a", false && "b", "c")).toContain("a");
  });

  it("formatPrice usa MXN", () => {
    expect(formatPrice(1234.56)).toMatch(/\$\s?1,234\.56/);
  });

  it("formatRating devuelve estrellas", () => {
    expect(formatRating(3)).toBe("⭐⭐⭐");
    expect(formatRating(3.5)).toBe("⭐⭐⭐⭐");
  });

  it("debounce retrasa la ejecución", async () => {
    vi.useFakeTimers();
    const spy = vi.fn();
    const d = debounce(spy, 200);
    d("x");
    vi.advanceTimersByTime(199);
    expect(spy).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1);
    expect(spy).toHaveBeenCalledWith("x");
    vi.useRealTimers();
  });
});
