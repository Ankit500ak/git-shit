import React, { useState } from 'react';
import { GitHubService } from '../services/GitHubService';
import './AuthFlow.css';

interface AuthFlowProps {
  onAuth: () => void;
  onCancel: () => void;
}

const AuthFlow: React.FC<AuthFlowProps> = ({ onAuth, onCancel }) => {
  const [step, setStep] = useState<'start' | 'token-input' | 'authenticating' | 'error'>('start');
  const [token, setToken] = useState('');
  const [error, setError] = useState('');

  const handleStartAuth = () => {
    setStep('token-input');
  };

  const handleTokenSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token.trim()) {
      setError('Please enter your Personal Access Token');
      return;
    }

    setStep('authenticating');
    setError('');

    try {
      await GitHubService.authenticateWithToken(token);
      onAuth();
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
      setStep('error');
    }
  };

  const handleRetry = () => {
    setStep('token-input');
    setError('');
    setToken('');
  };

  return (
    <div className="auth-flow-overlay">
      <div className="auth-flow-modal">
        {step === 'start' && (
          <div className="auth-step">
            <div className="github-logo">
              <i className="fab fa-github"></i>
            </div>
            <h3>Authenticate with GitHub</h3>
            <p>Connect to access all your repositories (public and private)</p>
            
            <div className="auth-info">
              <div style={{background: '#e3f2fd', border: '1px solid #2196f3', borderRadius: '8px', padding: '16px', marginBottom: '16px'}}>
                <h4 style={{margin: '0 0 12px 0', color: '#1976d2'}}>� Quick Token Setup</h4>
                <button 
                  onClick={() => window.open('https://github.com/settings/tokens/new?scopes=repo,user,read:org&description=GitHub%20Repo%20Viewer%20App', '_blank')}
                  className="btn btn-primary"
                  style={{width: '100%', marginBottom: '12px'}}
                >
                  <i className="fab fa-github"></i> Create Token with Correct Scopes
                </button>
                <p style={{margin: 0, fontSize: '14px', color: '#1976d2'}}>
                  ↑ This link will pre-select the required scopes for you!
                </p>
              </div>

              <details style={{marginBottom: '16px'}}>
                <summary style={{cursor: 'pointer', fontWeight: 'bold', color: '#333'}}>
                  📋 Manual Setup Steps (if needed)
                </summary>
                <ol style={{marginTop: '12px'}}>
                  <li>Go to <a href="https://github.com/settings/tokens" target="_blank" rel="noopener noreferrer">GitHub Settings → Personal Access Tokens</a></li>
                  <li>Click "Generate new token (classic)"</li>
                  <li>
                    <strong>Critical:</strong> Select these exact scopes:
                    <ul style={{marginTop: '8px', paddingLeft: '20px'}}>
                      <li><code>repo</code> - ✅ <strong>MUST BE CHECKED</strong> for private repositories</li>
                      <li><code>user</code> - Read user profile data</li>
                      <li><code>read:org</code> - Read organization data</li>
                    </ul>
                  </li>
                  <li>Copy the generated token and paste it below</li>
                </ol>
              </details>

              <div style={{background: '#ffebee', border: '1px solid #f44336', borderRadius: '6px', padding: '12px'}}>
                <p style={{margin: 0, color: '#d32f2f', fontSize: '14px', fontWeight: 'bold'}}>
                  <i className="fas fa-exclamation-triangle"></i> <strong>Critical:</strong> Without the "repo" scope, only public repositories will be visible!
                </p>
              </div>
            </div>
            
            <button onClick={handleStartAuth} className="btn btn-primary btn-large">
              <i className="fab fa-github"></i> I have my token ready
            </button>
            
            <div className="auth-buttons">
              <button onClick={onCancel} className="btn btn-secondary">
                Cancel
              </button>
            </div>
          </div>
        )}

        {step === 'token-input' && (
          <div className="auth-step">
            <h3>🔑 Enter Your GitHub Token</h3>
            <p>Paste your Personal Access Token below:</p>
            
            <form onSubmit={handleTokenSubmit} className="token-form">
              <div className="form-group">
                <label htmlFor="token">Personal Access Token:</label>
                <input
                  id="token"
                  type="password"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                  className="form-input"
                  autoFocus
                />
              </div>
              
              <div className="auth-buttons">
                <button type="submit" className="btn btn-primary" disabled={!token.trim()}>
                  <i className="fab fa-github"></i> Connect to GitHub
                </button>
                <button type="button" onClick={() => setStep('start')} className="btn btn-secondary">
                  Back
                </button>
              </div>
            </form>
            
            <div className="security-note">
              <p><i className="fas fa-shield-alt"></i> Your token is stored securely in your browser and never sent to third-party servers.</p>
            </div>
          </div>
        )}

        {step === 'authenticating' && (
          <div className="auth-step">
            <div className="loading-message">
              <i className="fas fa-spinner fa-spin"></i>
              <h3>Connecting to GitHub...</h3>
              <p>Validating your credentials</p>
            </div>
          </div>
        )}

        {step === 'error' && (
          <div className="auth-step">
            <div className="error-message">
              <i className="fas fa-exclamation-triangle"></i>
              <h3>Authentication Failed</h3>
              <p>{error}</p>
              
              <div className="auth-buttons">
                <button onClick={onCancel} className="btn btn-secondary">
                  Cancel
                </button>
                <button onClick={handleRetry} className="btn btn-primary">
                  Try Again
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthFlow;