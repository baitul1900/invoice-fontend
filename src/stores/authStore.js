import { create } from 'zustand';
import axios from 'axios';
import Cookies from 'js-cookie';

const baseURL = "http://localhost:5400/api/v1";

export const useAuthStore = create((set) => ({
  user: null,
  token: Cookies.get('token') || null,
  products: [],
  error: null,
  loading: false,

  // Auth Functions
  userRegistration: async (userData) => {
    set({ loading: true, error: null });

    try {
      const response = await axios.post(`${baseURL}/user-registration`, userData);
      set({ loading: false });

      if (response.data.status === 'success') {
        return response.data.message;
      } else {
        set({ error: response.data.message || 'Registration failed' });
        return response.data.message || 'Registration failed';
      }
    } catch (error) {
      set({ loading: false, error: error.response ? error.response.data.message : error.message });
      return error.response ? error.response.data.message : error.message;
    }
  },

  userLogin: async (userData) => {
    set({ loading: true, error: null });

    try {
      const result = await axios.post(`${baseURL}/login`, userData);
      const { token, user } = result.data;

      Cookies.set('token', token);
      set({ token, loading: false, user });

      return 'Login successful';
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

  // Product Functions
  fetchProducts: async () => {
    set({ loading: true, error: null });

    try {
      const response = await axios.get(`${baseURL}/products`);
      set({ loading: false, products: response.data.data });
      return response.data;
    } catch (error) {
      set({ loading: false, error: error.response ? error.response.data.message : error.message });
      return error.response ? error.response.data.message : error.message;
    }
  },

  addProductToInventory: async (productData) => {
    set({ loading: true, error: null });

    try {
      const token = Cookies.get('token');
      if (!token) {
        throw new Error('User is not authenticated');
      }

      const response = await axios.post(`${baseURL}/add-product`, productData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      
      set({ loading: false });
      return response.data;
    } catch (error) {
      set({ loading: false, error: error.response ? error.response.data.message : error.message });
      
      return error.response ? error.response.data.message : error.message;
    }
  },

  inventoryList : [],


  // fetch inventory lis here 
  fetchInventoryList: async (userId) => {
    set({ loading: true, error: null });

    try {
      const token = Cookies.get('token');
      if (!token) {
        throw new Error('User is not authenticated');
      }

      let response = await axios.get(`${baseURL}/inventory-list/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      set({ loading: false, inventoryList: response.data.data });
    }
    catch (error) {
      set({ loading: false, error: error.response ? error.response.data.message : error.message });
    }
  },

  // create invoice here
  createInvoice: async (userId, inventoryIds) => {
    set({ loading: true, error: null });
  
    try {
      const token = Cookies.get('token');
      if (!token) {
        throw new Error('User is not authenticated');
      }
  
      // Prepare the data payload
      const payload = {
        userId,
        inventoryIds,
      };
  
      const response = await axios.post(
        `${baseURL}/create-invoice`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      set({ loading: false });
      return response.data;  // Ensure to return the full response object for proper handling
    } catch (error) {
      set({ loading: false, error: error.response ? error.response.data.message : error.message });
      throw new Error(error.response ? error.response.data.message : error.message);  // Rethrow the error for handling in the component
    }
  },
  
}));
