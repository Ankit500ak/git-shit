# GitHub OAuth Setup Instructions

Follow these steps to set up GitHub OAuth authentication for your application.

## Step 1: Create a GitHub OAuth App

1. Go to [GitHub Settings > Developer settings > OAuth Apps](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Fill in the application details:
   - **Application name**: `GitHub Repository Explorer` (or your preferred name)
   - **Homepage URL**: `http://localhost:3000`
   - **Authorization callback URL**: `http://localhost:3000/callback`
4. Click "Register application"
5. Copy the **Client ID** and **Client Secret** (you'll need these in the next step)

## Step 2: Configure Environment Variables

1. Navigate to the `oauth-server` directory:
   ```bash
   cd oauth-server
   ```

2. Copy the example environment file:
   ```bash
   copy .env.example .env
   ```

3. Edit the `.env` file and add your GitHub OAuth credentials:
   ```
   GITHUB_CLIENT_ID=your_actual_client_id_here
   GITHUB_CLIENT_SECRET=your_actual_client_secret_here
   ```

## Step 3: Install and Start the OAuth Server

1. Install dependencies for the OAuth server:
   ```bash
   npm install
   ```

2. Start the OAuth server:
   ```bash
   npm start
   ```

The server will run on `http://localhost:3001`

## Step 4: Start the React Application

1. Open a new terminal and navigate back to the main project directory:
   ```bash
   cd ..
   ```

2. Start the React development server:
   ```bash
   npm start
   ```

The React app will run on `http://localhost:3000`

## How It Works

1. **Frontend (React)**: Handles the user interface and OAuth flow initiation
2. **Backend (Express)**: Securely handles the OAuth token exchange with GitHub
3. **GitHub OAuth**: Provides secure authentication without exposing client secrets

## Security Features

- ✅ Client secret is kept secure on the backend server
- ✅ OAuth 2.0 standard authentication flow
- ✅ Access tokens are stored locally and never sent to third parties
- ✅ Automatic token validation and refresh handling
- ✅ Secure CORS configuration

## Troubleshooting

### "OAuth server not responding"
- Make sure the OAuth server is running on port 3001
- Check that the `.env` file has the correct GitHub credentials

### "Invalid client credentials"
- Verify your GitHub Client ID and Client Secret in the `.env` file
- Make sure the OAuth app is configured with the correct callback URL

### "Authorization callback URL mismatch"
- Ensure your GitHub OAuth app has `http://localhost:3000/callback` as the callback URL
- Check that you're accessing the React app at `http://localhost:3000`

## Production Deployment

For production deployment:

1. Update the OAuth app callback URL to your production domain
2. Update the `OAUTH_SERVER_URL` in the GitHubService to point to your production backend
3. Set up proper environment variables on your production server
4. Use HTTPS for all OAuth flows in production