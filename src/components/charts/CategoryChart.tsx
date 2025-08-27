"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  TooltipItem,
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";
import { ProductStats } from "@/lib/types";
import { BarChart3 } from "lucide-react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface CategoryChartProps {
  statistics: ProductStats | null;
  type?: "bar" | "doughnut";
}

export function CategoryChart({
  statistics,
  type = "doughnut",
}: CategoryChartProps) {
  if (!statistics || statistics.byCategory.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="p-4 bg-gray-100 rounded-full mb-4 inline-block">
              <BarChart3 className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500">No hay datos para mostrar</p>
          </div>
        </div>
      </div>
    );
  }

  const colors = [
    "#3B82F6", // Blue
    "#10B981", // Green
    "#8B5CF6", // Purple
    "#F59E0B", // Orange
    "#EF4444", // Red
    "#6366F1", // Indigo
    "#EC4899", // Pink
    "#84CC16", // Lime
  ];

  const sortedCategories = [...statistics.byCategory].sort(
    (a, b) => b.count - a.count
  );

  const barData = {
    labels: sortedCategories.map((cat) => cat.category),
    datasets: [
      {
        label: "Productos por Categoría",
        data: sortedCategories.map((cat) => cat.count),
        backgroundColor: colors.slice(0, sortedCategories.length),
        borderColor: colors.slice(0, sortedCategories.length),
        borderWidth: 1,
        borderRadius: 6,
        borderSkipped: false,
      },
    ],
  };

  const doughnutData = {
    labels: sortedCategories.map((cat) => cat.category),
    datasets: [
      {
        data: sortedCategories.map((cat) => cat.count),
        backgroundColor: colors.slice(0, sortedCategories.length),
        borderColor: "#ffffff",
        borderWidth: 2,
        hoverOffset: 4,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: "Productos por Categoría",
        color: "#1F2937",
      },
      tooltip: {
        callbacks: {
          label: function (context: TooltipItem<"bar">) {
            const total = statistics!.totalProducts;
            const percentage = (
              ((context.raw as number) / total) *
              100
            ).toFixed(1);
            return `${context.raw} productos (${percentage}%)`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
        grid: {
          color: "#F3F4F6",
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          padding: 20,
          usePointStyle: true,
          font: {
            size: 12,
          },
        },
      },
      title: {
        display: true,
        text: "Distribución por Categorías",
        color: "#1F2937",
        padding: {
          bottom: 20,
        },
      },
      tooltip: {
        callbacks: {
          label: function (context: TooltipItem<"doughnut">) {
            const percentage = (
              ((context.raw as number) / statistics!.totalProducts) *
              100
            ).toFixed(1);
            return `${context.label}: ${context.raw} productos (${percentage}%)`;
          },
        },
      },
    },
    cutout: "60%",
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <div className="h-80">
        {type === "bar" ? (
          <Bar data={barData} options={barOptions} />
        ) : (
          <Doughnut data={doughnutData} options={doughnutOptions} />
        )}
      </div>

      <div className="mt-4 pt-4 border-t grid grid-cols-2 gap-4 text-sm text-gray-600">
        <div>
          <span className="font-medium">Categoría más popular:</span>
          <br />
          <span className="text-gray-900">{sortedCategories[0]?.category}</span>
        </div>
        <div>
          <span className="font-medium">Total de categorías:</span>
          <br />
          <span className="text-gray-900">{sortedCategories.length}</span>
        </div>
      </div>
    </div>
  );
}
