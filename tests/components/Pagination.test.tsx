import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Pagination } from "@/components/ui/Pagination";

describe("Pagination", () => {
  it("no se muestra si totalPages <= 1", () => {
    const { container } = render(
      <Pagination currentPage={1} totalPages={1} onPageChange={vi.fn()} />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("habilita navegación", () => {
    const onPageChange = vi.fn();
    render(
      <Pagination currentPage={2} totalPages={3} onPageChange={onPageChange} />
    );

    const prev = screen.getByRole("button", { name: /Anterior/i });
    const next = screen.getByRole("button", { name: /Siguiente/i });

    fireEvent.click(prev);
    fireEvent.click(next);

    expect(onPageChange).toHaveBeenCalledWith(1);
    expect(onPageChange).toHaveBeenCalledWith(3);
  });
});
