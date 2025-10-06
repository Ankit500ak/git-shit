# 🚀 GitHub Repository Viewer & Link Sharing Platform# GitHub Repository Viewer



<div align="center">A modern React.js application that allows users to connect to GitHub using authentication and view all their repositories in a beautiful, responsive interface.



![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)## Features

![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)

![GitHub API](https://img.shields.io/badge/github%20API-%23121011.svg?style=for-the-badge&logo=github&logoColor=white)- 🔐 GitHub Personal Access Token authentication

![License](https://img.shields.io/badge/license-MIT-green.svg?style=for-the-badge)- 📱 Responsive design that works on all devices

- 🔍 Search and filter repositories

**A modern React.js application with advanced link sharing capabilities, GitHub authentication, and intelligent repository management with proper uptime handling.**- 📊 Repository statistics (stars, forks, language)

- 🎨 Modern, beautiful UI with smooth animations

[Features](#-features) •- ⚡ Fast and efficient API calls

[Quick Start](#-quick-start) •- 🔄 Real-time repository information

[Link Sharing](#-link-sharing-system) •

[API Reference](#-api-reference) •## Prerequisites

[Contributing](#-contributing)

Before you begin, ensure you have the following installed:

</div>- Node.js (version 14.0 or later)

- npm or yarn package manager

---- A GitHub account



## 🌟 Features## Setup Instructions



### 🔐 GitHub Integration### 1. Install Dependencies

- **Personal Access Token Authentication** - Secure GitHub API integration```bash

- **Real-time Repository Data** - Live repository information and statisticsnpm install

- **Smart Filtering & Search** - Advanced repository discovery tools```

- **Multi-language Support** - Comprehensive programming language detection

### 2. Get GitHub Personal Access Token

### 🔗 Advanced Link Sharing System

- **⏰ Intelligent Uptime Management** - Automatic link expiration and cleanupTo use this application, you'll need a GitHub Personal Access Token:

- **🛡️ Secure Link Generation** - Cryptographically secure link IDs

- **📊 Access Analytics** - Comprehensive link usage statistics1. Go to [GitHub Settings > Developer settings > Personal access tokens](https://github.com/settings/tokens)

- **🔄 Link Extension** - Extend link lifespan dynamically2. Click "Generate new token (classic)"

- **🧪 Built-in Link Tester** - Validate and test shared links3. Give your token a descriptive name (e.g., "Repository Viewer App")

- **🎯 Privacy Controls** - Configurable access permissions4. Select the following scopes:

   - `repo` - Full control of private repositories

### 🎨 Modern User Experience   - `user` - Read user profile data

- **📱 Responsive Design** - Seamless experience across all devices   - `read:org` - Read organization membership

- **✨ Glassmorphism UI** - Modern, beautiful interface with smooth animations5. Click "Generate token"

- **⚡ Performance Optimized** - Fast loading and efficient API calls6. **Important**: Copy the token immediately as you won't be able to see it again

- **🎯 Intuitive Navigation** - User-friendly interface design

### 3. Run the Application

---```bash

npm start

## 🚀 Quick Start```



### PrerequisitesThe application will open in your browser at `http://localhost:3000`.



Ensure you have the following installed:### 4. Login to GitHub

- **Node.js** (v14.0 or later)

- **npm** or **yarn** package manager1. Click the "Login with GitHub" button

- **GitHub Account** with repository access2. Paste your Personal Access Token when prompted

3. The app will automatically fetch and display your repositories

### Installation

## Available Scripts

```bash

# Clone the repositoryIn the project directory, you can run:

git clone https://github.com/yourusername/github-repo-viewer.git

### `npm start`

# Navigate to project directory

cd github-repo-viewerRuns the app in the development mode.\

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

# Install dependencies

npm installThe page will reload if you make edits.\

You will also see any lint errors in the console.

# Start development server

npm start### `npm test`

```

Launches the test runner in the interactive watch mode.\

The application will launch at `http://localhost:3000`.See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.



### GitHub Authentication Setup### `npm run build`



1. **Generate Personal Access Token**Builds the app for production to the `build` folder.\

   - Navigate to [GitHub Settings > Developer Settings > Personal Access Tokens](https://github.com/settings/tokens)It correctly bundles React in production mode and optimizes the build for the best performance.

   - Click **"Generate new token (classic)"**

   - Configure token settings:The build is minified and the filenames include the hashes.\

     ```Your app is ready to be deployed!

     Name: GitHub Repository Viewer

     Scopes:See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

       ✓ repo - Full repository access

       ✓ user - User profile data### `npm run eject`

       ✓ read:org - Organization membership

     ```**Note: this is a one-way operation. Once you `eject`, you can’t go back!**



2. **Login Process**If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

   - Click **"Login with GitHub"** in the application

   - Paste your Personal Access TokenInstead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

   - Enjoy seamless repository browsing!

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

---

## Learn More

## 🔗 Link Sharing System

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

### Overview

To learn React, check out the [React documentation](https://reactjs.org/).

The integrated **Link Management Service** provides enterprise-grade link sharing capabilities with intelligent uptime management and automatic cleanup processes.

### Core Features

#### 🛡️ Secure Link Generation
```typescript
// Generate secure shareable links
const shareableLink = LinkManagementService.createSharedLink(
  repositoryData,
  {
    expiresIn: '7d',        // 7 days expiration
    isPublic: true,         // Public access
    maxAccesses: 100        // Maximum 100 views
  }
);
```

#### ⏰ Intelligent Expiration Management
- **Automatic Cleanup** - Expired links are automatically removed
- **Flexible Duration** - Configure expiration from hours to months
- **Grace Period** - Extended access during cleanup cycles
- **Real-time Validation** - Live link status checking

#### 📊 Comprehensive Analytics
```typescript
// Get detailed link statistics
const stats = LinkManagementService.getLinkStatistics();
// Returns: { total, active, expired, totalAccesses, uniqueViewers }
```

### Link Sharing Workflow

1. **🎯 Repository Selection** - Choose repositories to share
2. **⚙️ Configuration** - Set expiration, privacy, and access limits
3. **🔗 Link Generation** - Secure, unique link creation
4. **📤 Distribution** - Copy and share generated links
5. **📊 Monitoring** - Track access and usage analytics
6. **🔄 Management** - Extend, modify, or revoke links

### Advanced Link Features

#### Link Management Dashboard
- **📋 Active Links Overview** - View all your shared links
- **📈 Usage Analytics** - Detailed access statistics
- **🔧 Link Operations** - Extend, test, or delete links
- **⚡ Bulk Operations** - Manage multiple links simultaneously

#### Link Tester Tool
- **🧪 Validation Engine** - Test link functionality
- **📊 Performance Metrics** - Link response time analysis
- **🔍 Debugging Tools** - Troubleshoot link issues
- **📱 Mobile Testing** - Cross-device compatibility checks

---

## 🏗️ Technical Architecture

### Core Services

#### LinkManagementService
```typescript
class LinkManagementService {
  // Secure link generation with cryptographic safety
  static generateSecureId(): string
  
  // Create shareable links with configurable options
  static createSharedLink(data: any, options: LinkOptions): SharedLink
  
  // Intelligent expiration checking
  static isLinkExpired(link: SharedLink): boolean
  
  // Automated cleanup processes
  static cleanupExpiredLinks(): void
  
  // Comprehensive analytics
  static getLinkStatistics(): LinkStatistics
}
```

#### Key Components

| Component | Purpose | Features |
|-----------|---------|----------|
| `LinkSharingModal` | Link creation interface | Expiration settings, privacy controls |
| `LinkManagement` | Dashboard for managing links | View, extend, delete operations |
| `SharedRepositoryView` | Display shared repositories | Link validation, repository rendering |
| `LinkTester` | Link validation tool | URL parsing, functionality testing |

### Data Models

```typescript
interface SharedLink {
  id: string;                    // Secure unique identifier
  repositoryData: Repository[];  // Shared repository information
  createdAt: Date;              // Link creation timestamp
  expiresAt: Date | null;       // Expiration time (null = never expires)
  accessCount: number;          // Number of times accessed
  isPublic: boolean;            // Public/private access control
  maxAccesses?: number;         // Optional access limit
  createdBy?: string;           // Link creator identifier
}

interface LinkOptions {
  expiresIn?: string;           // Duration (e.g., '7d', '24h', '30m')
  isPublic?: boolean;           // Public access (default: true)
  maxAccesses?: number;         // Maximum access count
}
```

---

## 🛠️ Available Scripts

### Development Commands

```bash
# Start development server with hot reload
npm start

# Run comprehensive test suite
npm test

# Build optimized production bundle
npm run build

# Analyze bundle size and performance
npm run analyze

# Lint code for quality assurance
npm run lint

# Format code with Prettier
npm run format
```

### Advanced Development

```bash
# Start with specific port
PORT=3001 npm start

# Build with production optimizations
NODE_ENV=production npm run build

# Run tests with coverage report
npm test -- --coverage

# Start development server with HTTPS
HTTPS=true npm start
```

---

## 📋 API Reference

### Link Management API

#### Create Shared Link
```typescript
LinkManagementService.createSharedLink(
  repositories: Repository[],
  options: {
    expiresIn?: string;     // '1h', '24h', '7d', '30d'
    isPublic?: boolean;     // Default: true
    maxAccesses?: number;   // Optional access limit
  }
): SharedLink
```

#### Retrieve Shared Data
```typescript
LinkManagementService.getSharedData(linkId: string): Repository[] | null
```

#### Link Validation
```typescript
LinkManagementService.isLinkExpired(link: SharedLink): boolean
LinkManagementService.isLinkValid(linkId: string): boolean
```

#### Analytics & Statistics
```typescript
LinkManagementService.getLinkStatistics(): {
  total: number;           // Total links created
  active: number;          // Currently active links
  expired: number;         // Expired links
  totalAccesses: number;   // Total access count
  uniqueViewers: number;   // Estimated unique viewers
}
```

#### Link Management Operations
```typescript
// Extend link expiration
LinkManagementService.extendLink(linkId: string, duration: string): boolean

// Delete specific link
LinkManagementService.deleteLink(linkId: string): boolean

// Cleanup expired links
LinkManagementService.cleanupExpiredLinks(): number
```

---

## 🎯 Usage Examples

### Basic Link Sharing

```typescript
import { LinkManagementService } from './services/LinkManagementService';

// Create a 7-day public link
const repositories = await fetchUserRepositories();
const sharedLink = LinkManagementService.createSharedLink(repositories, {
  expiresIn: '7d',
  isPublic: true
});

console.log(`Share this link: ${window.location.origin}/shared/${sharedLink.id}`);
```

### Advanced Link Configuration

```typescript
// Create a private link with access limits
const restrictedLink = LinkManagementService.createSharedLink(repositories, {
  expiresIn: '24h',      // Expires in 24 hours
  isPublic: false,       // Private access only
  maxAccesses: 50        // Maximum 50 views
});
```

### Link Analytics Dashboard

```typescript
// Display comprehensive statistics
const stats = LinkManagementService.getLinkStatistics();
const activeLinks = LinkManagementService.getAllLinks()
  .filter(link => !LinkManagementService.isLinkExpired(link));

console.log(`Active Links: ${stats.active}`);
console.log(`Total Accesses: ${stats.totalAccesses}`);
```

---

## 🔧 Configuration

### Environment Variables

Create a `.env` file in your project root:

```env
# Application Configuration
REACT_APP_NAME=GitHub Repository Viewer
REACT_APP_VERSION=2.0.0
REACT_APP_BASE_URL=http://localhost:3000

# GitHub API Configuration
REACT_APP_GITHUB_API_URL=https://api.github.com
REACT_APP_GITHUB_CLIENT_ID=your_client_id

# Link Sharing Configuration
REACT_APP_LINK_EXPIRY_DEFAULT=7d
REACT_APP_MAX_LINKS_PER_USER=100
REACT_APP_CLEANUP_INTERVAL=1h

# Performance Configuration
REACT_APP_CACHE_DURATION=300000
REACT_APP_API_TIMEOUT=10000
```

---

## 🚀 Deployment

### Production Build

```bash
# Create optimized production build
npm run build

# Serve static files (example with serve)
npx serve -s build -p 3000
```

### Docker Deployment

```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY build ./build
EXPOSE 3000
CMD ["npx", "serve", "-s", "build", "-p", "3000"]
```

### Vercel Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to Vercel
vercel --prod
```

---

## 🧪 Testing

### Test Coverage

- **Unit Tests** - Component and service testing
- **Integration Tests** - API and workflow testing
- **E2E Tests** - Complete user journey testing
- **Performance Tests** - Load and stress testing

### Running Tests

```bash
# Run all tests
npm test

# Run with coverage
npm test -- --coverage --watchAll=false

# Run specific test files
npm test LinkManagementService

# Run integration tests
npm run test:integration
```

---

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

### Development Workflow

1. **Fork & Clone** the repository
2. **Create Feature Branch** (`git checkout -b feature/amazing-feature`)
3. **Commit Changes** (`git commit -m 'Add amazing feature'`)
4. **Push to Branch** (`git push origin feature/amazing-feature`)
5. **Open Pull Request** with detailed description

### Code Standards

- **TypeScript** - Strict type checking enabled
- **ESLint** - Airbnb configuration with custom rules
- **Prettier** - Consistent code formatting
- **Jest** - Comprehensive test coverage (>90%)

### Commit Convention

```
feat: add new link sharing feature
fix: resolve expiration handling bug
docs: update API documentation
style: improve component styling
refactor: optimize link generation
test: add integration tests
chore: update dependencies
```

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **React Team** - For the amazing React framework
- **GitHub API** - For providing comprehensive repository data
- **TypeScript Team** - For type safety and developer experience
- **Open Source Community** - For inspiration and contributions

---

## 📞 Support

- **Documentation**: [Wiki](https://github.com/yourusername/github-repo-viewer/wiki)
- **Issues**: [GitHub Issues](https://github.com/yourusername/github-repo-viewer/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/github-repo-viewer/discussions)
- **Email**: support@yourapp.com

---

<div align="center">

**Made with ❤️ by [Ankit500ak](https://github.com/Ankit500ak)**

**⭐ Star this repo if you find it helpful!**

</div>