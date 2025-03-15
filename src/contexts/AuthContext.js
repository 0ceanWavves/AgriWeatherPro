import React, { createContext, useContext } from 'react';

// Create the auth context
const AuthContext = createContext();

// Hook for accessing the auth context
export function useAuth() {
  return useContext(AuthContext);
}

// Modified auth provider that bypasses actual authentication
export function AuthProvider({ children }) {
  // Create a dummy user that will satisfy auth checks
  const dummyUser = {
    id: 'temp-user-001',
    email: 'demo@example.com',
    user_metadata: {
      full_name: 'Demo User'
    },
    app_metadata: {},
    email_confirmed_at: new Date().toISOString(), // Pretend email is verified
  };

  // Create dummy profile data
  const dummyProfile = {
    id: 'temp-user-001',
    first_name: 'Demo',
    last_name: 'User',
    avatar_url: null,
  };

  // Mock functions that would normally interact with Supabase
  const signUp = async () => ({ data: { user: dummyUser }, error: null });
  const signIn = async () => ({ data: { user: dummyUser }, error: null });
  const signOut = async () => ({ error: null });
  const resetPassword = async () => ({ data: {}, error: null });
  const resendVerification = async () => ({ data: {}, error: null });
  const isEmailVerified = async () => true;
  const updateProfile = async (profileData) => ({
    data: { ...dummyProfile, ...profileData },
    error: null
  });

  // Auth context value
  const value = {
    user: dummyUser,
    userProfile: dummyProfile,
    loading: false,
    signUp,
    signIn,
    login: signIn,
    signOut,
    resetPassword,
    updateProfile,
    resendVerification,
    isEmailVerified
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;