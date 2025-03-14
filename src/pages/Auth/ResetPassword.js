import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { FaLeaf, FaLock, FaEye, FaEyeSlash, FaCheckCircle } from 'react-icons/fa';
import { supabase } from '../../lib/supabase';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [hash, setHash] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  
  const navigate = useNavigate();
  
  // Extract hash parameter on component mount
  useEffect(() => {
    // Get the hash from the URL
    const hashFragment = window.location.hash;
    if (hashFragment) {
      setHash(hashFragment);
      console.log('Hash fragment found:', hashFragment);
    } else {
      setError('Invalid or missing reset token. Please request a new password reset link.');
    }
    
    // Check if there's an access_token in the URL (this means Supabase has verified the token)
    if (hashFragment && hashFragment.includes('access_token=')) {
      setMessage('You can now set your new password');
    }
  }, []);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    
    // Validate passwords
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    
    setLoading(true);
    
    try {
      // Use Supabase client to update the password
      const { error } = await supabase.auth.updateUser({ password });
      
      if (error) {
        throw error;
      }
      
      // Password updated successfully
      setIsSuccess(true);
      setMessage('Your password has been updated successfully!');
      
      // Clear the hash from URL for security
      window.history.replaceState(null, '', window.location.pathname);
      
      // Wait 3 seconds then redirect to sign in
      setTimeout(() => {
        navigate('/signin', { 
          state: { message: 'Password reset successful. Please sign in with your new password.' } 
        });
      }, 3000);
      
    } catch (error) {
      console.error('Error updating password:', error);
      setError(error.message || 'Failed to update password. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="max-w-md w-full p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <div className="flex justify-center mb-8">
          <div className="bg-primary/10 p-3 rounded-full">
            <FaLeaf className="text-4xl text-primary" />
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-2">
          {isSuccess ? 'Password Reset Successful' : 'Reset Your Password'}
        </h2>
        
        {isSuccess ? (
          <div className="text-center">
            <div className="flex justify-center my-8">
              <FaCheckCircle className="text-green-500 text-5xl" />
            </div>
            <p className="text-center text-gray-600 dark:text-gray-400 mb-6">
              {message}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Redirecting you to the login page...
            </p>
          </div>
        ) : (
          <>
            <p className="text-center text-gray-600 dark:text-gray-400 mb-6">
              {message || 'Enter your new password below'}
            </p>
            
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}
            
            {!error && !hash && (
              <div className="text-center mb-4">
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Missing or invalid reset token. Need a new reset link?
                </p>
                <Link 
                  to="/forgot-password" 
                  className="text-primary hover:underline"
                >
                  Request new password reset
                </Link>
              </div>
            )}
            
            {hash && (
              <form onSubmit={handleSubmit}>
                <div className="mb-6">
                  <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="password">
                    New Password
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                      <FaLock className="text-gray-400" />
                    </span>
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
                      placeholder="Enter your new password"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 flex items-center pr-3"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <FaEyeSlash className="text-gray-400" />
                      ) : (
                        <FaEye className="text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>
                
                <div className="mb-6">
                  <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="confirmPassword">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                      <FaLock className="text-gray-400" />
                    </span>
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
                      placeholder="Confirm your new password"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 flex items-center pr-3"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <FaEyeSlash className="text-gray-400" />
                      ) : (
                        <FaEye className="text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>
                
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors disabled:opacity-50"
                >
                  {loading ? 'Updating...' : 'Reset Password'}
                </button>
              </form>
            )}
            
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Remember your password?{' '}
                <Link to="/signin" className="text-primary hover:underline">
                  Sign in
                </Link>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ResetPassword; 