const cron = require('node-cron');
const axios = require('axios');

// Function to update trip statuses
const updateTripStatuses = async () => {
    try {
        console.log('Running automatic trip status update...');

        // Make a request to the update-statuses endpoint
        const response = await axios.post('http://localhost:8000/api/trip/update-statuses');

        if (response.status === 200) {
            console.log('Trip statuses updated successfully:', response.data.message);
        } else {
            console.error('Failed to update trip statuses');
        }
    } catch (error) {
        console.error('Error in automatic trip status update:', error.message);
    }
};

// Schedule the task to run every hour
const startTripStatusScheduler = () => {
    console.log('Starting trip status scheduler...');

    // Run every hour at minute 0
    cron.schedule('0 * * * *', () => {
        updateTripStatuses();
    });

    // Also run once when the server starts
    updateTripStatuses();
};

// Start the scheduler immediately
startTripStatusScheduler();

module.exports = {
    startTripStatusScheduler,
    updateTripStatuses
}; 