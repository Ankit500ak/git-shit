import React, { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import LoginSection from './components/LoginSection';
import AuthFlow from './components/AuthFlow';
import RepositoryList from './components/RepositoryList';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorSection from './components/ErrorSection';
import { GitHubService } from './services/GitHubService';

export interface User {
  login: string;
  avatar_url: string;
  name: string;
  public_repos: number;
}

export interface Repository {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  private: boolean;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  updated_at: string;
  created_at: string;
  topics?: string[];
  size?: number;
}

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showAuthFlow, setShowAuthFlow] = useState(false);

  useEffect(() => {
    // Check if user is already authenticated
    if (GitHubService.isAuthenticated()) {
      setIsLoggedIn(true);
      fetchUserData();
    }
  }, []);

  const handleLogin = () => {
    setShowAuthFlow(true);
  };

  const handleAuthComplete = async () => {
    setLoading(true);
    setError(null);
    setShowAuthFlow(false);
    
    try {
      // Fetch user data and repositories
      const userData = await GitHubService.getCurrentUser();
      setUser(userData);
      
      const reposData = await GitHubService.getAllUserRepositories();
      setRepositories(reposData);
      setIsLoggedIn(true);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch data after authentication.');
      GitHubService.logout();
    } finally {
      setLoading(false);
    }
  };

  const handleAuthCancel = () => {
    setShowAuthFlow(false);
  };

  const handleLogout = () => {
    GitHubService.logout();
    setIsLoggedIn(false);
    setUser(null);
    setRepositories([]);
    setError(null);
  };

  const fetchUserData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const userData = await GitHubService.getCurrentUser();
      setUser(userData);
      
      const reposData = await GitHubService.getAllUserRepositories();
      setRepositories(reposData);
      setIsLoggedIn(true);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch user data. Please try again.');
      setIsLoggedIn(false);
      GitHubService.logout();
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    if (isLoggedIn) {
      fetchUserData();
    } else {
      handleLogin();
    }
  };

  return (
    <div className="App">
      <Header user={user} onLogout={handleLogout} />
      
      <main className="main">
        <div className="container">
          {!isLoggedIn && !loading && !showAuthFlow && (
            <LoginSection onLogin={handleLogin} />
          )}
          
          {showAuthFlow && (
            <AuthFlow 
              onAuth={handleAuthComplete}
              onCancel={handleAuthCancel}
            />
          )}
          
          {loading && <LoadingSpinner message={isLoggedIn ? "Loading repositories..." : "Authenticating with GitHub..."} />}
          
          {error && (
            <ErrorSection message={error} onRetry={handleRetry} />
          )}
          
          {isLoggedIn && !loading && !error && (
            <RepositoryList 
              repositories={repositories} 
              onRefresh={fetchUserData}
            />
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
