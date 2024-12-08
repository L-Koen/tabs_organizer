import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

// Create the AuthContext

/**
 * AuthContext
 * 
 * This context provides authentication-related data and functions (e.g., login, logout)
 * to all components in the app. It allows React components to easily access and update
 * the authentication state.
 */
export const AuthContext = createContext();


// AuthProvider Component
/**
 * AuthProvider
 * 
 * This component wraps the app (or part of it) and provides authentication context
 * using React's Context API. It handles authentication state, login/logout functionality,
 * and checks the user's authentication status on initial load.
 * 
 * @param {ReactNode} children - The child components that will have access to the AuthContext
 */
export const AuthProvider = ({ children }) => {
    // State to track whether the user is authenticated
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    // State to track whether authentication checks are still loading
    const [loading, setLoading] = useState(true);
    // React Router's navigation function for redirection
    const navigate = useNavigate();

    // Effect to check the user's authentication status on initial load
    useEffect(() => {
        // Retrieve CSRF token from cookies
        const csrftoken = Cookies.get('csrftoken');

        // Send a GET request to check if the user is authenticated
        fetch('https://developpi.local:8000/songbook/auth-check', {
            credentials: 'include', //make sure to include any auth cookie
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken,
            },
        })
            .then((response) => {
                console.log('Auth check response status:', response.status);
                if (response.ok) {
                    // console.log('User is authenticated.');
                    setIsAuthenticated(true);
                } else {
                    // console.warn('Auth check failed. User is not authenticated.');
                    setIsAuthenticated(false);
                }
            })
            .catch((error) => {
                // console.error('Auth check error:', error);
                setIsAuthenticated(false);
            }).finally(() => setLoading(false));
    }, []);

    // Function to log in the user
    /**
     * login
     * 
     * Handles user login by sending a POST request to the server with the provided
     * username and password. If the login is successful, the user is authenticated.
     * 
     * @param {string} username - The username provided by the user
     * @param {string} password - The password provided by the user
     */
    const login = async (username, password) => {
        const csrftoken = Cookies.get('csrftoken');
        console.log('Login attempt - CSRF Token:', csrftoken);

        try {
            const response = await fetch('https://developpi.local:8000/songbook/auth', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrftoken,
                },
                credentials: 'include',
                body: JSON.stringify({ username, password }),
            });

            console.log('Login response status:', response.status);

            if (response.ok) {
                // console.log('Login successful.');
                setIsAuthenticated(true);
                navigate('/'); // Redirect to the homepage
            } else {
                console.error('Login failed:', await response.json());
            }
        } catch (error) {
            console.error('Login error:', error);
        }
    };

    // Function to log out the user
    /**
     * logout
     * 
     * Logs out the user by sending a POST request to the server. If successful,
     * the user's authentication state is cleared, and they are redirected to the login page.
     */
    const logout = async () => {
        const csrftoken = Cookies.get('csrftoken');
        console.log('Logout attempt - CSRF Token:', csrftoken);

        try {
            const response = await fetch('https://developpi.local:8000/songbook/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrftoken,
                },// Provide authentication-related data and functions to child components
                credentials: 'include',
            });

            console.log('Logout response status:', response.status);

            if (response.ok) {
                console.log('Logout successful.');
                setIsAuthenticated(false);
                navigate('/login'); // Redirect to login after logout
            } else {
                console.error('Logout failed:', await response.json());
            }
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    // Provide authentication-related data and functions to child components
    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
