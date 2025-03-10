import React from "react";
import Select from "react-select";

interface CountryOption {
  label: string;
  value: string;
}

interface FiltersProps {
  countryOptions: CountryOption[];
  selectedCountries: string[];
  onSelectCountries: (countries: string[]) => void;
  startYear: number;
  endYear: number;
  onChangeStartYear: (year: number) => void;
  onChangeEndYear: (year: number) => void;
}

const Filters: React.FC<FiltersProps> = ({
  countryOptions,
  selectedCountries,
  onSelectCountries,
  startYear,
  endYear,
  onChangeStartYear,
  onChangeEndYear,
}) => {
  const selectedOptions = countryOptions.filter((opt) =>
    selectedCountries.includes(opt.value)
  );

  const handleCountryChange = (options: any) => {
    const values = options ? options.map((o: any) => o.value) : [];
    onSelectCountries(values);
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
      <div className="w-full md:w-1/2 mb-2 md:mb-0">
        <label className="block mb-1 font-medium">Select Countries</label>
        <Select
          isMulti
          options={countryOptions}
          value={selectedOptions}
          onChange={handleCountryChange}
          className="text-black"
          placeholder="Choose countries..."
        />
      </div>

      <div className="w-full md:w-1/2 flex space-x-2 items-center mt-2 md:mt-0">
        <div className="flex flex-col">
          <label className="block mb-1 font-medium">Start Year</label>
          <input
            type="number"
            min={1972}
            max={2022}
            value={startYear}
            onChange={(e) => onChangeStartYear(Number(e.target.value))}
            className="border p-1 rounded w-24"
          />
        </div>
        <span className="mt-5">—</span>
        <div className="flex flex-col">
          <label className="block mb-1 font-medium">End Year</label>
          <input
            type="number"
            min={1972}
            max={2022}
            value={endYear}
            onChange={(e) => onChangeEndYear(Number(e.target.value))}
            className="border p-1 rounded w-24"
          />
        </div>
      </div>
    </div>
  );
};

export default Filters;
