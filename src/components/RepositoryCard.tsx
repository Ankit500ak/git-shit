import React from 'react';
import { Repository } from '../App';
import './RepositoryCard.css';

interface RepositoryCardProps {
  repository: Repository;
}

const RepositoryCard: React.FC<RepositoryCardProps> = ({ repository }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getLanguageColor = (language: string | null) => {
    if (!language) return '#gray';
    
    const colors: { [key: string]: string } = {
      'JavaScript': '#f1e05a',
      'TypeScript': '#2b7489',
      'Python': '#3572A5',
      'Java': '#b07219',
      'HTML': '#e34c26',
      'CSS': '#1572B6',
      'C': '#555555',
      'C++': '#f34b7d',
      'C#': '#239120',
      'Go': '#00ADD8',
      'Rust': '#dea584',
      'PHP': '#4F5D95',
      'Ruby': '#701516',
      'Swift': '#fa7343',
      'Kotlin': '#7F52FF',
      'Dart': '#00B4AB'
    };
    
    return colors[language] || '#gray';
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    if (diffInHours < 720) return `${Math.floor(diffInHours / 168)}w ago`;
    return `${Math.floor(diffInHours / 720)}mo ago`;
  };

  const openRepository = () => {
    window.open(repository.html_url, '_blank');
  };

  const stopPropagation = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div className="repo-card" onClick={openRepository}>
      <div className="repo-card-inner">
        {/* Card Header */}
        <div className="repo-header">
          <div className="repo-title-section">
            <div className="repo-icon">
              <i className={`fas ${repository.private ? 'fa-lock' : 'fa-book-open'}`}></i>
            </div>
            <div className="repo-title-info">
              <h3 className="repo-name" title={repository.name}>
                {repository.name}
              </h3>
              <div className="repo-visibility">
                <span className={`visibility-badge ${repository.private ? 'private' : 'public'}`}>
                  <i className={`fas ${repository.private ? 'fa-lock' : 'fa-globe'}`}></i>
                  {repository.private ? 'Private' : 'Public'}
                </span>
              </div>
            </div>
          </div>
          
          <div className="repo-actions" onClick={stopPropagation}>
            <button className="action-btn star-btn" title="Star Repository">
              <i className="fas fa-star"></i>
            </button>
            <button className="action-btn external-btn" title="Open in GitHub">
              <i className="fas fa-external-link-alt"></i>
            </button>
          </div>
        </div>

        {/* Description */}
        <div className="repo-content">
          {repository.description ? (
            <p className="repo-description" title={repository.description}>
              {repository.description}
            </p>
          ) : (
            <p className="repo-description no-description">
              <i className="fas fa-info-circle"></i>
              No description available
            </p>
          )}
        </div>

        {/* Topics/Tags */}
        {repository.topics && repository.topics.length > 0 && (
          <div className="repo-topics">
            {repository.topics.slice(0, 3).map((topic: string, index: number) => (
              <span key={index} className="topic-tag">
                {topic}
              </span>
            ))}
            {repository.topics.length > 3 && (
              <span className="topic-tag more-topics">
                +{repository.topics.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Stats Bar */}
        <div className="repo-stats">
          <div className="stats-row">
            {repository.language && (
              <div className="repo-stat language-stat" title={`Primary language: ${repository.language}`}>
                <span 
                  className="language-dot" 
                  style={{ backgroundColor: getLanguageColor(repository.language) }}
                ></span>
                <span className="stat-text">{repository.language}</span>
              </div>
            )}
            
            <div className="repo-stat" title={`${repository.stargazers_count} stars`}>
              <i className="fas fa-star"></i>
              <span className="stat-text">{formatNumber(repository.stargazers_count)}</span>
            </div>
            
            <div className="repo-stat" title={`${repository.forks_count} forks`}>
              <i className="fas fa-code-branch"></i>
              <span className="stat-text">{formatNumber(repository.forks_count)}</span>
            </div>

            {repository.size && (
              <div className="repo-stat" title={`Repository size: ${Math.round(repository.size / 1024)} MB`}>
                <i className="fas fa-hdd"></i>
                <span className="stat-text">{Math.round(repository.size / 1024)} MB</span>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="repo-footer">
          <div className="repo-updated">
            <i className="fas fa-history"></i>
            Updated {getTimeAgo(repository.updated_at)}
          </div>
          
          <div className="repo-created">
            <i className="fas fa-calendar-plus"></i>
            Created {formatDate(repository.created_at)}
          </div>
        </div>

        {/* Hover Overlay */}
        <div className="repo-card-overlay">
          <div className="overlay-content">
            <h4>
              <i className="fab fa-github"></i>
              Open in GitHub
            </h4>
            <p>View repository details, code, and contribute</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RepositoryCard;