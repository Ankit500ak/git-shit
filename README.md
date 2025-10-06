# GitHub Repository Viewer

A modern React.js application that allows users to connect to GitHub using authentication and view all their repositories in a beautiful, responsive interface.

## Features

- 🔐 GitHub Personal Access Token authentication
- 📱 Responsive design that works on all devices
- 🔍 Search and filter repositories
- 📊 Repository statistics (stars, forks, language)
- 🎨 Modern, beautiful UI with smooth animations
- ⚡ Fast and efficient API calls
- 🔄 Real-time repository information

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (version 14.0 or later)
- npm or yarn package manager
- A GitHub account

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Get GitHub Personal Access Token

To use this application, you'll need a GitHub Personal Access Token:

1. Go to [GitHub Settings > Developer settings > Personal access tokens](https://github.com/settings/tokens)
2. Click "Generate new token (classic)"
3. Give your token a descriptive name (e.g., "Repository Viewer App")
4. Select the following scopes:
   - `repo` - Full control of private repositories
   - `user` - Read user profile data
   - `read:org` - Read organization membership
5. Click "Generate token"
6. **Important**: Copy the token immediately as you won't be able to see it again

### 3. Run the Application
```bash
npm start
```

The application will open in your browser at `http://localhost:3000`.

### 4. Login to GitHub

1. Click the "Login with GitHub" button
2. Paste your Personal Access Token when prompted
3. The app will automatically fetch and display your repositories

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
