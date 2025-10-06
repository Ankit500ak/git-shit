import React from 'react';
import { User } from '../App';
import './Header.css';

interface HeaderProps {
  user: User | null;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout }) => {
  return (
    <header className="header">
      <div className="container">
        <h1>
          <i className="fab fa-github"></i> GitShit
        </h1>
        {user && (
          <div className="user-info">
            <img 
              src={user.avatar_url} 
              alt="User Avatar" 
              className="avatar"
            />
            <span>{user.name || user.login}</span>
            <button onClick={onLogout} className="btn btn-secondary">
              Change User
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;