const express = require('express');
const axios = require('axios');
const NodeCache = require('node-cache');
const cors = require('cors');

const app = express();
const port = 3000;

// Create a new cache with a default TTL of 10 minutes (600 seconds)
const cache = new NodeCache({ stdTTL: 600 });

// Enable CORS for all routes
app.use(cors());

app.get('/data/events', async (req, res) => {
  try {
    // Check if the data is in the cache
    const cachedData = cache.get('vatsimEvents');
    if (cachedData) {
      return res.json(cachedData);
    }

    // If not in cache, fetch from the API
    const response = await axios.get('https://my.vatsim.net/api/v2/events/latest');
    const data = response.data;

    // Store the data in the cache
    cache.set('vatsimEvents', data);

    // Send the data to the client
    res.json(data);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'An error occurred while fetching data' });
  }
});

app.listen(port, () => {
  console.log(`Proxy server running on http://localhost:${port}`);
});