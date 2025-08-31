import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [status, setStatus] = useState<'processing' | 'redirecting' | 'error'>('processing');

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        setStatus('processing');
        
        // Wait a moment for auth state to settle
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setStatus('redirecting');
        
        // Redirect to momentum portfolio or home
        const redirectTo = user ? '/momentum' : '/';
        navigate(redirectTo, { replace: true });
        
      } catch (error) {
        console.error('Error handling auth callback:', error);
        setStatus('error');
        
        // Fallback redirect after error
        setTimeout(() => {
          navigate('/', { replace: true });
        }, 3000);
      }
    };

    handleAuthCallback();
  }, [navigate, user]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        {status === 'processing' && (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Completing sign in...</p>
          </>
        )}
        
        {status === 'redirecting' && (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Redirecting...</p>
          </>
        )}
        
        {status === 'error' && (
          <>
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-red-600 text-xl">!</span>
            </div>
            <p className="text-red-600 mb-2">Authentication Error</p>
            <p className="text-xs text-gray-500 mt-2">Redirecting to home page...</p>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthCallback;