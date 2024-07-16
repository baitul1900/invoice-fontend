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
  


  // get invoice list 
  invoiceList: [],

  fetchInvoice : async (userId) => {
    set({ loading: true, error: null });

    try {
      const token = Cookies.get('token');
      if (!token) {
        throw new Error('User is not authenticated');
      }

      let response = await axios.get(`${baseURL}/invoice-list/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      set({ loading: false, invoiceList: response.data.data });

    }
    catch (error) {
      set({ loading: false, error: error.response ? error.response.data.message : error.message }); 
    }
  },

  // view invoice 
  viewInvoice: async (invoiceId) => {
    set({ loading: true, error: null });
  
    try {
      const token = Cookies.get('token');
      if (!token) {
        throw new Error('User is not authenticated');
      }
  
      const response = await axios.get(`${baseURL}/view-invoice/${invoiceId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      console.log('Invoice data:', response.data); // Log the response data
      set({ loading: false, viewInvoiceData: response.data });
    } catch (error) {
      set({ loading: false, error: error.response ? error.response.data.message : error.message });
    }
  },  

  printInvoice: async (invoiceId) => {
    set({ loading: true, error: null });
  
    try {
      const token = Cookies.get('token');
      if (!token) {
        throw new Error('User is not authenticated');
      }
  
      const response = await axios.get(`${baseURL}/print-invoice/${invoiceId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: 'blob', // Ensure that response type is 'blob'
      });
  
      // Create a URL for the blob object
      const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
      const pdfUrl = URL.createObjectURL(pdfBlob);
  
      // Create a temporary anchor element to trigger the download
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = `invoice_${invoiceId}.pdf`;
      document.body.appendChild(link); // Append the link to the body
      link.click(); // Trigger the download
      document.body.removeChild(link); // Remove the link from the body
      URL.revokeObjectURL(pdfUrl); // Clean up the URL object
  
      set({ loading: false });
    } catch (error) {
      set({ loading: false, error: error.response ? error.response.data.error : error.message });
      throw new Error(error.response ? error.response.data.error : error.message);
    }
  },
  
  
  

  
}));  
