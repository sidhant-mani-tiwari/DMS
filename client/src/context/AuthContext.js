import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Load token from localStorage on mount
        const savedToken = localStorage.getItem('token');
        if (savedToken) {
            setToken(savedToken);
            fetchUser();
        }
        setLoading(false);
    }, []);

    // Update token in localStorage when it changes
    useEffect(() => {
        if (token) {
            localStorage.setItem('token', token);
        }
    }, [token]);

    const fetchUser = async () => {
        try {
            const response = await axios.get('/api/v1/auth/me', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setUser(response.data);
        } catch (err) {
            console.error('Error fetching user:', err);
            setUser(null);
            setToken(null);
            localStorage.removeItem('token');
        }
    };

    const login = async (credentials) => {
        try {
            const response = await axios.post(
                'http://localhost:5000/api/v1/auth/login',
                credentials,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            const { token, user } = response.data;
            setToken(token);
            setUser(user);
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            return true;
        } catch (err) {
            console.error('Login error:', err.response?.data?.error || err.message);
            return false;
        }
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
    };

    return (
        <AuthContext.Provider value={{
            token,
            user,
            loading,
            login,
            logout
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === null) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
