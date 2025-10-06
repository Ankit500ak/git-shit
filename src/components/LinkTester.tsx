import React, { useState } from 'react';
import SharedRepositoryView from './SharedRepositoryView';

interface LinkTesterProps {
  onBack: () => void;
}

const LinkTester: React.FC<LinkTesterProps> = ({ onBack }) => {
  const [testLinkId, setTestLinkId] = useState('');
  const [showViewer, setShowViewer] = useState(false);

  const handleTestLink = () => {
    if (testLinkId.trim()) {
      setShowViewer(true);
    }
  };

  const extractLinkId = (url: string): string => {
    // Extract link ID from URLs like "http://localhost:3000/share/abc123"
    const match = url.match(/\/share\/([^/?#]+)/);
    return match ? match[1] : url;
  };

  const handleUrlInput = (value: string) => {
    const linkId = extractLinkId(value);
    setTestLinkId(linkId);
  };

  if (showViewer) {
    return <SharedRepositoryView linkId={testLinkId} />;
  }

  return (
    <div style={{
      maxWidth: '600px',
      margin: '2rem auto',
      padding: '2rem',
      background: 'rgba(255, 255, 255, 0.95)',
      borderRadius: '24px',
      boxShadow: '0 20px 50px rgba(0, 0, 0, 0.1)',
      border: '2px solid rgba(102, 126, 234, 0.15)'
    }}>
      <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <h2 style={{
          fontSize: '1.8rem',
          fontWeight: '800',
          color: '#1a1a1a',
          margin: '0 0 1rem 0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.75rem'
        }}>
          <i className="fas fa-link" style={{ color: '#667eea' }}></i>
          Test Shared Link
        </h2>
        <p style={{
          color: '#666',
          fontSize: '1.1rem',
          margin: '0'
        }}>
          Enter a shared repository link or link ID to test the sharing feature
        </p>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <label style={{
          display: 'block',
          fontWeight: '700',
          color: '#1a1a1a',
          marginBottom: '0.75rem',
          fontSize: '1.1rem'
        }}>
          Shared Link or Link ID:
        </label>
        <input
          type="text"
          value={testLinkId}
          onChange={(e) => handleUrlInput(e.target.value)}
          placeholder="Enter full URL or just the link ID..."
          style={{
            width: '100%',
            padding: '1rem 1.25rem',
            border: '2px solid rgba(200, 200, 200, 0.5)',
            borderRadius: '12px',
            fontSize: '0.95rem',
            fontFamily: 'Monaco, Consolas, monospace',
            background: 'rgba(248, 248, 248, 0.8)',
            color: '#1a1a1a',
            fontWeight: '500',
            boxSizing: 'border-box'
          }}
          onKeyPress={(e) => e.key === 'Enter' && handleTestLink()}
        />
        <p style={{
          fontSize: '0.85rem',
          color: '#666',
          margin: '0.5rem 0 0 0'
        }}>
          You can paste the full shared URL or just the link ID portion
        </p>
      </div>

      <div style={{
        display: 'flex',
        gap: '1rem',
        justifyContent: 'flex-end'
      }}>
        <button
          onClick={onBack}
          style={{
            padding: '1rem 2rem',
            borderRadius: '16px',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.75rem',
            border: 'none',
            background: 'rgba(255, 255, 255, 0.8)',
            color: '#666'
          }}
        >
          <i className="fas fa-arrow-left"></i>
          Back
        </button>
        <button
          onClick={handleTestLink}
          disabled={!testLinkId.trim()}
          style={{
            padding: '1rem 2rem',
            borderRadius: '16px',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: testLinkId.trim() ? 'pointer' : 'not-allowed',
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.75rem',
            border: 'none',
            background: testLinkId.trim() 
              ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
              : 'rgba(200, 200, 200, 0.5)',
            color: 'white',
            opacity: testLinkId.trim() ? 1 : 0.7
          }}
        >
          <i className="fas fa-external-link-alt"></i>
          Test Link
        </button>
      </div>
    </div>
  );
};

export default LinkTester;