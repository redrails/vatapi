const express = require('express');
const axios = require('axios');
const NodeCache = require('node-cache');
const cors = require('cors');

const app = express();

const cache = new NodeCache({ stdTTL: 600 });

app.use(cors());

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