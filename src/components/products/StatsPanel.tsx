"use client";

import { ProductStats } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import { Package, DollarSign, TrendingUp, BarChart3 } from "lucide-react";

interface StatsPanelProps {
  statistics: ProductStats | null;
  loading: boolean;
}

export function StatsPanel({ statistics, loading }: StatsPanelProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-lg shadow-sm border animate-pulse"
          >
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="w-16 h-4 bg-gray-200 rounded"></div>
                <div className="w-24 h-8 bg-gray-200 rounded"></div>
              </div>
              <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!statistics) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <p className="text-gray-500 text-center">
          No hay estadísticas disponibles
        </p>
      </div>
    );
  }

  const topCategory =
    statistics.byCategory.length > 0
      ? statistics.byCategory.reduce((prev, current) =>
          prev.count > current.count ? prev : current
        )
      : { category: "N/A", count: 0 };

  const stats = [
    {
      title: "Total Productos",
      value: statistics.totalProducts.toString(),
      icon: Package,
      color: "bg-blue-50 text-blue-600",
      bgColor: "bg-blue-500",
    },
    {
      title: "Precio Promedio",
      value: formatPrice(statistics.averagePrice),
      icon: DollarSign,
      color: "bg-green-50 text-green-600",
      bgColor: "bg-green-500",
    },
    {
      title: "Categoría Principal",
      value: topCategory.category,
      subValue: `${topCategory.count} productos`,
      icon: TrendingUp,
      color: "bg-purple-50 text-purple-600",
      bgColor: "bg-purple-500",
    },
    {
      title: "Categorías Totales",
      value: statistics.byCategory.length.toString(),
      subValue: "Diferentes tipos",
      icon: BarChart3,
      color: "bg-orange-50 text-orange-600",
      bgColor: "bg-orange-500",
    },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                {stat.subValue && (
                  <p className="text-xs text-gray-500 mt-1">{stat.subValue}</p>
                )}
              </div>
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <BarChart3 className="w-5 h-5 mr-2 text-gray-600" />
          Distribución por Categorías
        </h3>
        <div className="space-y-3">
          {...statistics.byCategory
            .sort((a, b) => b.count - a.count)
            .map((category, index) => (
              <div
                key={category.category}
                className="flex items-center justify-between"
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      index === 0
                        ? "bg-blue-500"
                        : index === 1
                        ? "bg-green-500"
                        : index === 2
                        ? "bg-purple-500"
                        : index === 3
                        ? "bg-orange-500"
                        : index === 4
                        ? "bg-pink-500"
                        : "bg-gray-400"
                    }`}
                  ></div>
                  <span className="font-medium text-gray-900">
                    {category.category}
                  </span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex-1 bg-gray-200 rounded-full h-2 w-24">
                    <div
                      className={`h-2 rounded-full ${
                        index === 0
                          ? "bg-blue-500"
                          : index === 1
                          ? "bg-green-500"
                          : index === 2
                          ? "bg-purple-500"
                          : index === 3
                          ? "bg-orange-500"
                          : index === 4
                          ? "bg-pink-500"
                          : "bg-gray-400"
                      }`}
                      style={{ width: `${category.percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-600 min-w-[3rem]">
                    {category.count}
                  </span>
                  <span className="text-xs text-gray-500 min-w-[3rem]">
                    {category.percentage}%
                  </span>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
