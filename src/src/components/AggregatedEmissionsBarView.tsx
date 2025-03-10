import React, { useMemo } from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { EmissionData } from "./GreenhouseEmissions";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface AggregatedEmissionsBarViewProps {
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

const AggregatedEmissionsBarView: React.FC<AggregatedEmissionsBarViewProps> = ({
    emissionData,
    selectedCountries,
    startYear,
    endYear,
}) => {
    const aggregatedData = useMemo(() => {
        const dataMap: Record<string, { sum: number; count: number; average: number }> = {};

        selectedCountries.forEach((country) => {
            dataMap[country] = { sum: 0, count: 0, average: 0 };
        });

        emissionData.forEach((d) => {
            if (
                d.year >= startYear &&
                d.year <= endYear &&
                d.value !== null &&
                selectedCountries.includes(d.country)
            ) {
                dataMap[d.country].sum += d.value;
                dataMap[d.country].count += 1;
            }
        });

        Object.keys(dataMap).forEach((country) => {
            const { sum, count } = dataMap[country];
            dataMap[country].average = count > 0 ? sum / count : 0;
        });

        return dataMap;
    }, [emissionData, selectedCountries, startYear, endYear]);

    const labels = selectedCountries;
    const chartData = {
        labels,
        datasets: [
            {
                label: "Avg Emissions (Mt CO2e)",
                data: labels.map((country) => aggregatedData[country]?.average ?? 0),
                backgroundColor: labels.map(
                    (country) => COUNTRY_COLORS[country] || "rgba(0,0,0,0.7)"
                ),
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: `Average Emissions by Country (${startYear} - ${endYear})`,
            },
            tooltip: {
                callbacks: {
                    label: (context: any) => {
                        const val = context.parsed.y;
                        return val ? `${val.toLocaleString()} Mt CO2e (avg)` : "No Data / 0";
                    },
                },
            },
        },
        scales: {
            y: {
                title: {
                    display: true,
                    text: "Avg Emissions (Mt CO2e)",
                },
                beginAtZero: true,
            },
            x: {
                title: {
                    display: true,
                    text: "Country",
                },
            },
        },
    };

    return (
        <div className="mt-6">
            <Bar data={chartData} options={options} />
        </div>
    );
};

export default AggregatedEmissionsBarView;
