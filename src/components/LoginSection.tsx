import React from 'react';
import './LoginSection.css';

interface LoginSectionProps {
  onLogin: () => void;
}

const LoginSection: React.FC<LoginSectionProps> = ({ onLogin }) => {
  return (
    <div className="login-section">
      <div className="login-card">
        <div className="login-header">
          <div className="github-icon">
            <i className="fab fa-github"></i>
          </div>
          <h2>GitHub Repository Explorer</h2>
          <p>Secure 2-Step Authentication</p>
        </div>
        
        <div className="login-content">
          <p className="login-description">
            Access all your GitHub repositories with secure one-click authentication
          </p>
          
          <div className="auth-steps-preview">
            <div className="step-preview">
              <div className="step-number">1</div>
              <div className="step-info">
                <h4>Click Login</h4>
                <p>Start secure GitHub authentication</p>
              </div>
            </div>
            <div className="step-preview">
              <div className="step-number">2</div>
              <div className="step-info">
                <h4>Enter Code on GitHub</h4>
                <p>Authorize with a simple verification code</p>
              </div>
            </div>
          </div>

          <button onClick={onLogin} className="btn btn-primary btn-large">
            <i className="fab fa-github"></i> Login with GitHub
          </button>

          <div className="security-badges">
            <div className="badge">
              <i className="fas fa-lock"></i>
              <span>Encrypted</span>
            </div>
            <div className="badge">
              <i className="fas fa-user-shield"></i>
              <span>Secure</span>
            </div>
            <div className="badge">
              <i className="fas fa-eye-slash"></i>
              <span>Private</span>
            </div>
          </div>

          <div className="features-list">
            <h4>What you can access:</h4>
            <div className="features-grid">
              <div className="feature">
                <i className="fas fa-book"></i>
                <span>Public Repositories</span>
              </div>
              <div className="feature">
                <i className="fas fa-lock"></i>
                <span>Private Repositories</span>
              </div>
              <div className="feature">
                <i className="fas fa-users"></i>
                <span>Organization Repos</span>
              </div>
              <div className="feature">
                <i className="fas fa-chart-bar"></i>
                <span>Repository Stats</span>
              </div>
              <div className="feature">
                <i className="fas fa-search"></i>
                <span>Advanced Search</span>
              </div>
              <div className="feature">
                <i className="fas fa-sort"></i>
                <span>Smart Filtering</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginSection;