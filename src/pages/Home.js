import React from 'react';
import { Link } from 'react-router-dom';
import { FaChartLine, FaCloudSun, FaMapMarkedAlt, FaLeaf } from 'react-icons/fa';

const Home = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-primary text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">AgriWeather Pro</h1>
            <p className="text-xl mb-8">
              Advanced weather analytics platform helping farmers optimize crop yields through AI-powered climate trend analysis and predictions.
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

      {/* Features Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-heading font-bold text-center mb-12">Our Services</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="card text-center hover:shadow-lg transition-shadow">
              <div className="flex justify-center mb-4">
                <FaCloudSun className="text-5xl text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Weather Forecasting</h3>
              <p className="text-gray-600">
                Highly accurate, localized weather forecasts specifically tailored for agricultural needs.
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
                Visualize weather patterns, precipitation forecasts, and temperature trends.
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
                AI-driven crop yield forecasts based on weather data and historical trends.
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
                Historical weather trend analysis to inform long-term agricultural planning.
              </p>
              <Link to="/dashboard" className="block mt-4 text-primary hover:underline">
                View Analytics
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-heading font-bold text-center mb-12">How It Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Data Collection</h3>
              <p className="text-gray-600">
                We aggregate data from multiple weather sources and satellites for the highest accuracy.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">AI Analysis</h3>
              <p className="text-gray-600">
                Our advanced algorithms analyze weather patterns and their impact on different crops.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Actionable Insights</h3>
              <p className="text-gray-600">
                Receive practical recommendations to optimize planting, irrigation, and harvesting.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonial Section */}
      <section className="py-16 bg-primary/5">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-heading font-bold text-center mb-12">What Farmers Say</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="card">
              <p className="italic mb-4">
                "AgriWeather Pro has transformed my approach to seasonal planning. The accurate forecasts have helped me optimize irrigation and planting schedules."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-primary/20 rounded-full mr-4"></div>
                <div>
                  <h4 className="font-semibold">John Deere</h4>
                  <p className="text-sm text-gray-600">Corn Farmer, Iowa</p>
                </div>
              </div>
            </div>
            
            <div className="card">
              <p className="italic mb-4">
                "The crop yield predictions are remarkably accurate. I've been able to better plan my harvests and market timing thanks to this tool."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-primary/20 rounded-full mr-4"></div>
                <div>
                  <h4 className="font-semibold">Sarah Johnson</h4>
                  <p className="text-sm text-gray-600">Wheat Farmer, Kansas</p>
                </div>
              </div>
            </div>
            
            <div className="card">
              <p className="italic mb-4">
                "I appreciate the historical weather analysis feature. It's helped me understand long-term trends on my farm and adapt my crop selection accordingly."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-primary/20 rounded-full mr-4"></div>
                <div>
                  <h4 className="font-semibold">Miguel Rodriguez</h4>
                  <p className="text-sm text-gray-600">Vineyard Owner, California</p>
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
            Start using AgriWeather Pro today and make data-driven decisions for better crop yields.
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