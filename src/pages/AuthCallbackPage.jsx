import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AuthCallbackPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { setUser } = useAuth();

    useEffect(() => {
        const token = searchParams.get('token');
        const userParam = searchParams.get('user');

        if (token && userParam) {
            try {
                const userData = JSON.parse(decodeURIComponent(userParam));

                // Store token and user data
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(userData));

                // Update auth context
                setUser(userData);

                // Redirect to home page
                navigate('/');
            } catch (error) {
                console.error('OAuth callback error:', error);
                navigate('/login?error=oauth_failed');
            }
        } else {
            // No token received, redirect to login
            navigate('/login?error=oauth_failed');
        }
    }, [searchParams, navigate, setUser]);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
                    <h2 className="mt-4 text-lg font-medium text-gray-900">
                        Completing Google Sign In...
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Please wait while we finish setting up your account.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AuthCallbackPage;
