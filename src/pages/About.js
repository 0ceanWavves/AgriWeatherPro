import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaLeaf, FaChartLine, FaUsers, FaGlobe } from 'react-icons/fa';

const About = () => {
  const [paperCount, setPaperCount] = useState(513298);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setPaperCount(prevCount => prevCount + 1);
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        {/* Hero Section */}
        <div className="mb-12 text-center">
          <div className="flex justify-center mb-4">
            <FaLeaf className="text-5xl text-primary" />
          </div>
          <h1 className="text-4xl font-heading font-bold mb-4">About AgriWeather Pro</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Empowering farmers with precise weather intelligence and agricultural insights through advanced data analytics and AI.
          </p>
        </div>
        
        {/* Mission Section */}
        <div className="card mb-12">
          <h2 className="text-2xl font-heading font-bold mb-4">Our Mission</h2>
          <p className="mb-4">
            At AgriWeather Pro, we're on a mission to transform agricultural decision-making through cutting-edge weather analytics. We believe that by providing farmers with accurate, timely, and actionable weather intelligence, we can help increase crop yields, optimize resource usage, and build more sustainable farming practices.
          </p>
          <p className="mb-4">
            Founded in 2024 by a team of meteorologists, agricultural scientists, and data engineers, AgriWeather Pro combines deep domain expertise with advanced technology to create solutions that address the real-world challenges faced by farmers every day.
          </p>
          <p>
            Our commitment is to continuously innovate and improve our services, always keeping the needs of agricultural professionals at the center of everything we do.
          </p>
        </div>
        
        {/* Core Values Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-heading font-bold mb-6 text-center">Our Core Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card text-center">
              <div className="flex justify-center mb-4">
                <FaChartLine className="text-3xl text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Data-Driven Precision</h3>
              <p className="text-gray-600">
                We deliver accurate, reliable information based on rigorous analysis and advanced technology.
              </p>
            </div>
            
            <div className="card text-center">
              <div className="flex justify-center mb-4">
                <FaUsers className="text-3xl text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Farmer-Centered</h3>
              <p className="text-gray-600">
                Every feature and insight is designed with the real needs of agricultural professionals in mind.
              </p>
            </div>
            
            <div className="card text-center">
              <div className="flex justify-center mb-4">
                <FaGlobe className="text-3xl text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Sustainability Focus</h3>
              <p className="text-gray-600">
                We're committed to helping build a more sustainable agricultural future through better resource management.
              </p>
            </div>
          </div>
        </div>
        
        {/* Our Technology Section */}
        <div className="card mb-12">
          <h2 className="text-2xl font-heading font-bold mb-4">Our Technology</h2>
          <p className="mb-4">
            AgriWeather Pro leverages multiple weather data sources, satellite imagery, IoT sensor networks, and historical climate records to provide the most comprehensive weather intelligence possible. Our proprietary algorithms and machine learning models analyze this data to generate predictions and insights specific to agricultural applications.
          </p>
          <p className="mb-4">
            Key technological features include:
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>Multi-source weather data integration for improved accuracy</li>
            <li>Field-level precision forecasting</li>
            <li>AI-powered crop yield prediction models</li>
            <li>Historical climate trend analysis</li>
            <li>Real-time weather monitoring and alerts</li>
            <li>Interactive visualization tools</li>
          </ul>
          <p className="mb-4">
            We continually refine our models and algorithms to improve accuracy and provide even more valuable insights to our users.
          </p>
          
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 mt-6">
            <h3 className="text-lg font-semibold mb-3">Research Paper Database</h3>
            <p className="mb-4">
              Our platform is backed by an extensive collection of openly sourced and paid research papers from agricultural institutions around the world. These region-specific studies inform our predictive models and ensure our recommendations are based on the latest scientific findings.
            </p>
            <div className="flex items-center justify-center">
              <div className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Papers in our database:</p>
                <div className="text-3xl font-bold text-primary animate-pulse">
                  {paperCount.toLocaleString()}
                </div>
                <p className="text-xs text-gray-500 mt-2">...and growing every day</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* CTA Section */}
        <div className="bg-primary text-white rounded-lg p-8 text-center">
          <h2 className="text-2xl font-heading font-bold mb-4">Start Using AgriWeather Pro Today</h2>
          <p className="mb-6 max-w-2xl mx-auto">
            Join farmers worldwide who are making better decisions with our advanced weather analytics platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/dashboard" className="bg-white text-primary hover:bg-gray-100 px-8 py-3 rounded-md transition-colors font-semibold">
              Explore Dashboard
            </Link>
            <Link to="/forecast" className="border-2 border-white hover:bg-white/10 px-8 py-3 rounded-md transition-colors">
              View Forecast
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;