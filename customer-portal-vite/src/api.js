import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000", // your Python service URL
});

// Login
export const loginUser = (credentials) =>
  API.post("/login", credentials);

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

