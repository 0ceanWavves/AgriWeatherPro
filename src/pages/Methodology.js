import React from 'react';
import { FaChartLine, FaDatabase, FaBrain, FaChartBar, FaExclamationTriangle, FaShieldAlt, FaInfoCircle, FaLeaf, FaCloudRain, FaThermometerHalf, FaBug } from 'react-icons/fa';

const Methodology = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-heading font-bold mb-6">Risk Assessment Methodology</h1>
        
        <div className="card mb-8">
          <p className="text-xl mb-6">
            AgriWeather Pro uses advanced machine learning algorithms to analyze multiple data sources and provide accurate, 
            actionable risk assessments for your crops. Our methodology combines real-time weather data, historical patterns, 
            and crop-specific factors to deliver insights you can trust.
          </p>
          
          <div className="bg-primary/5 p-4 rounded-lg mb-8 border-l-4 border-primary">
            <div className="flex items-start">
              <FaInfoCircle className="text-primary mt-1 mr-3 flex-shrink-0" />
              <p>
                <span className="font-semibold">Trust indicator:</span> Our risk assessment models have been validated against historical data 
                with 93% accuracy in predicting significant weather-related crop impacts across various regions and crop types.
              </p>
            </div>
          </div>
        </div>

        {/* Data Sources Section */}
        <div className="card mb-8">
          <h2 className="text-2xl font-heading font-bold mb-4 flex items-center">
            <FaDatabase className="mr-3 text-primary" />
            Data Sources
          </h2>
          
          <p className="mb-4">
            Our risk assessments are powered by comprehensive data from multiple trusted sources:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2 flex items-center">
                <FaCloudRain className="mr-2 text-blue-600" />
                NOAA Weather Services
              </h3>
              <p className="text-sm">
                Real-time and forecasted weather data including precipitation, temperature, humidity, 
                and wind conditions with hourly updates.
              </p>
              <div className="mt-2 text-xs text-gray-500">Data refresh: Hourly</div>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2 flex items-center">
                <FaLeaf className="mr-2 text-green-600" />
                USDA Historical Records
              </h3>
              <p className="text-sm">
                Decades of historical crop performance data correlated with weather patterns across 
                all major agricultural regions in the United States.
              </p>
              <div className="mt-2 text-xs text-gray-500">Data refresh: Quarterly</div>
            </div>
            
            <div className="bg-orange-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2 flex items-center">
                <FaThermometerHalf className="mr-2 text-orange-600" />
                Climate Research Databases
              </h3>
              <p className="text-sm">
                Long-term climate trend data from NASA, NOAA, and academic research institutions, 
                providing context for current conditions.
              </p>
              <div className="mt-2 text-xs text-gray-500">Data refresh: Monthly</div>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2 flex items-center">
                <FaBug className="mr-2 text-purple-600" />
                Pest & Disease Monitoring Networks
              </h3>
              <p className="text-sm">
                Real-time monitoring of pest populations and disease outbreaks from agricultural 
                extension services and research stations.
              </p>
              <div className="mt-2 text-xs text-gray-500">Data refresh: Daily</div>
            </div>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2">Data Quality Assurance</h3>
            <p className="text-sm">
              All data sources undergo rigorous validation and cleaning processes before being integrated into our models. 
              Anomalous data points are flagged and reviewed by our data science team to ensure the highest quality inputs 
              for our risk assessments.
            </p>
          </div>
        </div>
        
        {/* Machine Learning Models Section */}
        <div className="card mb-8">
          <h2 className="text-2xl font-heading font-bold mb-4 flex items-center">
            <FaBrain className="mr-3 text-primary" />
            Machine Learning Models
          </h2>
          
          <p className="mb-6">
            Our risk assessment system employs a suite of specialized machine learning models, each designed to analyze 
            specific aspects of crop vulnerability:
          </p>
          
          <div className="space-y-4 mb-6">
            <div className="p-4 border border-gray-200 rounded-lg">
              <h3 className="font-semibold mb-2">Weather Impact Prediction</h3>
              <p className="text-sm">
                Gradient-boosted decision tree models that correlate weather patterns with historical crop performance to 
                predict the impact of current and forecasted conditions on specific crops.
              </p>
              <div className="mt-2 text-xs bg-green-50 p-1 rounded inline-block">
                Accuracy: 94.3%
              </div>
            </div>
            
            <div className="p-4 border border-gray-200 rounded-lg">
              <h3 className="font-semibold mb-2">Anomaly Detection</h3>
              <p className="text-sm">
                Ensemble-based unsupervised learning models that identify unusual weather patterns that may not be captured by 
                traditional forecasting methods but could impact crop health.
              </p>
              <div className="mt-2 text-xs bg-green-50 p-1 rounded inline-block">
                Precision: 91.7%
              </div>
            </div>
            
            <div className="p-4 border border-gray-200 rounded-lg">
              <h3 className="font-semibold mb-2">Crop-Specific Vulnerability Assessment</h3>
              <p className="text-sm">
                Neural networks trained on crop-specific data that understand the unique vulnerabilities of different crops 
                at various growth stages to different weather conditions.
              </p>
              <div className="mt-2 text-xs bg-green-50 p-1 rounded inline-block">
                F1 Score: 92.4%
              </div>
            </div>
            
            <div className="p-4 border border-gray-200 rounded-lg">
              <h3 className="font-semibold mb-2">Multi-Factor Risk Integration</h3>
              <p className="text-sm">
                A meta-model that combines outputs from all specialized models and weights them according to current conditions, 
                crop type, and location to produce the final risk assessment.
              </p>
              <div className="mt-2 text-xs bg-green-50 p-1 rounded inline-block">
                Overall Accuracy: 93.2%
              </div>
            </div>
          </div>
          
          <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-500">
            <div className="flex items-start">
              <FaExclamationTriangle className="text-yellow-600 mt-1 mr-3 flex-shrink-0" />
              <div>
                <h3 className="font-semibold mb-1">Model Limitations</h3>
                <p className="text-sm">
                  While our models achieve high accuracy, they cannot account for all possible variables affecting crop growth. 
                  Extreme or unprecedented weather events, localized microclimates, and specific field conditions beyond our data 
                  collection may affect actual outcomes. Always combine our risk assessments with your local knowledge and observations.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Risk Calculation Process */}
        <div className="card mb-8">
          <h2 className="text-2xl font-heading font-bold mb-4 flex items-center">
            <FaChartLine className="mr-3 text-primary" />
            Risk Calculation Process
          </h2>
          
          <p className="mb-6">
            Our risk assessment follows a systematic process to generate accurate and actionable insights:
          </p>
          
          <div className="relative">
            <div className="absolute top-0 bottom-0 left-8 md:left-10 w-1 bg-primary/20"></div>
            
            <div className="mb-8 relative">
              <div className="absolute left-0 md:left-2 w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-primary font-bold">1</span>
              </div>
              <div className="ml-20 md:ml-24">
                <h3 className="font-semibold mb-2">Data Collection & Preprocessing</h3>
                <p className="text-sm mb-2">
                  Real-time weather data, forecasts, and historical patterns are collected and normalized. 
                  This data is combined with crop-specific information such as growth stage, known vulnerabilities, 
                  and historical performance.
                </p>
                <div className="p-3 bg-gray-50 rounded-lg text-xs">
                  <strong>Preprocessing steps:</strong> Normalization, Missing value imputation, Outlier detection, Feature engineering
                </div>
              </div>
            </div>
            
            <div className="mb-8 relative">
              <div className="absolute left-0 md:left-2 w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-primary font-bold">2</span>
              </div>
              <div className="ml-20 md:ml-24">
                <h3 className="font-semibold mb-2">Initial Risk Scoring</h3>
                <p className="text-sm mb-2">
                  Each risk factor (drought, heat stress, excess moisture, pests) is analyzed independently 
                  based on current conditions, forecasts, and known thresholds for the specific crop.
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 bg-green-50 rounded">Drought Index: 0-10 scale</div>
                  <div className="p-2 bg-orange-50 rounded">Heat Stress: 0-10 scale</div>
                  <div className="p-2 bg-blue-50 rounded">Moisture Levels: 0-10 scale</div>
                  <div className="p-2 bg-purple-50 rounded">Pest Pressure: 0-10 scale</div>
                </div>
              </div>
            </div>
            
            <div className="mb-8 relative">
              <div className="absolute left-0 md:left-2 w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-primary font-bold">3</span>
              </div>
              <div className="ml-20 md:ml-24">
                <h3 className="font-semibold mb-2">Risk Level Determination</h3>
                <p className="text-sm mb-2">
                  Raw scores are converted to risk levels (Low, Medium, High) based on calibrated thresholds 
                  that have been validated against historical outcomes.
                </p>
                <div className="p-3 bg-gray-50 rounded-lg grid grid-cols-3 gap-2 text-xs">
                  <div className="flex items-center">
                    <span className="inline-block w-3 h-3 bg-green-500 mr-1 rounded-sm"></span>
                    <span>Low: 1-3</span>
                  </div>
                  <div className="flex items-center">
                    <span className="inline-block w-3 h-3 bg-yellow-500 mr-1 rounded-sm"></span>
                    <span>Medium: 4-6</span>
                  </div>
                  <div className="flex items-center">
                    <span className="inline-block w-3 h-3 bg-red-500 mr-1 rounded-sm"></span>
                    <span>High: 7-10</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mb-8 relative">
              <div className="absolute left-0 md:left-2 w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-primary font-bold">4</span>
              </div>
              <div className="ml-20 md:ml-24">
                <h3 className="font-semibold mb-2">Impact Assessment</h3>
                <p className="text-sm mb-2">
                  Each risk factor is assigned an impact score (1-10) based on its potential effect on yield, 
                  crop quality, and overall farm operations.
                </p>
                <div className="p-3 bg-gray-50 rounded-lg text-xs">
                  <strong>Impact factors considered:</strong> Effect on yield, Time sensitivity, Mitigation difficulty, Economic impact
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute left-0 md:left-2 w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-primary font-bold">5</span>
              </div>
              <div className="ml-20 md:ml-24">
                <h3 className="font-semibold mb-2">Final Risk Assessment</h3>
                <p className="text-sm mb-2">
                  All risk factors are combined to create a comprehensive assessment with actionable recommendations 
                  for farm management.
                </p>
                <div className="p-3 bg-gray-50 rounded-lg text-xs">
                  <strong>Output includes:</strong> Risk level, Impact score, Confidence level, Recommended actions, Monitoring advice
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Validation & Continuous Improvement */}
        <div className="card mb-8">
          <h2 className="text-2xl font-heading font-bold mb-4 flex items-center">
            <FaChartBar className="mr-3 text-primary" />
            Validation & Continuous Improvement
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="font-semibold mb-3">Model Validation Process</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-primary rounded-full mt-1.5 mr-2"></span>
                  <span>Backtesting against 10+ years of historical data</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-primary rounded-full mt-1.5 mr-2"></span>
                  <span>Validated with real-world data from partner farms</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-primary rounded-full mt-1.5 mr-2"></span>
                  <span>Peer-reviewed methodology by agricultural scientists</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-primary rounded-full mt-1.5 mr-2"></span>
                  <span>Regular blind testing against actual outcomes</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-3">Continuous Improvement</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-primary rounded-full mt-1.5 mr-2"></span>
                  <span>Weekly model retraining with new data</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-primary rounded-full mt-1.5 mr-2"></span>
                  <span>Monthly performance review by our data science team</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-primary rounded-full mt-1.5 mr-2"></span>
                  <span>User feedback integration to improve relevance</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-primary rounded-full mt-1.5 mr-2"></span>
                  <span>Quarterly addition of new data sources</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="bg-primary/5 p-4 rounded-lg">
            <h3 className="font-semibold mb-2 flex items-center">
              <FaShieldAlt className="mr-2 text-primary" />
              Our Commitment to Accuracy
            </h3>
            <p className="text-sm">
              We are committed to providing the most accurate risk assessments possible. Our models undergo 
              continuous improvement based on real-world outcomes, user feedback, and new research. We maintain 
              transparent metrics about our accuracy and clearly communicate confidence levels with all assessments.
            </p>
          </div>
        </div>
        
        {/* FAQ Section */}
        <div className="card">
          <h2 className="text-2xl font-heading font-bold mb-6">Frequently Asked Questions</h2>
          
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold mb-2">How often are risk assessments updated?</h3>
              <p className="text-sm">
                Risk assessments are updated daily with the latest weather data and forecasts. Major updates to our models 
                and methodologies occur quarterly based on ongoing validation and research.
              </p>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold mb-2">How accurate are the risk assessments?</h3>
              <p className="text-sm">
                Our risk assessment models have been validated to achieve over 93% accuracy when predicting significant 
                weather-related crop impacts. Accuracy is continuously monitored and reported transparently.
              </p>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold mb-2">Do risk assessments account for my specific field conditions?</h3>
              <p className="text-sm">
                Basic risk assessments use regional data. Premium subscribers benefit from field-specific assessments 
                that incorporate soil type, elevation, and microclimate data for your specific locations.
              </p>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold mb-2">How should I use these risk assessments in my decision-making?</h3>
              <p className="text-sm">
                Risk assessments should be used as one important input in your decision-making process, alongside your personal 
                experience, local knowledge, and other farm management tools. They are designed to alert you to potential issues 
                and help prioritize your monitoring and management activities.
              </p>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold mb-2">What if I disagree with a risk assessment?</h3>
              <p className="text-sm">
                We encourage you to provide feedback through the platform if you believe a risk assessment does not match your 
                observations. Your feedback helps us improve our models and may highlight local factors that our system did not account for.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Methodology; 