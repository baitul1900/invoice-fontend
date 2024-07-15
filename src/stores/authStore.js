import { create } from 'zustand';
import axios from 'axios';
import Cookies from 'js-cookie';

const baseURL = "http://localhost:5400/api/v1";


const useAuthStore = create((set) => ({
    user: null,
  token: Cookies.get('token') || null,
  error: null,
  loading: false,

  userRegistration: async (userData) => {
    set({ loading: true, error: null });

    try {
      const response = await axios.post(`${baseURL}/user-registration`, userData);
      set({ loading: false });

      if (response && response.data && response.data.status === 'success') {
        return response.data.message;  // Or handle the success response as needed
      } else {
        set({ error: response.data ? response.data.message : 'Registration failed' });
        return response.data ? response.data.message : 'Registration failed';
      }
    } catch (error) {
      set({ loading: false, error: error.response ? error.response.data.message : error.message });
      return error.response ? error.response.data.message : error.message;
    }
  },
  userLogin: async (userData) => {
    set({ loading: true, error: null });

    try {
      let result = await axios.post(`${baseURL}/login`, userData);
      const { token, user } = result.data;

      Cookies.set('token', token);
      set({ token, loading: false, user });

      return 'Login successful';  // Return a success message
    } catch (error) {
      set({ loading: false, error: error.response ? error.response.data.message : error.message });
      return error.response ? error.response.data.message : error.message;
    }
  },

}));


export default useAuthStore;