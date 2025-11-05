import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api/admin`;

// Get token from localStorage
const getToken = () => localStorage.getItem('admin_token');

// Set auth header
const getAuthHeader = () => ({
  headers: { Authorization: `Bearer ${getToken()}` }
});

// Auth
export const adminLogin = async (username, password) => {
  try {
    const response = await axios.post(`${API}/login`, { username, password });
    if (response.data.access_token) {
      localStorage.setItem('admin_token', response.data.access_token);
      localStorage.setItem('admin_user', JSON.stringify(response.data.user));
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const adminLogout = () => {
  localStorage.removeItem('admin_token');
  localStorage.removeItem('admin_user');
};

export const verifyToken = async () => {
  try {
    const response = await axios.get(`${API}/verify`, getAuthHeader());
    return response.data;
  } catch (error) {
    adminLogout();
    throw error;
  }
};

// Dashboard
export const getDashboardStats = async () => {
  const response = await axios.get(`${API}/dashboard/stats`, getAuthHeader());
  return response.data;
};

export const getRecentOrders = async () => {
  const response = await axios.get(`${API}/dashboard/recent-orders`, getAuthHeader());
  return response.data;
};

export const getRecentContacts = async () => {
  const response = await axios.get(`${API}/dashboard/recent-contacts`, getAuthHeader());
  return response.data;
};

// Products
export const getAdminProducts = async () => {
  const response = await axios.get(`${API}/products`, getAuthHeader());
  return response.data;
};

export const createProduct = async (productData) => {
  const response = await axios.post(`${API}/products`, productData, getAuthHeader());
  return response.data;
};

export const updateProduct = async (productId, productData) => {
  const response = await axios.put(`${API}/products/${productId}`, productData, getAuthHeader());
  return response.data;
};

export const deleteProduct = async (productId) => {
  const response = await axios.delete(`${API}/products/${productId}`, getAuthHeader());
  return response.data;
};

// Orders
export const getAdminOrders = async () => {
  const response = await axios.get(`${API}/orders`, getAuthHeader());
  return response.data;
};

export const getAdminOrder = async (orderId) => {
  const response = await axios.get(`${API}/orders/${orderId}`, getAuthHeader());
  return response.data;
};

export const updateOrderStatus = async (orderId, status) => {
  const response = await axios.put(`${API}/orders/${orderId}/status?status=${status}`, {}, getAuthHeader());
  return response.data;
};

// Contacts
export const getAdminContacts = async () => {
  const response = await axios.get(`${API}/contacts`, getAuthHeader());
  return response.data;
};

export const updateContactStatus = async (contactId, status) => {
  const response = await axios.put(`${API}/contacts/${contactId}/status?status=${status}`, {}, getAuthHeader());
  return response.data;
};

export const deleteContact = async (contactId) => {
  const response = await axios.delete(`${API}/contacts/${contactId}`, getAuthHeader());
  return response.data;
};
