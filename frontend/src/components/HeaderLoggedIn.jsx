// HeaderLoggedIn.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/app-context';
import { Tooltip as ReactTooltip } from 'react-tooltip';

function HeaderLoggedIn() {
  const { user, logout, addFlashMessage, openSearch, toggleChat, unreadChatCount } = useApp();

  const handleLogOut = () => {
    logout();
    addFlashMessage('You have successfully logged out.', 'success');
  };

  const handleSearchOpen = (e) => {
    openSearch();
  };

  const handleChatToggle = (e) => {
    toggleChat();
  };

  return (
    <div className="flex-row my-3 my-md-0">
      <button
        type="button"
        data-tooltip-id="search"
        data-tooltip-content="Search"
        onClick={handleSearchOpen}
        className="text-white mr-2 header-search-icon btn btn-link p-0"
        aria-label="Open search"
      >
        <i className="fas fa-search" />
      </button>

      <button
        type="button"
        data-tooltip-id="chat"
        data-tooltip-content="Chat"
        onClick={handleChatToggle}
        className={"mr-2 header-chat-icon btn btn-link p-0 " + (Number(unreadChatCount) > 0 ? "text-danger" : "text-white")}
        aria-label="Toggle chat"
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleChatToggle();
          }
        }}
      >
        <i className="fas fa-comment"/>
        { Number(unreadChatCount) > 0 ? 
        <span className="chat-count-badge text-white">
          {Number(unreadChatCount) < 10 ? unreadChatCount : "9+"}
        </span>
         : "" }
        <ReactTooltip id="chat" place="bottom" effect="float" className="custom-tooltip" />
      </button>

      <Link
        data-tooltip-id="profile"
        data-tooltip-content="Profile"
        to={`/profile/${user?.username}`}
        className="mr-2"
      >
        <img className="small-header-avatar" src={user?.avatar || '/default-avatar.png'} alt="avatar" />
      </Link>

      <Link className="btn btn-sm btn-success mr-2" to="/create-post">
        Create Post
      </Link>

      <button onClick={handleLogOut} className="btn btn-sm btn-secondary">
        Sign Out
      </button>

      {/* Place tooltip components once (not nested) */}
      <ReactTooltip id="search" place="bottom" effect="float" className="custom-tooltip" />
      <ReactTooltip id="chat" place="bottom" effect="float" className="custom-tooltip" />
      <ReactTooltip id="profile" place="bottom" effect="float" className="custom-tooltip" />
    </div>
  );
}

export default HeaderLoggedIn;
