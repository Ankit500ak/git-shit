import React, { useState, useEffect } from 'react';
import { LinkManagementService, SharedLink } from '../services/LinkManagementService';
import { User } from '../App';
import LinkTester from './LinkTester';
import './LinkManagement.css';

interface LinkManagementProps {
  user: User;
  onClose: () => void;
}

const LinkManagement: React.FC<LinkManagementProps> = ({ user, onClose }) => {
  const [userLinks, setUserLinks] = useState<SharedLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [showTester, setShowTester] = useState(false);

  useEffect(() => {
    loadUserLinks();
  }, [user]);

  const loadUserLinks = () => {
    setLoading(true);
    try {
      const links = LinkManagementService.getUserLinks(user.login);
      setUserLinks(links);
    } catch (error) {
      console.error('Failed to load user links:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteLink = (linkId: string) => {
    if (window.confirm('Are you sure you want to delete this shared link?')) {
      const success = LinkManagementService.deleteLink(linkId, user.login);
      if (success) {
        loadUserLinks(); // Refresh the list
      } else {
        alert('Failed to delete link');
      }
    }
  };

  const handleExtendLink = (linkId: string) => {
    const additionalHours = 24; // Extend by 1 day
    const success = LinkManagementService.extendLinkExpiration(linkId, additionalHours, user.login);
    if (success) {
      loadUserLinks(); // Refresh the list
      alert('Link expiration extended by 24 hours');
    } else {
      alert('Failed to extend link expiration');
    }
  };

  const handleCopyLink = async (linkId: string) => {
    const shareableUrl = `${window.location.origin}/share/${linkId}`;
    try {
      await navigator.clipboard.writeText(shareableUrl);
      alert('Link copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy link:', error);
      alert('Failed to copy link');
    }
  };

  const formatTimeRemaining = (expiresAt: Date): string => {
    const now = new Date();
    const diffMs = expiresAt.getTime() - now.getTime();
    
    if (diffMs <= 0) return 'Expired';
    
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    if (diffDays > 0) {
      return `${diffDays}d ${diffHours}h`;
    } else if (diffHours > 0) {
      return `${diffHours}h ${diffMinutes}m`;
    } else {
      return `${diffMinutes}m`;
    }
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (showTester) {
    return <LinkTester onBack={() => setShowTester(false)} />;
  }

  return (
    <div className="link-management-overlay">
      <div className="link-management-modal">
        <div className="modal-header">
          <h2>
            <i className="fas fa-link"></i>
            Manage Shared Links
          </h2>
          <button className="close-btn" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="modal-content">
          <div className="management-actions">
            <button 
              className="btn btn-secondary"
              onClick={() => setShowTester(true)}
            >
              <i className="fas fa-test-tube"></i>
              Test a Link
            </button>
            <button 
              className="btn btn-primary"
              onClick={loadUserLinks}
            >
              <i className="fas fa-sync-alt"></i>
              Refresh
            </button>
          </div>

          {loading ? (
            <div className="loading-state">
              <div className="loading-spinner">
                <i className="fas fa-spinner fa-spin"></i>
              </div>
              <p>Loading your shared links...</p>
            </div>
          ) : (
            <>
              {userLinks.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">
                    <i className="fas fa-link"></i>
                  </div>
                  <h3>No Shared Links</h3>
                  <p>You haven't created any shared repository links yet.</p>
                </div>
              ) : (
                <div className="links-list">
                  <div className="list-header">
                    <h3>Your Shared Links ({userLinks.length})</h3>
                  </div>
                  
                  {userLinks.map((link) => {
                    const isExpired = link.expiresAt < new Date();
                    
                    return (
                      <div key={link.id} className={`link-item ${isExpired ? 'expired' : ''}`}>
                        <div className="link-info">
                          <div className="link-summary">
                            <div className="link-stats">
                              <span className="repo-count">
                                <i className="fas fa-database"></i>
                                {link.repositories.length} repos
                              </span>
                              <span className="access-count">
                                <i className="fas fa-eye"></i>
                                {link.accessCount} views
                              </span>
                              <span className="privacy-indicator">
                                <i className={`fas ${link.includePrivate ? 'fa-lock' : 'fa-globe'}`}></i>
                                {link.includePrivate ? 'Private + Public' : 'Public Only'}
                              </span>
                            </div>
                            
                            <div className="link-dates">
                              <div className="created-date">
                                <strong>Created:</strong> {formatDate(link.createdAt)}
                              </div>
                              <div className={`expiry-date ${isExpired ? 'expired' : ''}`}>
                                <strong>Expires:</strong> {formatDate(link.expiresAt)}
                                <span className="time-remaining">
                                  ({formatTimeRemaining(link.expiresAt)})
                                </span>
                              </div>
                              {link.lastAccessed && (
                                <div className="last-accessed">
                                  <strong>Last accessed:</strong> {formatDate(link.lastAccessed)}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="link-actions">
                          {!isExpired && (
                            <>
                              <button
                                className="action-btn copy-btn"
                                onClick={() => handleCopyLink(link.id)}
                                title="Copy link to clipboard"
                              >
                                <i className="fas fa-copy"></i>
                              </button>
                              <button
                                className="action-btn extend-btn"
                                onClick={() => handleExtendLink(link.id)}
                                title="Extend expiration by 24 hours"
                              >
                                <i className="fas fa-clock"></i>
                              </button>
                            </>
                          )}
                          <button
                            className="action-btn delete-btn"
                            onClick={() => handleDeleteLink(link.id)}
                            title="Delete this shared link"
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default LinkManagement;