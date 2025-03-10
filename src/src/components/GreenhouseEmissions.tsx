import React, { useEffect, useState } from "react";
import Filters from "./Filters";
import ChartView from "./ChartView";
import TableView from "./TableView";
import AggregatedEmissionsBarView from "./AggregatedEmissionsBarView";
import YearlyChangeChartView from "./YearlyChangeChartView";

export interface EmissionData {
  country: string;
  year: number;
  value: number | null;
}

const COUNTRY_OPTIONS = [
  { label: "United States", value: "USA" },
  { label: "Japan", value: "JPN" },
  { label: "China", value: "CHN" },
  { label: "India", value: "IND" },
  { label: "France", value: "FRA" },
  { label: "Brazil", value: "BRA" },
];

const INDICATOR = "EN.GHG.ALL.MT.CE.AR5";

function GreenhouseEmissions() {
  const [selectedCountries, setSelectedCountries] = useState<string[]>([
    "USA",
    "JPN",
    "CHN",
    "IND",
    "FRA",
    "BRA",
  ]);
  const [startYear, setStartYear] = useState<number>(1972);
  const [endYear, setEndYear] = useState<number>(2022);
  const [emissionData, setEmissionData] = useState<EmissionData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"chart" | "table" | "aggregated" | "yoy">("chart");

  useEffect(() => {
    if (selectedCountries.length === 0) {
      setEmissionData([]);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const countryCodes = selectedCountries.join(";");
        const url = `https://api.worldbank.org/v2/country/${countryCodes}/indicator/${INDICATOR}?format=json&date=${startYear}:${endYear}&per_page=2000`;
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error("Failed to fetch data from World Bank API");
        }

        const data = await response.json();
        const resultsArray = data[1];
        if (!resultsArray) {
          throw new Error("No results found for the selected filters.");
        }

        const parsedData: EmissionData[] = resultsArray.map((item: any) => ({
          country: item.countryiso3code,
          year: parseInt(item.date, 10),
          value: item.value,
        }));

        setEmissionData(parsedData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedCountries, startYear, endYear]);

  return (
    <div className="bg-white p-4 rounded shadow-md max-w-5xl mx-auto">
      <Filters
        countryOptions={COUNTRY_OPTIONS}
        selectedCountries={selectedCountries}
        onSelectCountries={setSelectedCountries}
        startYear={startYear}
        endYear={endYear}
        onChangeStartYear={setStartYear}
        onChangeEndYear={setEndYear}
      />

      <div className="flex items-center space-x-4 mt-4">
        <button
          onClick={() => setViewMode("chart")}
          className={`px-4 py-2 rounded ${viewMode === "chart" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
        >
          Chart View
        </button>
        <button
          onClick={() => setViewMode("table")}
          className={`px-4 py-2 rounded ${viewMode === "table" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
        >
          Table View
        </button>
        <button
          onClick={() => setViewMode("aggregated")}
          className={`px-4 py-2 rounded ${viewMode === "aggregated" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
        >
          Aggregated View
        </button>
        <button
          onClick={() => setViewMode("yoy")}
          className={`px-4 py-2 rounded ${viewMode === "yoy" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
        >
          YoY Change
        </button>
      </div>

      {loading && <p className="mt-4">Loading data...</p>}
      {error && <p className="text-red-500 mt-4">{error}</p>}

      {!loading && !error && emissionData.length > 0 && (
        <>
          {viewMode === "chart" && (
            <ChartView
              emissionData={emissionData}
              selectedCountries={selectedCountries}
              startYear={startYear}
              endYear={endYear}
            />
          )}
          {viewMode === "table" && (
            <TableView
              emissionData={emissionData}
              selectedCountries={selectedCountries}
            />
          )}
          {viewMode === "aggregated" && (
            <AggregatedEmissionsBarView
              emissionData={emissionData}
              selectedCountries={selectedCountries}
              startYear={startYear}
              endYear={endYear}
            />
          )}
          {viewMode === "yoy" && (
            <YearlyChangeChartView
              emissionData={emissionData}
              selectedCountries={selectedCountries}
              startYear={startYear}
              endYear={endYear}
            />
          )}
        </>
      )}

      {!loading && !error && selectedCountries.length === 0 && (
        <p className="mt-4 text-gray-600">No countries selected.</p>
      )}
    </div>
  );
}

export default GreenhouseEmissions;
