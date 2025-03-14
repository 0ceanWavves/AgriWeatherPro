import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { FaLeaf, FaEnvelope } from 'react-icons/fa';

const SignUp = () => {
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');

  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    const formEmail = e.target.email.value;
    const formPassword = e.target.password.value;
    const formFullName = e.target.fullName.value;
    
    // Save email for success message
    setEmail(formEmail);
    
    // Validate inputs before attempting signup
    if (!formEmail || !formPassword || !formFullName) {
      setError('All fields are required');
      setLoading(false);
      return;
    }
    
    try {
      console.log('Starting signup process for:', formEmail);
      
      // Use the signUp function from AuthContext instead of direct Supabase call
      const { data, error } = await signUp(
        formEmail,
        formPassword,
        formFullName
      );

      if (error) {
        console.log('Signup error received:', error.message);
        throw error;
      }
      
      console.log('Signup successful, user created:', data?.user?.id);
      setSuccess(true);
      
      // Don't redirect automatically - show verification instructions instead
    } catch (error) {
      console.error('Signup submission error:', error);
      setError(error.message || 'An error occurred during signup');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-10 rounded-xl shadow-md">
        <div className="text-center">
          <FaLeaf className="mx-auto h-12 w-12 text-primary" />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Join AgriWeather Pro for personalized agricultural insights
          </p>
        </div>
        
        {success ? (
          <div className="text-center mt-8">
            <div className="mb-4 p-4 bg-green-100 dark:bg-green-900 rounded-lg">
              <h3 className="text-xl font-bold text-green-800 dark:text-green-200 mb-2">
                Account Created Successfully!
              </h3>
              <div className="flex justify-center mb-4">
                <FaEnvelope className="text-5xl text-green-600 dark:text-green-400" />
              </div>
              <p className="text-green-800 dark:text-green-200">
                We've sent a verification email to:
                <br />
                <strong>{email}</strong>
              </p>
            </div>
            
            <p className="mb-4 text-gray-600 dark:text-gray-400">
              Please check your email inbox and click on the verification link to complete your registration.
            </p>
            
            <p className="mb-4 text-gray-600 dark:text-gray-400">
              <strong>Important:</strong> The verification link will expire in 30 minutes. If you don't see the email, check your spam folder.
            </p>
            
            <div className="mt-6 flex flex-col space-y-3">
              <Link to="/signin" className="font-medium text-primary hover:text-primary/80">
                Return to Sign In
              </Link>
            </div>
          </div>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="rounded-md bg-red-50 dark:bg-red-900 p-4">
                <div className="text-sm text-red-700 dark:text-red-200">{error}</div>
              </div>
            )}
            
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="fullName" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  required
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:text-white dark:border-gray-600"
                  placeholder="Enter your full name"
                />
              </div>
              
              <div className="mt-4">
                <label htmlFor="email" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:text-white dark:border-gray-600"
                  placeholder="Enter your email"
                />
              </div>
              
              <div className="mt-4">
                <label htmlFor="password" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  required
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:text-white dark:border-gray-600"
                  placeholder="Create a password"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                {loading ? 'Creating account...' : 'Sign up'}
              </button>
            </div>
            
            <div className="text-sm text-center">
              <p className="text-gray-600 dark:text-gray-400">
                By signing up, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>
          </form>
        )}
        
        {!success && (
          <div className="text-sm text-center mt-4">
            <Link to="/signin" className="font-medium text-primary hover:text-primary/80">
              Already have an account? Sign in
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default SignUp;