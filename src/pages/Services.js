import React from 'react';
import { Link } from 'react-router-dom';
import { FaBug, FaWater, FaLeaf, FaSeedling, FaCloudSun, FaChartLine, FaInfoCircle, FaDatabase } from 'react-icons/fa';

const Services = () => {
  // Service card data for rendering
  const services = [
    {
      id: 'pest-management',
      title: 'Pest Management',
      description: 'Advanced pest tracking, prediction, and management solutions for various crops and regions.',
      icon: <FaBug className="text-4xl text-primary mb-4" />,
      path: '/services/pest-management',
      color: 'bg-green-50',
      highlight: true,
      features: [
        'Real-time pest pressure mapping',
        'Species-specific management recommendations',
        'Climate-based outbreak predictions',
        'Regional pest databases'
      ],
      subServices: [
        { name: 'California Pest Database', path: '/services/california-pest' },
        { name: 'MENA Date Palm Pests', path: '/services/mena-pest' },
        { name: 'Southeast Asia Rice Pests', path: '/services/asia-rice-pest', new: true }
      ]
    },
    {
      id: 'irrigation-planning',
      title: 'Irrigation Planning',
      description: 'Data-driven irrigation scheduling and water management based on weather, soil, and crop requirements.',
      icon: <FaWater className="text-4xl text-primary mb-4" />,
      path: '/services/irrigation-planning',
      color: 'bg-blue-50',
      features: [
        'Soil moisture analysis and mapping',
        'Weather-based irrigation scheduling',
        'Water usage optimization',
        'Drought stress prediction'
      ]
    },
    {
      id: 'crop-prediction',
      title: 'Crop Yield Prediction',
      description: 'AI-powered crop yield forecasting using historical data, weather patterns, and growing conditions.',
      icon: <FaLeaf className="text-4xl text-primary mb-4" />,
      path: '/crop-yields',
      color: 'bg-yellow-50',
      features: [
        'Multi-factor yield modeling',
        'Harvest timing optimization',
        'Year-over-year performance analysis',
        'Climate impact assessments'
      ]
    },
    {
      id: 'climate-analysis',
      title: 'Climate Analysis & Trends',
      description: 'Comprehensive climate data analysis and long-term trend identification for agricultural planning.',
      icon: <FaCloudSun className="text-4xl text-primary mb-4" />,
      path: '/climate-analysis',
      color: 'bg-purple-50',
      features: [
        'Historical weather pattern analysis',
        'Climate change impact modeling',
        'Growing season trend identification',
        'Regional microclimate mapping'
      ]
    },
    {
      id: 'weather-forecast',
      title: 'Weather Forecasting',
      description: 'Hyperlocal weather forecasting tailored specifically for agricultural decision-making.',
      icon: <FaCloudSun className="text-4xl text-primary mb-4" />,
      path: '/forecast',
      color: 'bg-indigo-50',
      features: [
        'Hyperlocal field-level forecasts',
        'Frost and heat stress alerts',
        'Precipitation probability analysis',
        'Growing degree day tracking'
      ]
    },
    {
      id: 'data-visualization',
      title: 'Data Visualization',
      description: 'Interactive map-based visualization of agricultural and environmental data layers.',
      icon: <FaChartLine className="text-4xl text-primary mb-4" />,
      path: '/maps',
      color: 'bg-red-50',
      features: [
        'Multi-layer geographic visualization',
        'Time-series data animation',
        'Custom data overlay creation',
        'Cross-variable comparison tools'
      ]
    }
  ];

  return (
    <div className="py-8 px-4">
      {/* Hero section */}
      <section className="text-center max-w-4xl mx-auto mb-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Agricultural Data Services</h1>
        <p className="text-xl text-gray-600 mb-6">
          Unlock the power of data-driven agriculture with our comprehensive suite of specialized services.
        </p>
        <div className="flex justify-center space-x-4">
          <Link 
            to="/dashboard" 
            className="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary/90 transition-colors"
          >
            Go to Dashboard
          </Link>
          <Link 
            to="/about" 
            className="bg-white border border-gray-300 px-6 py-2 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Learn More
          </Link>
        </div>
      </section>

      {/* Services grid */}
      <section className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <div 
              key={service.id}
              className={`rounded-lg p-6 shadow-md transition-all duration-300 hover:shadow-lg ${service.color} ${service.highlight ? 'ring-2 ring-primary ring-offset-2' : ''}`}
            >
              <div className="text-center mb-4">
                {service.icon}
                <h3 className="text-2xl font-semibold text-gray-800">{service.title}</h3>
              </div>
              
              <p className="text-gray-600 mb-6">{service.description}</p>
              
              <ul className="mb-6 space-y-2">
                {service.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <FaInfoCircle className="text-primary mt-1 mr-2 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
              
              {/* Main service link */}
              <Link 
                to={service.path}
                className="block w-full bg-primary text-white text-center py-2 rounded-md hover:bg-primary/90 transition-colors mb-3"
              >
                Access {service.title}
              </Link>
              
              {/* Sub-services if available */}
              {service.subServices && service.subServices.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">Specialized Services:</p>
                  {service.subServices.map((subService, index) => (
                    <Link 
                      key={index}
                      to={subService.path}
                      className="block w-full bg-white border border-primary text-primary text-center py-1.5 rounded-md hover:bg-primary/5 transition-colors text-sm relative"
                    >
                      {subService.name}
                      {subService.new && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                          NEW
                        </span>
                      )}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Data integration section */}
      <section className="max-w-6xl mx-auto mt-16 bg-primary/5 p-8 rounded-lg">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-6 md:mb-0 md:pr-8">
            <FaDatabase className="text-5xl text-primary mb-4" />
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Unified Data Platform</h2>
            <p className="text-gray-600 mb-4">
              Our services are built on a comprehensive agricultural data platform that integrates weather, soil, crop, and pest information from multiple sources.
            </p>
            <ul className="space-y-2">
              <li className="flex items-start">
                <FaInfoCircle className="text-primary mt-1 mr-2 flex-shrink-0" />
                <span className="text-gray-700">Multiple data sources integrated into a single platform</span>
              </li>
              <li className="flex items-start">
                <FaInfoCircle className="text-primary mt-1 mr-2 flex-shrink-0" />
                <span className="text-gray-700">Historical and real-time data analysis</span>
              </li>
              <li className="flex items-start">
                <FaInfoCircle className="text-primary mt-1 mr-2 flex-shrink-0" />
                <span className="text-gray-700">AI-powered predictive analytics</span>
              </li>
              <li className="flex items-start">
                <FaInfoCircle className="text-primary mt-1 mr-2 flex-shrink-0" />
                <span className="text-gray-700">Custom visualization and reporting tools</span>
              </li>
            </ul>
          </div>
          <div className="md:w-1/2">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h3 className="font-semibold text-gray-800 mb-2">Weather Data</h3>
                <p className="text-sm text-gray-600">Real-time and historical weather data from multiple sources</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h3 className="font-semibold text-gray-800 mb-2">Soil Information</h3>
                <p className="text-sm text-gray-600">Detailed soil composition and moisture data</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h3 className="font-semibold text-gray-800 mb-2">Crop Databases</h3>
                <p className="text-sm text-gray-600">Extensive crop variety and growth stage information</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h3 className="font-semibold text-gray-800 mb-2">Pest Libraries</h3>
                <p className="text-sm text-gray-600">Comprehensive pest identification and management resources</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="text-center max-w-4xl mx-auto mt-16 mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Ready to Optimize Your Agricultural Operations?</h2>
        <p className="text-lg text-gray-600 mb-8">
          Discover how our data-driven services can help you increase yields, reduce resource usage, and make better farming decisions.
        </p>
        <Link 
          to="/dashboard" 
          className="bg-accent text-white px-8 py-3 rounded-md hover:bg-accent/90 transition-colors text-lg"
        >
          Access Your Dashboard
        </Link>
      </section>
    </div>
  );
};

export default Services;