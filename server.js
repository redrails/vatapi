const express = require('express');
const axios = require('axios');
const NodeCache = require('node-cache');

const app = express();

const cache = new NodeCache({ stdTTL: 600 });

// Middleware to add CORS headers
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.get('/data/events', async (req, res) => {
  try {
    const cachedData = cache.get('vatsimEvents');
    if (cachedData) {
      return res.json(cachedData);
    }

    const response = await axios.get('https://my.vatsim.net/api/v2/events/latest');
    const data = response.data;

    cache.set('vatsimEvents', data);

    res.json(data);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'An error occurred while fetching data' });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Proxy server running on port ${port}`);
});

module.exports = app;