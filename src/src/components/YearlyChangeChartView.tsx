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

interface YearlyChangeChartViewProps {
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

const YearlyChangeChartView: React.FC<YearlyChangeChartViewProps> = ({
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
        const dataMap = new Map<string, number>();
        emissionData.forEach((d) => {
            if (d.value !== null) {
                dataMap.set(`${d.country}-${d.year}`, d.value);
            }
        });

        return selectedCountries.map((country) => {
            const yoyArray = yearLabels.map((year, index) => {
                if (index === 0) return null;
                const prevYear = yearLabels[index - 1];
                const currentVal = dataMap.get(`${country}-${year}`);
                const prevVal = dataMap.get(`${country}-${prevYear}`);
                if (currentVal == null || prevVal == null) return null;
                return currentVal - prevVal;
            });
            return {
                label: `${country} (YoY Diff)`,
                data: yoyArray,
                borderColor: COUNTRY_COLORS[country] || "rgba(0,0,0,0.8)",
                backgroundColor: COUNTRY_COLORS[country] || "rgba(0,0,0,0.3)",
            };
        });
    }, [emissionData, selectedCountries, yearLabels]);

    const yoyLabels = yearLabels.slice(1);

    const chartData = {
        labels: yoyLabels,
        datasets,
    };

    const options = {
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: "Year-Over-Year Emissions Change (Mt CO2e)",
            },
            tooltip: {
                mode: "index" as const,
                intersect: false,
                callbacks: {
                    label: (context: any) => {
                        const val = context.parsed.y;
                        return val
                            ? `${val.toLocaleString()} Mt CO2e difference vs previous year`
                            : "No Data";
                    },
                },
            },
            legend: {
                display: true,
            },
        },
        scales: {
            y: {
                title: {
                    display: true,
                    text: "YoY Emissions Change (Mt CO2e)",
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

export default YearlyChangeChartView;
