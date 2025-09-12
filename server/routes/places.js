const express = require('express');
const axios = require('axios');
const router = express.Router();

const GEOAPIFY_API_KEY = 'c829ceacd98e40868eee125bfbca6624';

// Get place autocomplete suggestions
router.get('/autocomplete', async (req, res) => {
  try {
    const { input } = req.query;
    
    if (!input || input.trim().length < 3) {
      return res.json({ features: [] });
    }

    const requestOptions = {
      method: 'GET',
    };

    const response = await axios.get(
      `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(input.trim())}&apiKey=${GEOAPIFY_API_KEY}`,
      requestOptions
    );

    res.json(response.data);
  } catch (error) {
    console.error('Geoapify API error:', error);
    res.status(500).json({ error: 'Failed to fetch places' });
  }
});

// Get place details by coordinates
router.get('/reverse', async (req, res) => {
  try {
    const { lat, lon } = req.query;

    const requestOptions = {
      method: 'GET',
    };

    const response = await axios.get(
      `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lon}&apiKey=${GEOAPIFY_API_KEY}`,
      requestOptions
    );

    res.json(response.data);
  } catch (error) {
    console.error('Geoapify reverse geocoding error:', error);
    res.status(500).json({ error: 'Failed to fetch place details' });
  }
});

module.exports = router;