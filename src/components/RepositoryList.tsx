import React, { useState, useMemo } from 'react';
import { Repository } from '../App';
import RepositoryCard from './RepositoryCard';
import LinkSharingModal from './LinkSharingModal';
import LinkManagement from './LinkManagement';
import './RepositoryList.css';

interface RepositoryListProps {
  repositories: Repository[];
  user: any;
  onRefresh: () => void;
}

const RepositoryList: React.FC<RepositoryListProps> = ({ repositories, user, onRefresh }) => {
  const [sortBy, setSortBy] = useState<'updated' | 'created' | 'name' | 'stars'>('updated');
  const [searchTerm, setSearchTerm] = useState('');
  const [showShareModal, setShowShareModal] = useState(false);
  const [showLinkManagement, setShowLinkManagement] = useState(false);

  const filteredAndSortedRepos = useMemo(() => {
    let filtered = repositories.filter(repo =>
      repo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (repo.description && repo.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'stars':
          return b.stargazers_count - a.stargazers_count;
        case 'created':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'updated':
        default:
          return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
      }
    });
  }, [repositories, sortBy, searchTerm]);

  return (
    <div className="repos-section">
      <div className="repos-header">
        <h2>
          <div className="repos-icon">
            <i className="fas fa-folder-open"></i>
          </div>
          <span className="repos-title-text">Your Repositories</span>
          <div className="repo-count-badge">
            <i className="fas fa-database"></i>
            <span className="repo-count-number">{repositories.length}</span>
          </div>
        </h2>
        <div className="filters">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="filter-select"
          >
            <option value="updated">Last Updated</option>
            <option value="created">Created Date</option>
            <option value="name">Name</option>
            <option value="stars">Stars</option>
          </select>
          <input
            type="text"
            placeholder="Search repositories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <button 
            onClick={() => setShowShareModal(true)} 
            className="btn btn-share"
            title="Share your repositories"
          >
            <i className="fas fa-share-alt"></i> Share
          </button>
          <button 
            onClick={() => setShowLinkManagement(true)} 
            className="btn btn-manage-links"
            title="Manage your shared links"
          >
            <i className="fas fa-cog"></i> Manage Links
          </button>
          <button onClick={onRefresh} className="btn btn-secondary">
            <i className="fas fa-sync-alt"></i> Refresh
          </button>
        </div>
      </div>

      {filteredAndSortedRepos.length === 0 ? (
        <div className="no-repos">
          <p>No repositories found.</p>
          {searchTerm && (
            <p>Try adjusting your search term or <button onClick={() => setSearchTerm('')} className="link-button">clear the filter</button>.</p>
          )}
        </div>
      ) : (
        <div className="repos-grid">
          {filteredAndSortedRepos.map((repo) => (
            <RepositoryCard key={repo.id} repository={repo} />
          ))}
        </div>
      )}
      
      {showShareModal && (
        <LinkSharingModal
          repositories={repositories}
          user={user}
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
        />
      )}
      
      {showLinkManagement && (
        <LinkManagement
          user={user}
          onClose={() => setShowLinkManagement(false)}
        />
      )}
    </div>
  );
};

export default RepositoryList;