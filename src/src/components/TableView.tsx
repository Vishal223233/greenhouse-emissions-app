import React, { useState, useMemo } from "react";
import { EmissionData } from "./GreenhouseEmissions";

interface TableViewProps {
  emissionData: EmissionData[];
  selectedCountries: string[];
}

const TableView: React.FC<TableViewProps> = ({ emissionData, selectedCountries }) => {
  const [sortColumn, setSortColumn] = useState<"country" | "year" | "value">("year");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const filteredData = useMemo(() => {
    return emissionData.filter((row) => selectedCountries.includes(row.country));
  }, [emissionData, selectedCountries]);

  const sortedData = useMemo(() => {
    return [...filteredData].sort((a, b) => {
      if (a[sortColumn] === null || b[sortColumn] === null) return 0;

      let comparison = 0;
      if (a[sortColumn] < b[sortColumn]) comparison = -1;
      else if (a[sortColumn] > b[sortColumn]) comparison = 1;

      return sortDirection === "asc" ? comparison : -comparison;
    });
  }, [filteredData, sortColumn, sortDirection]);

  const handleSort = (column: "country" | "year" | "value") => {
    if (sortColumn === column) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  return (
    <div className="mt-6 overflow-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-gray-200">
            <th className="cursor-pointer py-2 px-4" onClick={() => handleSort("country")}>
              Country {sortColumn === "country" && (sortDirection === "asc" ? "▲" : "▼")}
            </th>
            <th className="cursor-pointer py-2 px-4" onClick={() => handleSort("year")}>
              Year {sortColumn === "year" && (sortDirection === "asc" ? "▲" : "▼")}
            </th>
            <th className="cursor-pointer py-2 px-4" onClick={() => handleSort("value")}>
              Emissions (Mt CO2e){" "}
              {sortColumn === "value" && (sortDirection === "asc" ? "▲" : "▼")}
            </th>
          </tr>
        </thead>

        <tbody>
          {sortedData.map((row, idx) => (
            <tr key={`${row.country}-${row.year}-${idx}`} className="hover:bg-gray-50">
              <td className="border px-4 py-2">{row.country}</td>
              <td className="border px-4 py-2">{row.year}</td>
              <td className="border px-4 py-2">
                {row.value !== null ? row.value.toLocaleString() : "No Data"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {!filteredData.length && (
        <p className="mt-2 text-gray-600 text-center">No data for selected countries.</p>
      )}
    </div>
  );
};

export default TableView;
