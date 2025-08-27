"use client";

import { Plus } from "lucide-react"; // 1. Importa el ícono

interface HeaderProps {
  onCreateClick: () => void;
}

export function Header({ onCreateClick }: HeaderProps) {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-gray-900">
                Challenge - Productos
              </h1>
              <p className="text-sm text-gray-500">Productos para Mascotas</p>
            </div>
          </div>

          {/* 2. Botón actualizado para ser responsivo */}
          <button
            onClick={onCreateClick}
            className="bg-green-700 hover:bg-green-800 text-white px-3 py-2 sm:px-4 rounded-lg font-medium transition-colors cursor-pointer flex items-center"
          >
            <Plus className="h-5 w-5 sm:mr-2" />
            <span className="hidden sm:inline">Agregar Producto</span>
          </button>
        </div>
      </div>
    </header>
  );
}
