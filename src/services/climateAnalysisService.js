import { climateTrends } from '../api/mockData'; // Import mock data

/**
 * Fetches global climate trend data (using mock data for now).
 * In the future, this will be updated to fetch from a real API.
 * @returns {Promise<object>} - Climate trends data.
 */
export const getGlobalClimateTrends = async () => {
    return new Promise((resolve) => {
        // Simulate API delay (optional)
        setTimeout(() => {
            resolve(climateTrends); // Resolve with mock data
        }, 500); // 0.5 second delay
    });
};

// Example function to process mock climate trends data for Chart.js
export const processClimateTrendsForChart = (climateTrendsData) => {
    if (!climateTrendsData) {
        return { labels: [], datasets: [] };
    }

    const years = climateTrendsData.temperatures.map(item => item.year.toString()); // Use years from temperatures for labels

    return {
        labels: years, // Years as labels
        datasets: [
            {
                label: 'Temperature Anomaly (°C)',
                data: climateTrendsData.temperatures.map(item => item.value),
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
            {
                label: 'Precipitation Change (%)',
                data: climateTrendsData.precipitation.map(item => item.value),
                borderColor: 'rgb(54, 162, 235)',
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
            },
            {
                label: 'Drought Index',
                data: climateTrendsData.drought.map(item => item.value),
                borderColor: 'rgb(255, 205, 86)',
                backgroundColor: 'rgba(255, 205, 86, 0.5)',
            }
        ],
    };
}; 