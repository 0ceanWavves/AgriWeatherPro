import React from 'react';
import { Link } from 'react-router-dom';
import { FaChartLine, FaDatabase, FaNetworkWired, FaChartArea, FaDna } from 'react-icons/fa';
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
  // Sample chart data for pattern analysis display
  const chartData = {
    labels: ['Q1 2023', 'Q2 2023', 'Q3 2023', 'Q4 2023', 'Q1 2024', 'Q2 2024'],
    datasets: [
      {
        label: 'Pattern Recognition Accuracy',
        data: [92.8, 94.3, 95.1, 96.0, 97.3, 97.8],
        borderColor: 'rgb(60, 165, 92)',
        backgroundColor: 'rgba(60, 165, 92, 0.5)',
        tension: 0.2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: 'Anomaly Detection Rate',
        data: [88.4, 90.2, 92.7, 94.1, 95.8, 96.5],
        borderColor: 'rgb(75, 102, 192)',
        backgroundColor: 'rgba(75, 102, 192, 0.5)',
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
            return `${context.dataset.label}: ${context.parsed.y}%`;
          }
        }
      }
    },
    scales: {
      y: {
        min: 85,
        max: 100,
        ticks: {
          callback: function(value) {
            return `${value}%`;
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
      {/* Hero Section (Data-Centric Focus) */}
      <section className="bg-primary text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">Unlock the Power of Hyper-Targeted Agricultural Data</h1>
            <p className="text-xl mb-8">
              Advanced analytics and predictive insights for diverse species, fauna, and climates.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/dashboard" className="btn-accent px-8 py-3 text-lg">
                Explore Data Solutions
              </Link>
              <Link to="/about" className="bg-white text-primary hover:bg-gray-100 px-8 py-3 rounded-md text-lg transition-colors">
                Discover Our Analytics Platform
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features (Data and Analysis Focus) */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-heading font-bold text-center mb-12">Key Features</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="card text-center hover:shadow-lg transition-shadow">
              <div className="flex justify-center mb-4">
                <FaDatabase className="text-5xl text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Comprehensive Data Aggregation</h3>
              <p className="text-gray-600">
                Multi-source data integration from sensors, satellites, and historical records.
              </p>
              <Link to="/dashboard" className="block mt-4 text-primary hover:underline">
                Explore Data Sources
              </Link>
            </div>
            
            <div className="card text-center hover:shadow-lg transition-shadow">
              <div className="flex justify-center mb-4">
                <FaChartLine className="text-5xl text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Advanced Predictive Modeling</h3>
              <p className="text-gray-600">
                AI-powered trend analysis and anomaly detection algorithms.
              </p>
              <Link to="/crop-yields" className="block mt-4 text-primary hover:underline">
                View Predictions
              </Link>
            </div>
            
            <div className="card text-center hover:shadow-lg transition-shadow">
              <div className="flex justify-center mb-4">
                <FaNetworkWired className="text-5xl text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Real-Time Environmental Monitoring</h3>
              <p className="text-gray-600">
                Live tracking of critical environmental variables across regions.
              </p>
              <Link to="/maps" className="block mt-4 text-primary hover:underline">
                Monitor Conditions
              </Link>
            </div>
            
            <div className="card text-center hover:shadow-lg transition-shadow">
              <div className="flex justify-center mb-4">
                <FaDna className="text-5xl text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Species & Climate Pattern Analysis</h3>
              <p className="text-gray-600">
                Specialized insights for diverse agricultural ecosystems and species.
              </p>
              <Link to="/dashboard" className="block mt-4 text-primary hover:underline">
                View Analysis
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Data Visualization Platform */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-heading font-bold text-center mb-4">Advanced Data Visualization Platform</h2>
          <p className="text-xl text-center mb-12 max-w-3xl mx-auto">
            Our interactive dashboards reveal insights through powerful geographic visualizations with multiple data layers.
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
                <h3 className="font-semibold mb-2">Multi-Factor Data Overlays</h3>
                <p className="text-sm">Visualize multiple data points and variables simultaneously</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold mb-2">Anomaly Detection</h3>
                <p className="text-sm">Identify environmental pattern deviations and outliers</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold mb-2">Cross-Species Analysis</h3>
                <p className="text-sm">Compare environmental impacts across diverse species</p>
              </div>
            </div>
            
            <div className="text-center">
              <Link to="/maps" className="inline-block bg-primary text-white hover:bg-primary/90 px-6 py-2 rounded-md transition-colors">
                Explore Data Visualization Platform
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Predictive Analytics Section */}
      <section className="py-16 bg-primary/5">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-heading font-bold text-center mb-4">Predictive Analytics & Trend Analysis</h2>
          <p className="text-xl text-center mb-12 max-w-3xl mx-auto">
            Our AI algorithms identify patterns and predict outcomes across diverse agricultural variables with industry-leading accuracy.
          </p>
          
          <div className="bg-white p-6 rounded-lg shadow-md max-w-5xl mx-auto">
            <div className="h-80 w-full mb-6">
              <Line data={chartData} options={chartOptions} />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-primary/10 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Pattern Recognition</h3>
                <div className="flex items-center mb-2">
                  <span className="text-2xl font-bold">97.3<span className="text-sm font-normal">% accuracy</span></span>
                </div>
                <p className="text-sm text-gray-600">
                  AI-driven pattern identification across species
                </p>
              </div>
              
              <div className="bg-primary/10 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Predictive Modeling</h3>
                <div className="flex items-center mb-2">
                  <span className="text-2xl font-bold">96.1<span className="text-sm font-normal">% confidence</span></span>
                </div>
                <p className="text-sm text-gray-600">
                  Multi-factor variable analysis and forecasting
                </p>
              </div>
              
              <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-500">
                <h3 className="text-lg font-semibold mb-2">Anomaly Detection</h3>
                <p className="text-sm mb-2">Early Warning System (Response Time: 24-48h)</p>
                <p className="text-xs text-gray-600">
                  Identifying environmental deviations before visible impact
                </p>
              </div>
            </div>
            
            <div className="text-center">
              <Link to="/crop-yields" className="inline-block bg-primary text-white hover:bg-primary/90 px-6 py-2 rounded-md transition-colors">
                Explore Analytics Capabilities
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonial Section - Research Focus */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-heading font-bold text-center mb-8">What Our Partners Say</h2>
          
          <div className="max-w-3xl mx-auto">
            <div className="card text-center">
              <p className="italic mb-6 text-lg">
                "This platform has revolutionized our research capabilities. The comprehensive data integration and advanced analytics have accelerated our findings, allowing us to identify previously undetectable patterns across diverse species and environmental conditions."
              </p>
              <div className="flex items-center justify-center">
                <div className="w-12 h-12 bg-primary/20 rounded-full mr-4"></div>
                <div>
                  <h4 className="font-semibold">Dr. Elena Rodriguez</h4>
                  <p className="text-sm text-gray-600">Senior Research Scientist, Agricultural Innovation Institute</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section - Data-Centric */}
      <section className="py-16 bg-accent text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-heading font-bold mb-4">Unlock the Full Potential of Your Data</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Transform complex environmental data into actionable insights across diverse species and ecosystems.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/dashboard" className="bg-white text-accent hover:bg-gray-100 px-8 py-3 rounded-md text-lg transition-colors font-semibold">
              Explore Our Analytics Platform
            </Link>
            <Link to="/about" className="border-2 border-white hover:bg-white/10 px-8 py-3 rounded-md text-lg transition-colors">
              Learn About Our Technology
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;