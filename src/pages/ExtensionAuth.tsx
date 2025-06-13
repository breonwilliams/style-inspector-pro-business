import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

export function ExtensionAuth() {
  const { user, session } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  const state = searchParams.get('state');
  const mode = searchParams.get('mode');
  const redirect = searchParams.get('redirect');

  useEffect(() => {
    const handleExtensionAuth = async () => {
      try {
        // Check if this is an extension authentication request
        if (mode !== 'extension') {
          setStatus('error');
          setMessage('Invalid authentication mode');
          return;
        }

        // If user is not authenticated, redirect to login
        if (!user || !session) {
          const loginUrl = `/auth?mode=extension&state=${state}&redirect=${encodeURIComponent(window.location.href)}`;
          navigate(loginUrl);
          return;
        }

        // User is authenticated, get the access token
        const accessToken = session.access_token;
        
        if (!accessToken) {
          setStatus('error');
          setMessage('No access token available');
          return;
        }

        // Success - prepare to send token back to extension
        setStatus('success');
        setMessage('Authentication successful! Redirecting back to extension...');

        // Send message to extension with the token
        setTimeout(() => {
          // Try to communicate with the extension
          try {
            // Method 1: Try postMessage to opener window (if opened in popup)
            if (window.opener) {
              window.opener.postMessage({
                type: 'EXTENSION_AUTH_SUCCESS',
                token: accessToken,
                user: {
                  id: user.id,
                  email: user.email,
                  name: user.email?.split('@')[0] || 'User'
                },
                state: state
              }, '*');
              window.close();
              return;
            }

            // Method 2: Try to redirect with token in URL (for same-tab flow)
            const extensionUrl = `chrome-extension://extension-id/sidepanel.html?token=${encodeURIComponent(accessToken)}&state=${state}`;
            window.location.href = extensionUrl;
            
          } catch (error) {
            console.error('Error communicating with extension:', error);
            
            // Fallback: Show token to user for manual entry
            setMessage(`Please copy this token and paste it in the extension: ${accessToken}`);
          }
        }, 2000);

      } catch (error) {
        console.error('Extension auth error:', error);
        setStatus('error');
        setMessage('Authentication failed. Please try again.');
      }
    };

    handleExtensionAuth();
  }, [user, session, mode, state, navigate]);

  const renderContent = () => {
    switch (status) {
      case 'loading':
        return (
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-indigo-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Connecting to Style Inspector Pro
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Please wait while we authenticate your extension...
            </p>
          </div>
        );

      case 'success':
        return (
          <div className="text-center">
            <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Authentication Successful!
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {message}
            </p>
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <p className="text-sm text-green-800 dark:text-green-200">
                Your Style Inspector Pro extension is now connected to your account.
                You can close this tab and return to the extension.
              </p>
            </div>
          </div>
        );

      case 'error':
        return (
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Authentication Failed
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {message}
            </p>
            <div className="space-y-3">
              <button
                onClick={() => window.location.reload()}
                className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Try Again
              </button>
              <button
                onClick={() => navigate('/auth')}
                className="w-full bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Go to Login
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-xl">SI</span>
            </div>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
              Style Inspector Pro
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Extension Authentication
            </p>
          </div>

          {renderContent()}
        </div>

        {/* Help Text */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Having trouble? Visit our{' '}
            <a 
              href="/support" 
              className="text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              support page
            </a>{' '}
            for help.
          </p>
        </div>
      </div>
    </div>
  );
}
