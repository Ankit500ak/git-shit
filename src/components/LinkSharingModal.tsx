import React, { useState } from 'react';
import './LinkSharingModal.css';
import { LinkManagementService } from '../services/LinkManagementService';
import { Repository, User } from '../App';

interface LinkSharingModalProps {
  repositories: Repository[];
  user: User;
  isOpen: boolean;
  onClose: () => void;
}

const LinkSharingModal: React.FC<LinkSharingModalProps> = ({
  repositories,
  user,
  isOpen,
  onClose
}) => {
  const [expirationTime, setExpirationTime] = useState('24h');
  const [includePrivate, setIncludePrivate] = useState(true);
  const [generatedLink, setGeneratedLink] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [linkCreated, setLinkCreated] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const expirationOptions = [
    { value: '1h', label: '1 Hour' },
    { value: '6h', label: '6 Hours' },
    { value: '12h', label: '12 Hours' },
    { value: '24h', label: '24 Hours' },
    { value: '48h', label: '48 Hours' },
    { value: '7d', label: '7 Days' },
    { value: '30d', label: '30 Days' }
  ];

  const generateLink = async () => {
    if (isGenerating) return;
    
    setIsGenerating(true);
    setError(null);
    
    try {
      const expirationHours = getExpirationHours(expirationTime);
      
      const shareableUrl = LinkManagementService.createLink({
        repositories,
        user,
        includePrivate,
        expirationHours
      });
      
      setGeneratedLink(shareableUrl);
      setLinkCreated(true);
    } catch (error) {
      console.error('Failed to generate link:', error);
      setError('Failed to create sharing link. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const getExpirationHours = (time: string): number => {
    const hours = {
      '1h': 1,
      '6h': 6,
      '12h': 12,
      '24h': 24,
      '48h': 48,
      '7d': 7 * 24,
      '30d': 30 * 24
    };
    return hours[time as keyof typeof hours] || 24;
  };

  const formatExpirationTime = (time: string): string => {
    const labels = {
      '1h': '1 hour',
      '6h': '6 hours', 
      '12h': '12 hours',
      '24h': '1 day',
      '48h': '2 days',
      '7d': '7 days',
      '30d': '30 days'
    };
    return labels[time as keyof typeof labels] || '1 day';
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedLink);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const resetForm = () => {
    setGeneratedLink('');
    setLinkCreated(false);
    setCopySuccess(false);
    setError(null);
    setIsGenerating(false);
  };

  const handleClose = () => {
    resetForm();
    setExpirationTime('24h');
    setIncludePrivate(true);
    onClose();
  };

  if (!isOpen) return null;

  const privateRepoCount = repositories.filter(repo => repo.private).length;
  const publicRepoCount = repositories.length - privateRepoCount;

  return (
    <div className="link-sharing-overlay">
      <div className="link-sharing-modal">
        <div className="modal-header">
          <h2>
            <i className="fas fa-share-alt"></i>
            Share Repository Collection
          </h2>
          <button className="close-btn" onClick={handleClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="modal-content">
          {error && (
            <div className="error-message">
              <i className="fas fa-exclamation-triangle"></i>
              {error}
            </div>
          )}
          
          {!linkCreated ? (
            <>
              <div className="share-info">
                <div className="repo-summary">
                  <div className="summary-card">
                    <div className="summary-icon">
                      <i className="fas fa-database"></i>
                    </div>
                    <div className="summary-details">
                      <h4>Repository Summary</h4>
                      <p>
                        <span className="count">{repositories.length}</span> Total Repositories
                      </p>
                      <div className="repo-breakdown">
                        <span className="public-count">
                          <i className="fas fa-globe"></i>
                          {publicRepoCount} Public
                        </span>
                        <span className="private-count">
                          <i className="fas fa-lock"></i>
                          {privateRepoCount} Private
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="privacy-settings">
                  <h3>Privacy Settings</h3>
                  <div className="privacy-option">
                    <label className="privacy-toggle">
                      <input
                        type="checkbox"
                        checked={includePrivate}
                        onChange={(e) => setIncludePrivate(e.target.checked)}
                      />
                      <span className="toggle-slider"></span>
                      <div className="toggle-content">
                        <strong>Include Private Repositories</strong>
                        <p>
                          {includePrivate 
                            ? `Sharing ${repositories.length} repositories (including ${privateRepoCount} private)`
                            : `Sharing ${publicRepoCount} public repositories only`
                          }
                        </p>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="expiration-settings">
                  <h3>Link Expiration</h3>
                  <div className="expiration-options">
                    {expirationOptions.map((option) => (
                      <label key={option.value} className="expiration-option">
                        <input
                          type="radio"
                          name="expiration"
                          value={option.value}
                          checked={expirationTime === option.value}
                          onChange={(e) => setExpirationTime(e.target.value)}
                        />
                        <span className="option-content">
                          <i className="fas fa-clock"></i>
                          {option.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="modal-actions">
                <button className="btn btn-secondary" onClick={onClose}>
                  <i className="fas fa-times"></i>
                  Cancel
                </button>
                <button 
                  className="btn btn-primary" 
                  onClick={generateLink}
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i>
                      Generating...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-link"></i>
                      Generate Shareable Link
                    </>
                  )}
                </button>
              </div>
            </>
          ) : (
            <div className="link-generated">
              <div className="success-header">
                <div className="success-icon">
                  <i className="fas fa-check-circle"></i>
                </div>
                <h3>Link Generated Successfully!</h3>
                <p>Your repository collection is now ready to share</p>
              </div>

              <div className="link-details">
                <div className="link-info">
                  <div className="info-item">
                    <i className="fas fa-database"></i>
                    <span>
                      {includePrivate ? repositories.length : publicRepoCount} repositories included
                    </span>
                  </div>
                  <div className="info-item">
                    <i className="fas fa-clock"></i>
                    <span>Expires in {formatExpirationTime(expirationTime)}</span>
                  </div>
                  <div className="info-item">
                    <i className="fas fa-eye"></i>
                    <span>
                      {includePrivate ? 'Private & Public repos' : 'Public repos only'}
                    </span>
                  </div>
                </div>

                <div className="generated-link">
                  <label>Shareable Link:</label>
                  <div className="link-container">
                    <input
                      type="text"
                      value={generatedLink}
                      readOnly
                      className="link-input"
                    />
                    <button 
                      className={`copy-btn ${copySuccess ? 'copied' : ''}`}
                      onClick={copyToClipboard}
                    >
                      {copySuccess ? (
                        <>
                          <i className="fas fa-check"></i>
                          Copied!
                        </>
                      ) : (
                        <>
                          <i className="fas fa-copy"></i>
                          Copy
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <div className="modal-actions">
                <button className="btn btn-secondary" onClick={resetForm}>
                  <i className="fas fa-plus"></i>
                  Generate Another
                </button>
                <button className="btn btn-primary" onClick={onClose}>
                  <i className="fas fa-check"></i>
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LinkSharingModal;