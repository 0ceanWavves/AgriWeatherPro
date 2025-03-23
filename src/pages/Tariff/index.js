import React from 'react';
import TariffPanel from '../../components/Tariff/TariffPanel';

const TariffPage = () => {
  return (
    <div className="tariff-page">
      <h1 className="text-3xl font-bold mb-6">Tariff</h1>
      <p className="text-gray-600 mb-8">
        View our tariff options for AgriWeather Pro services.
      </p>
      
      <TariffPanel />
    </div>
  );
};

export default TariffPage;