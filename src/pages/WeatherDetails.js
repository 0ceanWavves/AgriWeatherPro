import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import WeatherForecast from '../components/WeatherForecast';
import BackButton from '../components/BackButton';

/**
 * WeatherDetails page component that displays detailed weather information for a specific location
 */
const WeatherDetails = () => {
  const { locationId } = useParams();
  const navigate = useNavigate();
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // In a real app, we would fetch location data based on locationId
    // For now, we'll use mock data
    const fetchLocationData = async () => {
      try {
        setLoading(true);
        // Simulate API call
        const mockLocation = {
          id: locationId,
          name: 'Sample Location',
          country: 'Country',
          lat: 51.5074,
          lon: -0.1278,
        };
        
        setTimeout(() => {
          setLocation(mockLocation);
          setLoading(false);
        }, 500);
      } catch (err) {
        console.error('Error fetching location data:', err);
        setError('Failed to load location data. Please try again.');
        setLoading(false);
      }
    };

    if (locationId) {
      fetchLocationData();
    } else {
      setError('No location ID provided');
      setLoading(false);
    }
  }, [locationId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-6">
        <BackButton onClick={() => navigate(-1)} />
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mt-4">
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="weather-details-page container mx-auto px-4 py-6">
      <BackButton onClick={() => navigate(-1)} />
      
      {location && (
        <>
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800">
              {location.name}, {location.country}
            </h1>
            <p className="text-gray-600 text-sm">
              Coordinates: {location.lat}, {location.lon}
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <WeatherForecast location={location} />
          </div>
        </>
      )}
    </div>
  );
};

export default WeatherDetails; 