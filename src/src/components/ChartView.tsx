import React, { useMemo } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { EmissionData } from "./GreenhouseEmissions";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface ChartViewProps {
  emissionData: EmissionData[];
  selectedCountries: string[];
  startYear: number;
  endYear: number;
}

const COUNTRY_COLORS: Record<string, string> = {
  USA: "rgba(255, 99, 132, 0.8)",
  JPN: "rgba(54, 162, 235, 0.8)",
  CHN: "rgba(255, 206, 86, 0.8)",
  IND: "rgba(75, 192, 192, 0.8)",
  FRA: "rgba(153, 102, 255, 0.8)",
  BRA: "rgba(255, 159, 64, 0.8)",
};

const ChartView: React.FC<ChartViewProps> = ({
  emissionData,
  selectedCountries,
  startYear,
  endYear,
}) => {
  const yearLabels = useMemo(() => {
    const years: number[] = [];
    for (let y = startYear; y <= endYear; y++) {
      years.push(y);
    }
    return years;
  }, [startYear, endYear]);

  const datasets = useMemo(() => {
    return selectedCountries.map((countryCode) => {
      const dataPoints = yearLabels.map((year) => {
        const entry = emissionData.find((d) => d.country === countryCode && d.year === year);
        return entry?.value ?? null;
      });
      return {
        label: countryCode,
        data: dataPoints,
        borderColor: COUNTRY_COLORS[countryCode] || "rgba(0,0,0,0.8)",
        backgroundColor: COUNTRY_COLORS[countryCode] || "rgba(0,0,0,0.3)",
      };
    });
  }, [emissionData, selectedCountries, yearLabels]);

  const chartData = {
    labels: yearLabels,
    datasets,
  };

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Greenhouse Emissions Over Time (Mt CO2e)",
      },
      tooltip: {
        mode: "index" as const,
        intersect: false,
      },
      legend: {
        display: true,
      },
    },
    scales: {
      y: {
        title: {
          display: true,
          text: "Emissions (Mt CO2e)",
        },
      },
      x: {
        title: {
          display: true,
          text: "Year",
        },
      },
    },
  };

  return (
    <div className="mt-6">
      <Line data={chartData} options={options} />
    </div>
  );
};

export default ChartView;
