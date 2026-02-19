import api from './api';

export const analyzerService = {
  analyzeResume: async (formData) => {
    try {
      const response = await api.post('/api/analyze/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Analysis failed' };
    }
  },
};

export default analyzerService;
