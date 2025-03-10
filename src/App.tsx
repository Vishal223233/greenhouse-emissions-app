import React from "react";
import GreenhouseEmissions from "./src/components/GreenhouseEmissions";

function App() {
  return (
    <div className="min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">
        Greenhouse Gas Emissions Dashboard
      </h1>
      <GreenhouseEmissions />
    </div>
  );
}

export default App;
