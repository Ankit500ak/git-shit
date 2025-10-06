const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Enable CORS for your React app
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());

// GitHub OAuth configuration
const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID || 'your_github_client_id';
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET || 'your_github_client_secret';

// OAuth callback endpoint
app.post('/oauth/github', async (req, res) => {
  const { code } = req.body;

  if (!code) {
    return res.status(400).json({ error: 'Authorization code is required' });
  }

  try {
    // Exchange authorization code for access token
    const tokenResponse = await axios.post('https://github.com/login/oauth/access_token', {
      client_id: GITHUB_CLIENT_ID,
      client_secret: GITHUB_CLIENT_SECRET,
      code: code,
    }, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    const tokenData = tokenResponse.data;

    if (tokenData.error) {
      return res.status(400).json({ 
        error: tokenData.error_description || tokenData.error 
      });
    }

    if (!tokenData.access_token) {
      return res.status(400).json({ error: 'Failed to obtain access token' });
    }

    // Return the access token to the frontend
    res.json({
      access_token: tokenData.access_token,
      token_type: tokenData.token_type,
      scope: tokenData.scope
    });

  } catch (error) {
    console.error('OAuth error:', error.response?.data || error.message);
    res.status(500).json({ 
      error: 'Internal server error during OAuth exchange' 
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'OAuth server is running' });
});

// OAuth configuration endpoint
app.get('/oauth/config', (req, res) => {
  res.json({
    client_id: GITHUB_CLIENT_ID,
    redirect_uri: 'http://localhost:3000/callback',
    scope: 'repo user read:org'
  });
});

app.listen(PORT, () => {
  console.log(`OAuth server running on port ${PORT}`);
  console.log(`Make sure to set GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET environment variables`);
  console.log(`Or create a .env file in the oauth-server directory`);
});