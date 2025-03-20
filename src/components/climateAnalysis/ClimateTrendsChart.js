import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import PropTypes from 'prop-types';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

/**
 * @component
 * @description Displays a line chart of climate trends over time using Chart.js.
 * @param {object} props - Component props.
 * @param {object} props.chartData - Data for the chart (labels, datasets) in Chart.js format.
 * @param {string} props.title - Title of the chart.
 */
function ClimateTrendsChart({ chartData, title }) {
    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: title,
            },
        },
        scales: {
            y: {
                beginAtZero: false, // Do not force Y axis to start at zero if data is far from zero
            },
        },
    };

    return <Line options={chartOptions} data={chartData} />;
}

ClimateTrendsChart.propTypes = {
    chartData: PropTypes.object.isRequired,
    title: PropTypes.string.isRequired,
};

export default ClimateTrendsChart; 