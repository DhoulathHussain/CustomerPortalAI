import React, { useEffect, useState } from "react";
import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import ImageUploadPreview from "../components/ImageUploadPreview";
import MapPicker from "../components/MapPicker";
import { useNavigate, useLocation } from "react-router-dom";
import { addCustomer, updateCustomer } from "../api";
import axios from "axios";

export default function CustomerForm() {
  const navigate = useNavigate();
  const location = useLocation();

  // The parent (Customers.jsx) will send props via location.state
  const { mode, customer } = location.state || {};

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobileno: "",
    address_text: "",
    latitude: "",
    longitude: "",
    image: null,
  });

  
  useEffect(() => {
    if (mode === "edit" && customer) {
      setFormData(customer.address ? {
          name: customer.name || "",
          email: customer.email || "",
          mobileno: customer.mobileno || "",
          image: customer.image_data
            ? `data:image/jpeg;base64,${customer.image_data}`
            : null,
          address_text: customer.address.address_text || "",
          latitude: customer.address.latitude || "",
          longitude: customer.address.longitude || "",
        } : {  name: customer.name || "",
          email: customer.email || "",
          mobileno: customer.mobileno || "",
          image: customer.image_data
            ? `data:image/jpeg;base64,${customer.image_data}`
            : null,
          address_text: "",
          latitude: "",
          longitude: "",
          });    
    }
  }, [mode, customer]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLocationSelect = async (lat, lon) => {
    setFormData((prev) => ({ ...prev, latitude: lat, longitude: lon }));
   
  }; 

  const handleAddressKeyDown = async (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const addr = formData.address_text.trim();
      if (!addr) return;
      try {
        const res = await axios.get(
          `http://localhost:5000/customers/geocode-address?address=${encodeURIComponent(addr)}`
        );
        if (res.data && res.data.lat && res.data.lon) {
          setFormData((prev) => ({
            ...prev,
            latitude: res.data.lat,
            longitude: res.data.lon,
          }));
        }
      } catch (err) {
        console.error("Geocoding failed:", err);
      }
    }
  };

  const handleGetAddress = async () => {
    if (!formData.latitude || !formData.longitude) return;
    try {
      const res = await axios.get(
        `http://localhost:5000/customers/reverse-geocode?lat=${formData.latitude}&lon=${formData.longitude}`
      );
      if (res.data && res.data.address_text) {
        setFormData((prev) => ({ ...prev, address_text: res.data.address_text }));
      }
    } catch (err) {
      console.error("Reverse geocode failed:", err);
    }
  };

  const handleImageChange = (file) => {
    setFormData((prev) => ({ ...prev, image: file }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (mode === "edit") {
        await updateCustomer(customer.id, formData);
        navigate("/", {
          replace: true,
          state: { message: "Customer updated successfully!", severity: "info" },
        });
      } else {
        await addCustomer(formData);
        navigate("/", {
          replace: true,
          state: { message: "Customer added successfully!", severity: "success" },
        });
      }
    } catch (err) {
      console.error("Save failed:", err);
      navigate("/", {
        replace: true,
        state: { message: "Failed to save customer!", severity: "error" },
      });
    }
  };

  const locateAddress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      setFormData((prev) => ({ ...prev, address_text: prev.data.address_text, latitude: prev.latitude, longitude: prev.longitude }));
    }
  };

  return (
    
    <form onSubmit={handleSubmit}>
      <Box sx={{ width: "80%", margin: "40px auto" }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          {mode === "edit" ? "Edit Customer" : "Add New Customer"}
        </Typography>

        <Stack spacing={2}>
          <ImageUploadPreview value={formData.image} onChange={handleImageChange} />
          <TextField label="Name" name="name" fullWidth value={formData.name} onChange={handleChange} />
          <TextField label="Email" name="email" fullWidth value={formData.email} onChange={handleChange} />
          <TextField label="Mobile No" name="mobileno" fullWidth value={formData.mobileno} onChange={handleChange} />
          <TextField label="Address" name="address_text" fullWidth value={formData.address_text} onChange={handleChange} onKeyDown={handleAddressKeyDown} />          
          <Stack direction="row" spacing={2} >
          <TextField label="Latitude" name="latitude" fullWidth value={formData.latitude} onChange={handleChange} />
          <TextField label="Longitude" name="longitude" fullWidth value={formData.longitude} onChange={handleChange} />
          <Button variant="outlined" onClick={handleGetAddress}>
              Get Address
          </Button>
          </Stack>
          <Box sx={{ width: "100%", height: 300 }}>
          <MapPicker lat={formData.latitude} lon={formData.longitude} onLocationSelect={handleLocationSelect} />          
          </Box>
        </Stack>
        <Stack direction="row" spacing={2}>
            <Button variant="contained" onClick={handleSubmit}>
              Save
            </Button>
            <Button variant="outlined" onClick={() => navigate(-1)}>
              Cancel
            </Button>
          </Stack>
      </Box>      
    </form>
  );
}
