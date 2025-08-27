"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./Button";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  // No mostrar nada si solo hay una página o menos
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex items-center justify-between mt-6">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <ChevronLeft className="w-4 h-4 mr-2" />
        Anterior
      </Button>

      <span className="text-sm text-gray-700">
        Página <strong>{currentPage}</strong> de <strong>{totalPages}</strong>
      </span>

      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Siguiente
        <ChevronRight className="w-4 h-4 ml-2" />
      </Button>
    </div>
  );
}
