export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl">🐾</span>
          </div>
        </div>

        <div className="text-center">
          <p className="text-lg font-medium text-gray-700">
            Cargando productos...
          </p>
          <p className="text-sm text-gray-500">
            Preparando todo para tus mascotas
          </p>
        </div>
      </div>
    </div>
  );
}
