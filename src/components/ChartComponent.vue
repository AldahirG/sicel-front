<template>
  <div class="chart-container" :class="{ dark: isDarkMode }">
    <component :is="chartType" :data="coloredChartData" :options="mergedOptions" />
  </div>
</template>

<script>
import { Bar, Line, Pie, Doughnut } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  LineController,
  PointElement,
  LineElement,
  ArcElement,
} from "chart.js";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  LineController,
  PointElement,
  LineElement,
  ArcElement
);

export default {
  name: "ChartComponent",
  props: {
    chartType: {
      type: String,
      required: true,
      validator: (value) =>
        ["bar", "line", "pie", "doughnut"].includes(value.toLowerCase()),
    },
    chartData: {
      type: Object,
      required: true,
    },
    chartOptions: {
      type: Object,
      default: () => ({}),
    },
    isDarkMode: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      chartInstance: null, // Referencia al gráfico
    };
  },
  computed: {
    mergedOptions() {
      return {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          duration: 0, // Evita errores en la animación
        },
        layout: {
          padding: { top: 10, bottom: 10 },
        },
        plugins: {
          legend: {
  position: "top",
  labels: {
    font: {
      size: 12,
      color: this.isDarkMode ? "#FFFFFF" : "#000000", // ✅ Cambia el color del texto de la leyenda
    },
    generateLabels: (chart) => {
      if (!chart || !chart.data || !chart.data.labels) return [];
      return chart.data.labels.map((label, index) => {
        const dataset = chart.data.datasets[0];
        return {
          text: `${label || "Sin nombre"}: ${dataset?.data[index] || 0}`,
          fillStyle: dataset?.backgroundColor?.[index] || "#000",
          hidden: chart.getDatasetMeta(0)?.data[index]?.hidden || false,
          index,
          fontColor: this.isDarkMode ? "#FFFFFF" : "#000000", // ✅ Aplica el color del texto correctamente
        };
      });
    },
  },
},

          tooltip: {
            backgroundColor: this.isDarkMode ? "#1E1E1E" : "#FFFFFF",
            titleColor: this.isDarkMode ? "#FFFFFF" : "#000000",
            bodyColor: this.isDarkMode ? "#FFFFFF" : "#000000",
            borderColor: this.isDarkMode ? "#FFFFFF" : "#000000",
            borderWidth: 1,
            callbacks: {
              label: (context) => `${context.label}: ${context.raw}`,
              
            },
          },
        },
        scales: {
          x: {
            ticks: {
              color: this.isDarkMode ? "#FFFFFF" : "#000000", // Color del eje X
            },
            grid: {
              color: this.isDarkMode ? "#4A5568" : "#E5E7EB",
            },
          },
          y: {
            ticks: {
              color: this.isDarkMode ? "#FFFFFF" : "#000000", // Color del eje Y
            },
            grid: {
              color: this.isDarkMode ? "#4A5568" : "#E5E7EB",
            },
          },
        },
        ...this.chartOptions,
      };
    },
    coloredChartData() {
      const lightColors = [
        "#03045E",
        "#023E8A",
        "#0077B6",
        "#0096C7",
        "#00B4D8",
        "#48CAE4",
        "#90E0EF",
        "#ADE8F4",
        "#CAF0F8",
      ];
      const darkColors = [
        "#1E3A8A",
        "#2563EB",
        "#4F46E5",
        "#6D28D9",
        "#9333EA",
        "#C026D3",
        "#DB2777",
        "#E11D48",
        "#F43F5E",
      ];

      const colors = this.isDarkMode ? darkColors : lightColors;

      return {
        ...this.chartData,
        datasets: this.chartData.datasets.map((dataset) => {
          const backgroundColors = dataset.data.map(
            (_, i) => colors[i % colors.length]
          );
          return {
            ...dataset,
            backgroundColor: backgroundColors,
            borderColor: backgroundColors,
            borderWidth: 1,
          };
        }),
      };
    },
  },
  watch: {
    chartData: {
      deep: true,
      handler(newData) {
        if (this.chartInstance) {
          this.chartInstance.data = newData;
          this.chartInstance.update("none"); // Forzar actualización de la gráfica
        }
      },
    },
    isDarkMode() {
      this.$nextTick(() => {
        if (this.chartInstance) {
          this.chartInstance.options = this.mergedOptions;
          this.chartInstance.update();
        }
      });
    },
  },
  mounted() {
    this.$nextTick(() => {
      if (this.$refs.chart) {
        this.chartInstance = this.$refs.chart.chart; // Guarda la instancia del gráfico
      }
    });
  },
  components: {
    Bar,
    Line,
    Pie,
    Doughnut,
  },
};
</script>



<style scoped>
.chart-container {
  width: 100%;
  height: 300px;
  max-height: 300px;
  margin: auto;
  padding: 10px;
  background-color: #ffffff;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.chart-container.dark {
  background-color: #1e1e1e;
  color: #ffffff;
}
</style>
