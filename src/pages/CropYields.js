import React from 'react';
import CropYieldDisplay from '../components/CropYieldDisplay';

const CropYields = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-heading font-bold mb-4">Crop Yield Forecasts</h1>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Use our AI-powered crop yield predictions to make data-driven decisions about planting, resource allocation, 
            and harvest planning. Our models analyze weather patterns, soil conditions, and historical data to provide 
            accurate yield forecasts.
          </p>
        </div>
        
        <CropYieldDisplay />
        
        <div className="mt-12 bg-primary/5 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">How Our Crop Yield Predictions Work</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="bg-primary/20 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <span className="text-xl font-bold text-primary">1</span>
              </div>
              <h4 className="font-semibold mb-2">Data Collection</h4>
              <p>
                We gather historical weather data, soil information, crop performance statistics, and current weather conditions.
              </p>
            </div>
            
            <div>
              <div className="bg-primary/20 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <span className="text-xl font-bold text-primary">2</span>
              </div>
              <h4 className="font-semibold mb-2">AI Analysis</h4>
              <p>
                Our machine learning algorithms analyze the relationship between environmental factors and crop performance.
              </p>
            </div>
            
            <div>
              <div className="bg-primary/20 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <span className="text-xl font-bold text-primary">3</span>
              </div>
              <h4 className="font-semibold mb-2">Predictive Modeling</h4>
              <p>
                We generate yield predictions with confidence levels and risk assessments to help you make informed decisions.
              </p>
            </div>
          </div>
        </div>
        
        <div className="mt-8 p-4 border-l-4 border-yellow-500 bg-yellow-50">
          <h3 className="font-semibold mb-2">Important Note</h3>
          <p>
            Yield predictions are based on current data and historical trends. Actual results may vary due to unforeseen weather events, pest outbreaks, or management practices. We recommend using these forecasts as one tool in your overall farm management strategy.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CropYields;