import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import GlobalLocationSelector from '../../components/GlobalLocationSelector';
import PestMap from '../../components/pest/PestMap';
import PestFilter from '../../components/pest/PestFilter';
import PestTable from '../../components/pest/PestTable';
import RegionalPestAlert from '../../components/pest/RegionalPestAlert';
import pestData from '../../data/pestData';
import 'leaflet/dist/leaflet.css';

const PestManagement = () => {
  const [location, setLocation] = useState({ lat: 40.7128, lng: -74.006, name: "New York", country: "USA" });
  const [weatherData, setWeatherData] = useState(null);
  const [pestRisks, setPestRisks] = useState([]);
  const [filteredPestRisks, setFilteredPestRisks] = useState([]);
  const [selectedCrop, setSelectedCrop] = useState('corn');
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  // Region-specific pests
  const [regionSpecificPests, setRegionSpecificPests] = useState([]);
  
  // Filters
  const [pestFilter, setPestFilter] = useState('all');
  const [riskLevelFilter, setRiskLevelFilter] = useState('all');
  const [riskFactorFilter, setRiskFactorFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(!isMobile);

  // Import data
  const { globalCrops, riskFactors, cropPests, regionPests } = pestData;

  // Detect mobile screen size
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (!showFilters) setShowFilters(window.innerWidth >= 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobile, showFilters]);

  // Get user's location on first load
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const apiKey = 'deeaa95f4b7b2543dc8c3d9cb96396c6';
            const geoResponse = await axios.get(
              `https://api.openweathermap.org/geo/1.0/reverse?lat=${position.coords.latitude}&lon=${position.coords.longitude}&limit=1&appid=${apiKey}`
            );
            
            if (geoResponse.data && geoResponse.data.length > 0) {
              const locationData = geoResponse.data[0];
              setLocation({
                lat: position.coords.latitude,
                lng: position.coords.longitude,
                name: locationData.name,
                country: locationData.country
              });
            }
          } catch (error) {
            console.error("Error getting location name:", error);
            setLocation({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
              name: "Current Location",
              country: ""
            });
          }
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  }, []);

  // Function to handle location changes from the global selector
  const handleLocationChange = (newLocation) => {
    setLocation({
      lat: newLocation.lat,
      lng: newLocation.lng,
      name: newLocation.name,
      country: newLocation.country
    });
  };

  // Fetch weather and calculate pest risks when location or crop changes
  useEffect(() => {
    const fetchWeatherData = async () => {
      setLoading(true);
      try {
        const apiKey = 'deeaa95f4b7b2543dc8c3d9cb96396c6';
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/onecall?lat=${location.lat}&lon=${location.lng}&exclude=minutely,alerts&units=imperial&appid=${apiKey}`
        );
        setWeatherData(response.data);
        
        // Calculate pest risks based on weather conditions
        calculatePestRisks(response.data, selectedCrop);

        // Check if we have region-specific pest data
        checkRegionalPests();
      } catch (error) {
        console.error("Error fetching weather data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherData();
  }, [location, selectedCrop]);
  
  // Check for region-specific pests
  const checkRegionalPests = () => {
    if (location.country && regionPests[location.country]) {
      // Try city match
      if (regionPests[location.country][location.name]) {
        setRegionSpecificPests(regionPests[location.country][location.name]);
      } 
      // Check for California locations
      else if (location.country === "US" && 
              (location.name === "Los Angeles" || 
               location.name === "San Francisco" || 
               location.name === "San Diego" || 
               location.name === "Sacramento" || 
               location.name === "Fresno")) {
        setRegionSpecificPests(regionPests["US"]["California"]);
      }
      // Default to empty array if no match
      else {
        setRegionSpecificPests([]);
      }
    } else {
      setRegionSpecificPests([]);
    }
  };

  // Calculate pest risks based on weather conditions
  const calculatePestRisks = (weather, crop) => {
    if (!weather || !cropPests[crop]) return;

    const currentTemp = weather.current.temp;
    const humidity = weather.current.humidity;
    const rainfall = weather.daily.slice(0, 7).reduce((sum, day) => sum + (day.rain ? day.rain : 0), 0);
    
    // Calculate risk levels for each pest based on current conditions
    const risks = cropPests[crop].map(pest => {
      let riskLevel = 'Low';
      let riskScore = 0;
      
      // Temperature factor
      if (currentTemp > 80) riskScore += 3;
      else if (currentTemp > 70) riskScore += 2;
      else if (currentTemp > 60) riskScore += 1;
      
      // Humidity factor
      if (humidity > 80) riskScore += 3;
      else if (humidity > 60) riskScore += 2;
      else if (humidity > 40) riskScore += 1;
      
      // Rainfall factor
      if (rainfall < 0.5) riskScore += 2; // Dry conditions often favor certain pests
      else if (rainfall > 3) riskScore += 2; // Heavy rain can favor fungal diseases
      
      // Determine risk level based on score
      if (riskScore >= 6) riskLevel = 'High';
      else if (riskScore >= 4) riskLevel = 'Medium';
      
      // Generate random coordinates near the user's location for visualization
      const randomLat = location.lat + (Math.random() - 0.5) * 0.05;
      const randomLng = location.lng + (Math.random() - 0.5) * 0.05;
      
      return {
        ...pest,
        riskLevel,
        riskScore,
        location: { lat: randomLat, lng: randomLng }
      };
    });
    
    setPestRisks(risks);
    applyFilters(risks); // Apply filters immediately to the new data
  };

  // Apply filters to the pest risks
  const applyFilters = (currentPestRisks) => {
    if (!currentPestRisks) return;
    
    let filtered = [...currentPestRisks];
    
    // Apply risk level filter
    if (riskLevelFilter !== 'all') {
      filtered = filtered.filter(pest => pest.riskLevel === riskLevelFilter);
    }
    
    // Apply pest filter
    if (pestFilter !== 'all') {
      filtered = filtered.filter(pest => pest.name === pestFilter);
    }
    
    // Apply risk factor filter
    if (riskFactorFilter !== 'all') {
      filtered = filtered.filter(pest => 
        pest.riskFactors.some(factor => 
          factor.toLowerCase().includes(riskFactorFilter.toLowerCase())
        )
      );
    }
    
    setFilteredPestRisks(filtered);
  };

  // Apply filters when any filter changes
  useEffect(() => {
    applyFilters(pestRisks);
  }, [riskLevelFilter, pestFilter, riskFactorFilter, pestRisks]);

  // Handle crop selection
  const handleCropChange = (crop) => {
    setSelectedCrop(crop);
    setPestFilter('all');
    setRiskLevelFilter('all');
    setRiskFactorFilter('all');
  };

  return (
    <div className="bg-gradient-to-b from-green-50 to-green-100 min-h-screen py-4 md:py-8">
      <div className="container mx-auto px-2 md:px-4">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-green-700 to-green-600 p-4 md:p-6">
            <h1 className="text-2xl md:text-3xl font-bold text-white">Pest Management</h1>
            <p className="text-green-100 mt-2 text-sm md:text-base">
              Monitor and manage pest risks based on real-time weather conditions and crop selection worldwide
            </p>
          </div>
          
          <div className="p-3 md:p-6">
            {/* NEW: Regional Database Quick Access */}
            <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link 
                to="/services/california-pests"
                className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-center shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 mr-4 bg-blue-100 rounded-full flex items-center justify-center text-blue-700">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-blue-800">California Pest Database</h3>
                  <p className="text-sm text-gray-600">Specialized information for almond, grape, tomato, lettuce, and strawberry pests</p>
                </div>
              </Link>
              
              <Link 
                to="/services/mena-pests"
                className="p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-center shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 mr-4 bg-amber-100 rounded-full flex items-center justify-center text-amber-700">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-amber-800">MENA Date Palm Pest Database</h3>
                  <p className="text-sm text-gray-600">Focused information for date palm pests in Middle East & North Africa</p>
                </div>
              </Link>
            </div>
            
            {/* Mobile Toggle for Filters */}
            {isMobile && (
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className="w-full mb-4 py-2 px-4 bg-green-100 text-green-800 rounded-md flex justify-between items-center"
              >
                <span className="font-medium">{showFilters ? 'Hide Filters' : 'Show Filters'}</span>
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transition-transform ${showFilters ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            )}
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
              {/* Left Column - Location Selection, Crop Selection & Filters */}
              <div className={`lg:col-span-1 ${isMobile && !showFilters ? 'hidden' : 'block'}`}>
                {/* Global Location Selector */}
                <div className="bg-white rounded-lg p-3 md:p-4 border border-green-200 mb-4">
                  <GlobalLocationSelector 
                    onLocationSelect={handleLocationChange}
                    currentLocation={location}
                  />
                </div>
              
                <div className="bg-green-50 rounded-lg p-3 md:p-4 border border-green-200 mb-4">
                  <h2 className="text-lg md:text-xl font-semibold text-green-800 mb-3 md:mb-4">Select Your Crop</h2>
                  <div className="relative">
                    <select 
                      className="w-full p-2 border border-green-300 rounded-md bg-white text-green-800"
                      value={selectedCrop}
                      onChange={(e) => handleCropChange(e.target.value)}
                    >
                      {globalCrops.map(crop => (
                        <option key={crop} value={crop}>
                          {crop.charAt(0).toUpperCase() + crop.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Pest Filter Component */}
                <PestFilter 
                  pestFilter={pestFilter}
                  riskLevelFilter={riskLevelFilter}
                  riskFactorFilter={riskFactorFilter}
                  setPestFilter={setPestFilter}
                  setRiskLevelFilter={setRiskLevelFilter}
                  setRiskFactorFilter={setRiskFactorFilter}
                  cropPests={cropPests}
                  selectedCrop={selectedCrop}
                  riskFactors={riskFactors}
                />
                
                {weatherData && (
                  <div className="bg-white rounded-lg p-3 md:p-4 border border-green-200">
                    <h3 className="font-semibold text-green-800 mb-2">Current Weather in {location.name}</h3>
                    <div className="text-xs md:text-sm space-y-2">
                      <div className="flex justify-between items-center">
                        <span>Temperature:</span>
                        <span className="font-medium">{Math.round(weatherData.current.temp)}°F</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Humidity:</span>
                        <span className="font-medium">{weatherData.current.humidity}%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Wind:</span>
                        <span className="font-medium">{Math.round(weatherData.current.wind_speed)} mph</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Conditions:</span>
                        <span className="font-medium">{weatherData.current.weather[0].description}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Right Columns - Map & Risk Info */}
              <div className={`lg:col-span-2 ${isMobile && showFilters ? 'mt-4' : 'mt-0'}`}>
                {/* Pest Map Component */}
                <PestMap 
                  location={location}
                  filteredPestRisks={filteredPestRisks}
                  loading={loading}
                />
                
                {/* Pest Table Component */}
                <PestTable 
                  filteredPestRisks={filteredPestRisks}
                  pestRisks={pestRisks}
                  location={location}
                  selectedCrop={selectedCrop}
                  riskFactorFilter={riskFactorFilter}
                />
              </div>
            </div>
            
            {/* Region-Specific Pest Information */}
            {regionSpecificPests.length > 0 && (
              <div className="mt-8 bg-yellow-50 rounded-lg border border-yellow-200 p-6">
                <h2 className="text-xl font-semibold text-yellow-800 mb-4">
                  {location.name ? `Local Pest Alerts for ${location.name}` : 'Local Pest Alerts'}
                </h2>
                
                <div className="space-y-4">
                  {regionSpecificPests.map((pest, index) => (
                    <RegionalPestAlert key={index} pest={pest} />
                  ))}
                </div>
              </div>
            )}

            {/* Sustainable Practices Section */}
            <div className="mt-8 bg-green-50 rounded-lg border border-green-200 p-4 md:p-6">
              <h2 className="text-lg md:text-xl font-semibold text-green-800 mb-3 md:mb-4">
                Sustainable Pest Management Strategies
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                <div className="bg-white rounded-lg p-3 md:p-4 border border-green-200">
                  <h3 className="font-semibold text-green-700">Beneficial Insects</h3>
                  <p className="mt-2 text-xs md:text-sm text-gray-600">
                    Introduce ladybugs, lacewings, and predatory mites to naturally control pest populations without chemicals.
                  </p>
                </div>
                
                <div className="bg-white rounded-lg p-3 md:p-4 border border-green-200">
                  <h3 className="font-semibold text-green-700">Crop Rotation</h3>
                  <p className="mt-2 text-xs md:text-sm text-gray-600">
                    Disrupt pest life cycles by rotating crops annually. This prevents pest populations from becoming established.
                  </p>
                </div>
                
                <div className="bg-white rounded-lg p-3 md:p-4 border border-green-200">
                  <h3 className="font-semibold text-green-700">Companion Planting</h3>
                  <p className="mt-2 text-xs md:text-sm text-gray-600">
                    Plant pest-repelling herbs and flowers alongside crops to naturally deter common agricultural pests.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PestManagement;