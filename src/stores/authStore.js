import { create } from 'zustand';
import axios from 'axios';
import Cookies from 'js-cookie';

const baseURL = "http://localhost:5400/api/v1";


export const useAuthStore = create((set) => ({
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

  fetchUserProfile: async () => {
    set({ loading: true, error: null });
    try {
      const token = Cookies.get('token');
      const response = await axios.get(`${baseURL}/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      set({ user: response.data.data, loading: false });
      return response.data;
    } catch (error) {
      set({ error: 'Failed to fetch user profile', loading: false });
      throw new Error('Failed to fetch user profile');
    }
  },

  checkAuth: () => {
    const token = Cookies.get('token');
    if (token) {
      set({ token });
    }
  },
  logout: () => {
    Cookies.remove('token');
    set({ user: null, token: null });
  },

}));




// product store 

export const useProductStore = create((set) => ({
  products: [],
  error: null,
  loading: false,

  fetchProducts: async () => {
    set({ loading: true, error: null });

    try {
      let response = await axios.get(`${baseURL}/products`);
      set({ loading: false, products: response.data.data });
      return response.data;
    }
    catch (e) {
      set({ loading: false, error: e.response.data.message });
      return e.response.data.message;
    }
  },



}));