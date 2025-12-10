// Token Manager - Centralized access token management
// Access token stored in memory (not localStorage for security)

let accessToken = null;
let refreshTimeout = null;

/**
 * Store access token in memory
 */
export const setAccessToken = (token) => {
  accessToken = token;
  console.log('✅ Access token stored in memory');
};

/**
 * Get access token from memory
 */
export const getAccessToken = () => {
  return accessToken;
};

/**
 * Clear access token from memory
 */
export const clearAccessToken = () => {
  accessToken = null;
  clearTimeout(refreshTimeout);
  refreshTimeout = null;
  console.log('🗑️ Access token cleared');
};

/**
 * Schedule automatic token refresh before expiry
 * @param {number} expiresIn - Token expiry time in seconds
 */
export const scheduleTokenRefresh = (expiresIn = 900) => {
  // Clear any existing timeout
  if (refreshTimeout) {
    clearTimeout(refreshTimeout);
  }
  
  // Refresh 1 minute before expiry (or 60 seconds if expires sooner)
  const refreshTime = Math.max((expiresIn * 1000) - 60000, 5000);
  
  refreshTimeout = setTimeout(async () => {
    try {
      console.log('🔄 Auto-refreshing access token...');
      
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth/refresh`, {
        method: 'POST',
        credentials: 'include' // Send cookies
      });
      
      if (response.ok) {
        const data = await response.json();
        setAccessToken(data.accessToken);
        
        // Schedule next refresh
        scheduleTokenRefresh(900); // 15 minutes
        
        console.log('✅ Token refreshed successfully');
      } else {
        console.error('❌ Token refresh failed');
        // Refresh failed - let user stay logged in until they make a request
        // The apiSlice will handle the 401 and try to refresh then
      }
    } catch (error) {
      console.error('❌ Token refresh error:', error);
    }
  }, refreshTime);
  
  console.log(`⏰ Token refresh scheduled in ${Math.round(refreshTime / 1000)} seconds`);
};

/**
 * Decode JWT token (client-side, don't trust for security)
 * Used only for displaying info or scheduling refresh
 */
export const decodeToken = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('❌ Error decoding token:', error);
    return null;
  }
};
