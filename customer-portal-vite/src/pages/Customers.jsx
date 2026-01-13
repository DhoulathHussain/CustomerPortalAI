import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Box, Typography, Button, Stack, TextField, Alert, Snackbar, Tooltip } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { getCustomers, deleteCustomer, searchCustomers } from "../api";

export default function Customers({ setIsLoggedIn }) {  // <-- receive from App
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const fetchCustomers = async () => {
    const res = await getCustomers();
    setCustomers(res.data);
  };

  useEffect(() => {
    fetchCustomers();

    if (location.state?.message) {
      setSnackbar({
        open: true,
        message: location.state.message,
        severity: location.state.severity || "success",
      });
      navigate(location.pathname, { replace: true });
    }
  }, [location]);

  const handleSearch = async (e) => {
    const value = e.target.value;
    setSearch(value);

    if (value.trim() === "") {
      fetchCustomers();
      return;
    }

    const res = await searchCustomers(value);
    setCustomers(res.data);
  };

  const handleAdd = () => {
    navigate("/customer-form", { state: { mode: "add" } });
 };

  const handleEdit = () => {
    if (!selected) {
      alert("Please select a customer to edit");
      return;
    }
    navigate("/customer-form", { state: { mode: "edit", customer: selected } });
 };

  const handleDelete = async () => {
    if (!selected) {
      alert("Please select a customer to delete");
      return;
    }
    await deleteCustomer(selected.id);
    alert("Customer deleted successfully");
    fetchCustomers();
  };

  const handleLogout = () => {                 // <-- NEW
    setIsLoggedIn(false);
    navigate("/login", { replace: true });
  };

  const safe = (fn, fallback = "") => {
    try { return fn() ?? fallback; } catch { return fallback; }
  };

  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "name", headerName: "Name", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "mobileno", headerName: "Mobile No", flex: 1 },
    {
      field: "image_data",
      headerName: "Photo",
      renderCell: (params) =>
        params.value ? (
          <img
            src={`data:image/jpeg;base64,${params.value}`}
            alt="Customer"
            style={{ width: 50, height: 50, borderRadius: "50%" }}
          />
        ) : "—",
    },
    {
      field: "location",
      headerName: "📍 Location",
      flex: 1.5,
      renderCell: (params) => {
        // tolerate either nested address object OR flat fields
        const address_text =
          safe(() => params.row.address.address_text) || params.row.address_text;
        const latitude =
          safe(() => params.row.address.latitude) || params.row.latitude;
        const longitude =
          safe(() => params.row.address.longitude) || params.row.longitude;

        if (!address_text && !latitude && !longitude) return "—";

        const mapUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
        const tip = [address_text, latitude, longitude].filter(Boolean).join(", ");

        return (
          <Tooltip title={tip} arrow>
            <a
              href={mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#1976d2", textDecoration: "none" }}
            >
              {address_text
                ? `${address_text} (${latitude}, ${longitude})`
                : `(${latitude}, ${longitude})`}
            </a>
          </Tooltip>
        );
      },
    },
  ];

  return (
    <Box sx={{ width: "80%", margin: "40px auto" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="h5">Customer Management</Typography>
        <Button variant="outlined" color="secondary" onClick={handleLogout}>
          Logout
        </Button>
      </Box>

      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
        <Button variant="contained" onClick={handleAdd}>Add Customer</Button>
        <Button variant="outlined" onClick={handleEdit}>Update Customer</Button>
        <Button variant="outlined" color="error" onClick={handleDelete}>Delete Customer</Button>
        <TextField
          label="Search by Name, Email or Mobile No"
          variant="outlined"
          size="small"
          value={search}
          onChange={handleSearch}
          sx={{ flex: 1 }}
        />
      </Stack>

      <DataGrid
        rows={customers}                    // <-- use server results directly
        columns={columns}
        pageSizeOptions={[5, 10, 15, 20, 25]}
        onRowClick={(params) => setSelected(params.row)}
        getRowId={(row) => row.id}
        initialState={{ pagination: { paginationModel: { pageSize: 5 } } }}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
