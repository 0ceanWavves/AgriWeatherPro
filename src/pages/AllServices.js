import React from 'react';
import { Link } from 'react-router-dom';
import { FaBug, FaWater, FaCloudSun, FaChartLine, FaLeaf, FaSeedling, FaTint, FaThermometerHalf, FaSun, FaWind } from 'react-icons/fa';

const AllServices = () => {
  // All available services with detailed descriptions
  const services = [
    {
      id: 'pest-management',
      title: 'Pest Management',
      description: 'Advanced pest tracking, prediction, and management solutions tailored to your specific crops and region.',
      icon: <FaBug className="text-3xl text-primary" />,
      path: '/services/pest-management',
      color: 'bg-green-50',
      highlight: true,
      features: [
        'Real-time pest pressure monitoring based on current weather conditions',
        'Species-specific management recommendations',
        'Historical pest trend analysis',
        'Climate-based outbreak predictions',
        'Customized IPM (Integrated Pest Management) strategies',
        'Region-specific pest databases and risk assessments'
      ],
      subServices: [
        { 
          name: 'California Pest Database', 
          path: '/services/california-pest',
          description: 'Comprehensive pest management data for California\'s key crops including almonds, grapes, tomatoes, lettuce, and strawberries.'
        },
        { 
          name: 'MENA Date Palm Pests', 
          path: '/services/mena-pest',
          description: 'Specialized pest information for date palm cultivation in Middle East and North Africa regions.'
        },
        { 
          name: 'Southeast Asia Rice Pests', 
          path: '/services/asia-rice-pest',
          description: 'Detailed pest management for rice cultivation in tropical Southeast Asian conditions.',
          new: true
        }
      ]
    },
    {
      id: 'irrigation-planning',
      title: 'Irrigation Planning',
      description: 'Data-driven irrigation scheduling and water management based on real-time weather, soil moisture data, and crop-specific water requirements.',
      icon: <FaWater className="text-3xl text-primary" />,
      path: '/services/irrigation-planning',
      color: 'bg-blue-50',
      features: [
        'Soil moisture monitoring and mapping',
        'Weather-based irrigation scheduling',
        'Water usage optimization and tracking',
        'Drought stress prediction and management',
        'Irrigation system efficiency analysis',
        'Evapotranspiration calculation and monitoring'
      ]
    },
    {
      id: 'crop-prediction',
      title: 'Crop Yield Prediction',
      description: 'AI-powered crop yield forecasting using historical data, weather patterns, soil conditions, and growing degree days.',
      icon: <FaLeaf className="text-3xl text-primary" />,
      path: '/crop-yields',
      color: 'bg-yellow-50',
      features: [
        'Multi-factor yield modeling with machine learning',
        'Field-level production estimates',
        'Harvest timing optimization',
        'Year-over-year performance analysis',
        'Climate impact assessments on crop production',
        'Variable rate application recommendations'
      ]
    },
    {
      id: 'climate-analysis',
      title: 'Climate Analysis & Trends',
      description: 'Comprehensive climate data analysis and long-term trend identification for agricultural planning and risk management.',
      icon: <FaCloudSun className="text-3xl text-primary" />,
      path: '/climate-analysis',
      color: 'bg-purple-50',
      features: [
        'Historical weather pattern analysis',
        'Climate change impact modeling for your specific location',
        'Growing season trend identification',
        'Extreme weather event prediction',
        'Regional microclimate mapping',
        'Multi-year climate projections'
      ]
    },
    {
      id: 'weather-forecast',
      title: 'Advanced Weather Forecasting',
      description: 'Hyperlocal weather forecasting tailored specifically for agricultural decision-making and field operations.',
      icon: <FaCloudSun className="text-3xl text-primary" />,
      path: '/forecast',
      color: 'bg-indigo-50',
      features: [
        'Hyperlocal field-level forecasts with 95% accuracy',
        'Frost and heat stress alerts with advance warning',
        'Precipitation probability analysis',
        'Growing degree day tracking and accumulation',
        'Field workability predictions',
        'Spray condition forecasting'
      ]
    },
    {
      id: 'data-visualization',
      title: 'Agricultural Data Visualization',
      description: 'Interactive map-based visualization of agricultural and environmental data layers for informed decision making.',
      icon: <FaChartLine className="text-3xl text-primary" />,
      path: '/maps',
      color: 'bg-red-50',
      features: [
        'Multi-layer geographic visualization',
        'Time-series data animation and tracking',
        'Custom data overlay creation',
        'Cross-variable comparison tools',
        'Exportable reports and insights',
        'Mobile-friendly field mapping'
      ]
    },
    {
      id: 'soil-management',
      title: 'Soil Health Monitoring',
      description: 'Comprehensive soil analysis and management recommendations to optimize soil health and crop productivity.',
      icon: <FaSeedling className="text-3xl text-primary" />,
      path: '/soil-management',
      color: 'bg-amber-50',
      features: [
        'Soil nutrient tracking and recommendations',
        'Organic matter monitoring',
        'Compaction risk assessment',
        'Soil moisture optimization',
        'Soil biodiversity evaluation',
        'Carbon sequestration tracking'
      ]
    },
    {
      id: 'drought-monitoring',
      title: 'Drought Monitoring & Management',
      description: 'Real-time drought tracking, prediction, and adaptive management strategies for water-limited conditions.',
      icon: <FaTint className="text-3xl text-primary" />,
      path: '/drought-monitoring',
      color: 'bg-orange-50',
      features: [
        'Drought index monitoring (PDSI, SPI, SPEI)',
        'Crop water stress detection',
        'Adaptive irrigation scheduling during water restrictions',
        'Drought-resistant crop variety recommendations',
        'Soil moisture conservation strategies',
        'Water allocation optimization'
      ]
    },
    {
      id: 'heat-stress',
      title: 'Heat Stress Management',
      description: 'Proactive heat stress detection and management for crops and livestock to minimize productivity losses.',
      icon: <FaThermometerHalf className="text-3xl text-primary" />,
      path: '/heat-management',
      color: 'bg-rose-50',
      features: [
        'Heat wave prediction with 7-day advance notice',
        'Crop-specific heat tolerance thresholds',
        'Livestock heat stress mitigation strategies',
        'Cooling irrigation timing recommendations',
        'Heat-resistant variety suggestions',
        'Worker safety condition monitoring'
      ]
    },
    {
      id: 'solar-resource',
      title: 'Solar Resource Assessment',
      description: 'Evaluate solar energy potential for agricultural operations and optimize renewable energy integration.',
      icon: <FaSun className="text-3xl text-primary" />,
      path: '/solar-assessment',
      color: 'bg-sky-50',
      features: [
        'Site-specific solar radiation analysis',
        'Agrivoltaic potential assessment',
        'Seasonal and annual energy production estimates',
        'Optimal panel placement recommendations',
        'Financial return calculation',
        'Integration with irrigation pumping systems'
      ]
    },
    {
      id: 'wind-resource',
      title: 'Wind Resource Evaluation',
      description: 'Analyze wind patterns for agricultural applications from frost protection to renewable energy generation.',
      icon: <FaWind className="text-3xl text-primary" />,
      path: '/wind-assessment',
      color: 'bg-teal-50',
      features: [
        'Local wind pattern analysis',
        'Frost fan placement optimization',
        'Wind break design recommendations',
        'Small-scale wind energy potential assessment',
        'Crop damage risk evaluation',
        'Pollination and pest dispersal modeling'
      ]
    }
  ];

  return (
    <div className="py-8 px-4 bg-gradient-to-b from-white to-green-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">AgriWeather Pro Services</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive agricultural weather and data services to optimize your farming operations and increase productivity.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div 
              key={service.id}
              className={`rounded-lg p-6 shadow-md hover:shadow-lg transition-all duration-300 ${service.color} ${service.highlight ? 'ring-2 ring-primary ring-offset-2' : ''}`}
            >
              <div className="flex items-center mb-4">
                <div className="mr-4">{service.icon}</div>
                <h2 className="text-2xl font-semibold text-gray-800">{service.title}</h2>
              </div>
              
              <p className="text-gray-600 mb-4">{service.description}</p>
              
              <div className="mb-5">
                <h3 className="font-medium text-gray-700 mb-2">Key Features:</h3>
                <ul className="space-y-2">
                  {service.features.slice(0, 4).map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-sm text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <Link 
                to={service.path}
                className="block w-full bg-primary text-white text-center py-2 rounded-md hover:bg-primary/90 transition-colors mb-3"
              >
                Access {service.title}
              </Link>
              
              {/* Sub-services if available */}
              {service.subServices && service.subServices.length > 0 && (
                <div className="space-y-3 mt-4">
                  <h3 className="font-medium text-gray-700">Specialized Services:</h3>
                  {service.subServices.map((subService, index) => (
                    <div key={index} className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm hover:shadow transition-shadow">
                      <Link 
                        to={subService.path}
                        className="block text-primary font-medium hover:underline mb-1 relative"
                      >
                        {subService.name}
                        {subService.new && (
                          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                            NEW
                          </span>
                        )}
                      </Link>
                      <p className="text-xs text-gray-600">{subService.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
        
        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Ready to optimize your farming operations?</h2>
          <Link 
            to="/dashboard" 
            className="inline-block bg-accent text-white px-8 py-3 rounded-md hover:bg-accent/90 transition-colors text-lg font-medium"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AllServices;