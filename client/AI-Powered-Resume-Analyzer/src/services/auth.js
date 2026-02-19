import api from './api';

export const authService = {
  register: async (username, email, password) => {
    try {
      const response = await api.post('/auth/register/', { username, email, password });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Registration failed' };
    }
  },

  signIn: async (username, password) => {
    try {
      const response = await api.post('/auth/signin/', { username, password });
      if (response.data.token) {
          localStorage.setItem('token', response.data.token);
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Sign in failed' };
    }
  },

  signOut: async () => {
    try {
      const response = await api.post('/auth/signout/');
      localStorage.removeItem('token'); // Clear token
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Sign out failed' };
    }
  },

  resetPassword: async (username, newPassword) => {
    try {
      const response = await api.post('/auth/reset-password/', { username, new_password: newPassword });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Password reset failed' };
    }
  },

  getHistory: async () => {
    try {
        const response = await api.get('/auth/history/');
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to fetch history' };
    }
  }
};

export default authService;
