// Utility functions for managing fresh start experience for new users

export const clearUserData = () => {
  // Clear all user-specific localStorage data
  const keysToRemove = [
    'lit-isle-shelf',
    'lit-isle-reading-progress',
    'lit-isle-bookmarks',
    'lit-isle-notes',
    'lit-isle-preferences',
    'lit-isle-recent-searches',
    'lit-isle-viewed-books'
  ];

  keysToRemove.forEach(key => {
    localStorage.removeItem(key);
  });

  // Clear any session storage
  sessionStorage.clear();
};

export const resetAppState = () => {
  // Clear user data
  clearUserData();
  
  // Force page refresh to reset all component states
  window.location.reload();
};

export const isNewUserSession = () => {
  // Check if this is a new user session (no previous data)
  const hasShelfData = localStorage.getItem('lit-isle-shelf');
  const hasReadingProgress = localStorage.getItem('lit-isle-reading-progress');
  
  return !hasShelfData && !hasReadingProgress;
};

export const markUserAsEstablished = () => {
  // Mark that user has been through the fresh start process
  localStorage.setItem('lit-isle-user-established', 'true');
};

export const isUserEstablished = () => {
  return localStorage.getItem('lit-isle-user-established') === 'true';
};
