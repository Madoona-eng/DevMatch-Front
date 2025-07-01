// Utility functions for consistent user ID handling
export const getUserId = (user) => {
  if (!user) return null;
  return user.id || user._id || null;
};

export const isSameUser = (user1, user2) => {
  const id1 = getUserId(user1);
  const id2 = getUserId(user2);
  return id1 && id2 && id1 === id2;
};

// Normalize user object so that id is always present
export function normalizeUser(user) {
  if (!user) return user;
  if (user._id && !user.id) {
    user.id = user._id;
  }
  return user;
}

export const getUserFromStorage = () => {
  try {
    const userStr = localStorage.getItem('devmatch_user');
    if (!userStr) return null;
    const user = JSON.parse(userStr);
    return normalizeUser(user);
  } catch (error) {
    console.error('Error parsing user from storage:', error);
    localStorage.removeItem('devmatch_user');
    return null;
  }
};

export const saveUserToStorage = (user) => {
  try {
    if (!user) {
      localStorage.removeItem('devmatch_user');
      return;
    }
    const normalized = normalizeUser(user);
    localStorage.setItem('devmatch_user', JSON.stringify(normalized));
    console.log('User saved to storage:', { id: normalized.id, name: normalized.name });
  } catch (error) {
    console.error('Error saving user to storage:', error);
  }
};

export const clearUserFromStorage = () => {
  localStorage.removeItem('devmatch_user');
  localStorage.removeItem('token');
  console.log('User cleared from storage');
}; 