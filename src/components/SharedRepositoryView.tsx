import React, { useState, useEffect } from 'react';
import './SharedRepositoryView.css';
import { LinkManagementService, SharedLink } from '../services/LinkManagementService';

interface SharedRepositoryViewProps {
  linkId?: string;
}

const SharedRepositoryView: React.FC<SharedRepositoryViewProps> = ({ linkId }) => {
  const [linkData, setLinkData] = useState<SharedLink | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expiredTime, setExpiredTime] = useState<string>('');

  useEffect(() => {
    const loadSharedData = async () => {
      try {
        if (!linkId) {
          setError('No link ID provided');
          setLoading(false);
          return;
        }

        // Validate the link using the management service

        const validation = LinkManagementService.validateLink(linkId);
        
        if (!validation.isValid) {
          if (validation.error?.includes('expired')) {
            setExpiredTime('recently');
          }
          setError(validation.error || 'Link not found');
          setLoading(false);
          return;
        }

        if (validation.link) {
          setLinkData(validation.link);
        }
        setLoading(false);
      } catch (err) {
        setError('Failed to load shared repositories');
        setLoading(false);
      }
    };

    loadSharedData();
  }, [linkId]);

  const formatTimeAgo = (date: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else {
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
    }
  };

  const formatTimeRemaining = (expiresAt: Date): string => {
    const now = new Date();
    const diffMs = expiresAt.getTime() - now.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''}`;
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''}`;
    } else {
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''}`;
    }
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getLanguageColor = (language: string): string => {
    const colors: { [key: string]: string } = {
      'JavaScript': '#f1e05a',
      'TypeScript': '#2b7489',
      'Python': '#3572A5',
      'Java': '#b07219',
      'C++': '#f34b7d',
      'C#': '#239120',
      'PHP': '#4F5D95',
      'Ruby': '#701516',
      'Go': '#00ADD8',
      'Rust': '#dea584',
      'Swift': '#ffac45',
      'Kotlin': '#F18E33',
      'Dart': '#00B4AB',
      'HTML': '#e34c26',
      'CSS': '#1572B6',
      'Shell': '#89e051',
      'Dockerfile': '#384d54'
    };
    return colors[language] || '#666666';
  };

  if (loading) {
    return (
      <div className="shared-view-container">
        <div className="loading-state">
          <div className="loading-spinner">
            <i className="fas fa-spinner fa-spin"></i>
          </div>
          <h3>Loading shared repositories...</h3>
          <p>Please wait while we fetch the repository data</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="shared-view-container">
        <div className="error-state">
          <div className="error-icon">
            <i className="fas fa-exclamation-triangle"></i>
          </div>
          <h3>Unable to Access Repositories</h3>
          <p>{error}</p>
          {expiredTime && (
            <div className="expired-info">
              <p>Links have expiration times for security purposes.</p>
              <p>You may need to request a new sharing link from the repository owner.</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (!linkData) {
    return null;
  }

  const publicRepos = linkData.repositories.filter(repo => !repo.private);
  const privateRepos = linkData.repositories.filter(repo => repo.private);
  const displayRepos = linkData.includePrivate ? linkData.repositories : publicRepos;

  return (
    <div className="shared-view-container">
      {/* Header */}
      <div className="shared-header">
        <div className="header-content">
          <div className="user-info">
            <img 
              src={`https://github.com/${linkData.username}.png`} 
              alt={linkData.username}
              className="user-avatar"
            />
            <div className="user-details">
              <h1>{linkData.username}'s Repositories</h1>
              <p>Shared repository collection</p>
            </div>
          </div>
          
          <div className="share-info">
            <div className="info-badge expires-badge">
              <i className="fas fa-clock"></i>
              <span>Expires in {formatTimeRemaining(linkData.expiresAt)}</span>
            </div>
            <div className="info-badge created-badge">
              <i className="fas fa-calendar"></i>
              <span>Shared on {formatDate(linkData.createdAt)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Repository Stats */}
      <div className="repo-stats">
        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-code-branch"></i>
          </div>
          <div className="stat-details">
            <span className="stat-number">{displayRepos.length}</span>
            <span className="stat-label">
              {displayRepos.length === 1 ? 'Repository' : 'Repositories'}
            </span>
          </div>
        </div>

        {linkData.includePrivate && privateRepos.length > 0 && (
          <div className="stat-card private-included">
            <div className="stat-icon">
              <i className="fas fa-lock"></i>
            </div>
            <div className="stat-details">
              <span className="stat-number">{privateRepos.length}</span>
              <span className="stat-label">Private</span>
            </div>
          </div>
        )}

        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-globe"></i>
          </div>
          <div className="stat-details">
            <span className="stat-number">{publicRepos.length}</span>
            <span className="stat-label">Public</span>
          </div>
        </div>
      </div>

      {/* Repository List */}
      <div className="shared-repositories">
        <div className="repositories-header">
          <h2>
            <i className="fas fa-folder-open"></i>
            Repositories
          </h2>
          <div className="view-options">
            <span className="total-count">{displayRepos.length} repositories</span>
          </div>
        </div>

        <div className="repository-grid">
          {displayRepos.map((repo) => (
            <div key={repo.id} className="repository-card">
              <div className="repo-header">
                <div className="repo-title">
                  <h3>
                    <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
                      {repo.name}
                    </a>
                  </h3>
                  <div className="repo-badges">
                    {repo.private && (
                      <span className="badge private-badge">
                        <i className="fas fa-lock"></i>
                        Private
                      </span>
                    )}
                    {repo.fork && (
                      <span className="badge fork-badge">
                        <i className="fas fa-code-branch"></i>
                        Fork
                      </span>
                    )}
                    {repo.archived && (
                      <span className="badge archived-badge">
                        <i className="fas fa-archive"></i>
                        Archived
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {repo.description && (
                <p className="repo-description">{repo.description}</p>
              )}

              <div className="repo-stats">
                {repo.language && (
                  <div className="stat-item">
                    <span 
                      className="language-color"
                      style={{ backgroundColor: getLanguageColor(repo.language) }}
                    ></span>
                    <span>{repo.language}</span>
                  </div>
                )}
                
                <div className="stat-item">
                  <i className="fas fa-star"></i>
                  <span>{repo.stargazers_count}</span>
                </div>
                
                <div className="stat-item">
                  <i className="fas fa-code-branch"></i>
                  <span>{repo.forks_count}</span>
                </div>
                
                <div className="stat-item">
                  <i className="fas fa-clock"></i>
                  <span>Updated {new Date(repo.updated_at).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="repo-actions">
                <a 
                  href={repo.html_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="action-btn view-btn"
                >
                  <i className="fab fa-github"></i>
                  View on GitHub
                </a>
                {repo.homepage && (
                  <a 
                    href={repo.homepage} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="action-btn demo-btn"
                  >
                    <i className="fas fa-external-link-alt"></i>
                    Live Demo
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        {displayRepos.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">
              <i className="fas fa-folder-open"></i>
            </div>
            <h3>No repositories to display</h3>
            <p>This user hasn't shared any repositories that match the current privacy settings.</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="shared-footer">
        <div className="footer-content">
          <div className="powered-by">
            <i className="fas fa-share-alt"></i>
            <span>Powered by GitHub Repository Viewer</span>
          </div>
          <div className="security-notice">
            <i className="fas fa-shield-alt"></i>
            <span>This link will expire {formatDate(linkData.expiresAt)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SharedRepositoryView;