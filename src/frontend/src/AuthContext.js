import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true); // Add loading state
    const navigate = useNavigate();

    // Check authentication status on initial load
    useEffect(() => {
        const csrftoken = Cookies.get('csrftoken');
        console.log('Initial Auth Check - CSRF Token:', csrftoken);

        fetch('https://developpi.local:8000/songbook/auth-check', {
            credentials: 'include',
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
                    console.log('User is authenticated.');
                    setIsAuthenticated(true);
                } else {
                    console.warn('Auth check failed. User is not authenticated.');
                    setIsAuthenticated(false);
                }
            })
            .catch((error) => {
                console.error('Auth check error:', error);
                setIsAuthenticated(false);
            }).finally(() => setLoading(false));
    }, []);

    // Define login function
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
                console.log('Login successful.');
                setIsAuthenticated(true);
                navigate('/'); // Redirect to the homepage or another protected route
            } else {
                console.error('Login failed:', await response.json());
            }
        } catch (error) {
            console.error('Login error:', error);
        }
    };

    // Define logout function
    const logout = async () => {
        const csrftoken = Cookies.get('csrftoken');
        console.log('Logout attempt - CSRF Token:', csrftoken);

        try {
            const response = await fetch('https://developpi.local:8000/songbook/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrftoken,
                },
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

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
