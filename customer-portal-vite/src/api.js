import axios from "axios";

// Centralise API base URL so it can be configured per environment.
// In Vite, environment variables must start with VITE_.
export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

const API = axios.create({
  baseURL: API_BASE_URL,
});

// Login
export const loginUser = (credentials) =>
  API.post("/login", credentials);

// Register
export const registerUser = (data) =>
  API.post("/register", data);

// Forgot Password
export const forgotPassword = (email) =>
  API.post("/forgot-password", { email });

// Get Customers
export const getCustomers = () =>
  API.get("/customers/");

export const addCustomer = async (data) => {
  const formData = new FormData();
  formData.append("name", data.name);
  formData.append("email", data.email);
  formData.append("mobileno", data.mobileno);
  formData.append("address_text", data.address_text);

  if (data.image) {
    formData.append("image", data.image);
  }
  console.log(formData);
  return API.post("/customers/", formData);
};

export const updateCustomer = (id, data) =>  {
  const formData = new FormData();
  formData.append("name", data.name);
  formData.append("email", data.email);
  formData.append("mobileno", data.mobileno);
  formData.append("address_text", data.address_text);

  if (data.image) {
    formData.append("image", data.image);
  }
  return API.put(`/customers/${id}`, formData);
};
// Delete Customer
export const deleteCustomer = (id) =>
  API.delete(`/customers/${id}`);

export const searchCustomers = (query) =>
  API.get(`/customers/search?value=${encodeURIComponent(query)}`);

