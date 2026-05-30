import { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');

      if (token) {
        try {
          const res = await api.get('/user/me');
          setUser(res.data);
          localStorage.setItem('user', JSON.stringify(res.data));
        } catch (error) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }

      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    const response = await api.post('/auth/authenticate', {
      email,
      password,
    });

    const { token } = response.data;

    localStorage.setItem('token', token);

    const userRes = await api.get('/user/me');

    localStorage.setItem('user', JSON.stringify(userRes.data));
    setUser(userRes.data);
  };

  const register = async ({ fullName, email, password }) => {
    const response = await api.post('/auth/register', {
      fullName,
      email,
      password,
      monthlyBudget: 0,
    });

    const { token } = response.data;

    localStorage.setItem('token', token);

    const userRes = await api.get('/user/me');

    localStorage.setItem('user', JSON.stringify(userRes.data));
    setUser(userRes.data);
  };

  const resetPassword = async (email, otp, newPassword) => {
    await api.post('/auth/forgot-password/reset', {
      email,
      otp,
      newPassword,
    });
  };

  const updateUser = (updatedData) => {
    setUser(updatedData);
    localStorage.setItem('user', JSON.stringify(updatedData));
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        resetPassword,
        logout,
        loading,
        updateUser,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);