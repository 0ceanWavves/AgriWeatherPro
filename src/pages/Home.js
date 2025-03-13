import React from 'react';
import { Link } from 'react-router-dom';
import { FaChartLine, FaCloudSun, FaMapMarkedAlt, FaLeaf } from 'react-icons/fa';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// Fix for Leaflet icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom marker icon
const cityIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const Home = () => {
  // Sample chart data for crop yield display
  const chartData = {
    labels: ['2019', '2020', '2021', '2022', '2023', '2024'],
    datasets: [
      {
        label: 'Corn Yield',
        data: [172, 181, 174, 188, 193, 201],
        borderColor: 'rgb(60, 165, 92)',
        backgroundColor: 'rgba(60, 165, 92, 0.5)',
        tension: 0.2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };
  
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `Yield: ${context.parsed.y} bu/acre`;
          }
        }
      }
    },
    scales: {
      y: {
        ticks: {
          callback: function(value) {
            return `${value} bu`;
          }
        }
      }
    }
  };

  // Sample cities for the weather map
  const cities = [
    { name: 'London', position: [51.505, -0.09], temp: -8.8 },
    { name: 'Liverpool', position: [53.4084, -2.9916], temp: 5 },
    { name: 'Norwich', position: [52.6309, 1.2974], temp: 6 },
    { name: 'Alkmaar', position: [52.6324, 4.7534], temp: 8 },
    { name: 'Waterford', position: [52.2593, -7.1101], temp: 5 },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-primary text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">AgriWeather Pro</h1>
            <p className="text-xl mb-8">
              Advanced weather analytics helping farmers optimize crop yields through AI-powered climate analysis.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/forecast" className="btn-accent px-8 py-3 text-lg">
                View Forecast
              </Link>
              <Link to="/dashboard" className="bg-white text-primary hover:bg-gray-100 px-8 py-3 rounded-md text-lg transition-colors">
                Explore Dashboard
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Core Services Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-heading font-bold text-center mb-12">Our Core Services</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="card text-center hover:shadow-lg transition-shadow">
              <div className="flex justify-center mb-4">
                <FaCloudSun className="text-5xl text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Weather Forecasting</h3>
              <p className="text-gray-600">
                Localized weather forecasts for agricultural needs.
              </p>
              <Link to="/forecast" className="block mt-4 text-primary hover:underline">
                View Forecast
              </Link>
            </div>
            
            <div className="card text-center hover:shadow-lg transition-shadow">
              <div className="flex justify-center mb-4">
                <FaMapMarkedAlt className="text-5xl text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Interactive Maps</h3>
              <p className="text-gray-600">
                Visualize weather patterns and temperature trends.
              </p>
              <Link to="/maps" className="block mt-4 text-primary hover:underline">
                Explore Maps
              </Link>
            </div>
            
            <div className="card text-center hover:shadow-lg transition-shadow">
              <div className="flex justify-center mb-4">
                <FaLeaf className="text-5xl text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Crop Yield Predictions</h3>
              <p className="text-gray-600">
                AI-driven crop yield forecasts based on weather data.
              </p>
              <Link to="/crop-yields" className="block mt-4 text-primary hover:underline">
                View Predictions
              </Link>
            </div>
            
            <div className="card text-center hover:shadow-lg transition-shadow">
              <div className="flex justify-center mb-4">
                <FaChartLine className="text-5xl text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Climate Analytics</h3>
              <p className="text-gray-600">
                Historical weather trend analysis for agricultural planning.
              </p>
              <Link to="/dashboard" className="block mt-4 text-primary hover:underline">
                View Analytics
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Weather Map Visualization */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-heading font-bold text-center mb-4">Interactive Weather Map</h2>
          <p className="text-xl text-center mb-12 max-w-3xl mx-auto">
            Our dashboard features real-time weather maps with multiple data layers and location-specific details.
          </p>
          
          <div className="bg-white p-6 rounded-lg shadow-md max-w-5xl mx-auto">
            <div className="h-96 w-full mb-6 rounded overflow-hidden">
              <MapContainer 
                center={[51.505, -0.09]} 
                zoom={5} 
                style={{ height: '100%', width: '100%' }}
                zoomControl={false}
              >
                {/* Dark theme map tiles */}
                <TileLayer
                  attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
                  url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                />
                
                {/* City markers */}
                {cities.map((city, index) => (
                  <Marker 
                    key={index} 
                    position={city.position} 
                    icon={cityIcon}
                  >
                    <Popup>
                      <div className="city-popup">
                        <h3>{city.name}</h3>
                        <p>{city.temp}°C</p>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold mb-2">Temperature Overlay</h3>
                <p className="text-sm">View real-time temperature patterns across regions</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold mb-2">Precipitation Radar</h3>
                <p className="text-sm">Track rainfall and precipitation forecasts</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold mb-2">Wind Patterns</h3>
                <p className="text-sm">Monitor wind direction and speed changes</p>
              </div>
            </div>
            
            <div className="text-center">
              <Link to="/maps" className="inline-block bg-primary text-white hover:bg-primary/90 px-6 py-2 rounded-md transition-colors">
                Explore Full Weather Map
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Crop Yield Chart Visualization */}
      <section className="py-16 bg-primary/5">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-heading font-bold text-center mb-4">Crop Yield Predictions</h2>
          <p className="text-xl text-center mb-12 max-w-3xl mx-auto">
            Our AI models analyze weather patterns and historical data to forecast crop yields with high accuracy.
          </p>
          
          <div className="bg-white p-6 rounded-lg shadow-md max-w-5xl mx-auto">
            <div className="h-80 w-full mb-6">
              <Line data={chartData} options={chartOptions} />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-primary/10 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Current Yield</h3>
                <div className="flex items-center mb-2">
                  <span className="text-2xl font-bold">193 <span className="text-sm font-normal">bu/acre</span></span>
                </div>
                <p className="text-sm text-gray-600">
                  Up 2.7% from previous year
                </p>
              </div>
              
              <div className="bg-primary/10 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Forecast Yield</h3>
                <div className="flex items-center mb-2">
                  <span className="text-2xl font-bold">201 <span className="text-sm font-normal">bu/acre</span></span>
                </div>
                <p className="text-sm text-gray-600">
                  Expected 4.1% increase from current
                </p>
              </div>
              
              <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-500">
                <h3 className="text-lg font-semibold mb-2">Primary Risk Factor</h3>
                <p className="text-sm mb-2">Precipitation Variability (Risk: Medium)</p>
                <p className="text-xs text-gray-600">
                  Monitor rainfall patterns to optimize irrigation scheduling
                </p>
              </div>
            </div>
            
            <div className="text-center">
              <Link to="/crop-yields" className="inline-block bg-primary text-white hover:bg-primary/90 px-6 py-2 rounded-md transition-colors">
                View Detailed Crop Analysis
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonial Section - Reduced to one key testimonial */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-heading font-bold text-center mb-8">What Farmers Say</h2>
          
          <div className="max-w-3xl mx-auto">
            <div className="card text-center">
              <p className="italic mb-6 text-lg">
                "AgriWeather Pro transformed our farm operations. The accurate forecasts and yield predictions have increased our productivity by 18% while reducing resource waste. The interactive maps help us make precise decisions for each field."
              </p>
              <div className="flex items-center justify-center">
                <div className="w-12 h-12 bg-primary/20 rounded-full mr-4"></div>
                <div>
                  <h4 className="font-semibold">John Deere</h4>
                  <p className="text-sm text-gray-600">Corn Farmer, Iowa</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-accent text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-heading font-bold mb-4">Ready to Optimize Your Farm?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Start using AgriWeather Pro today for data-driven farming decisions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/dashboard" className="bg-white text-accent hover:bg-gray-100 px-8 py-3 rounded-md text-lg transition-colors font-semibold">
              Explore Dashboard
            </Link>
            <Link to="/about" className="border-2 border-white hover:bg-white/10 px-8 py-3 rounded-md text-lg transition-colors">
              Learn More
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;