import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Box, Typography, Button, Stack, TextField, Alert, Snackbar, Tooltip, Card, CardContent, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from "@mui/material";
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

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleDelete = () => {
    if (!selected) {
      setSnackbar({ open: true, message: "Please select a customer to delete", severity: "warning" });
      return;
    }
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    setDeleteDialogOpen(false);
    try {
      await deleteCustomer(selected.id);
      setSnackbar({ open: true, message: "Customer deleted successfully", severity: "success" });
      fetchCustomers();
      setSelected(null);
    } catch (error) {
      setSnackbar({ open: true, message: "Failed to delete customer", severity: "error" });
    }
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
    <Box sx={{ width: "90%", maxWidth: "1200px", margin: "40px auto" }}>
      <Card sx={{
        backdropFilter: "blur(10px)",
        backgroundColor: "rgba(255, 255, 255, 0.85)",
        borderRadius: 4,
        boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)"
      }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
            <Typography variant="h4" fontWeight="bold" sx={{
              background: "linear-gradient(45deg, #1e3c72 30%, #2a5298 90%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              textFillColor: "transparent"
            }}>
              Customer Management
            </Typography>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleLogout}
              sx={{
                background: "linear-gradient(45deg, #FF512F 30%, #DD2476 90%)",
                boxShadow: "0 3px 5px 2px rgba(255, 105, 135, .3)",
                color: "white",
                borderRadius: "20px",
                fontWeight: "bold",
                textTransform: "none",
                padding: "5px 20px",
                "&:hover": {
                  background: "linear-gradient(45deg, #E64A19 30%, #C2185B 90%)",
                }
              }}
            >
              Logout
            </Button>
          </Box>

          <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
            <Button
              variant="contained"
              onClick={handleAdd}
              sx={{
                background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
                boxShadow: "0 3px 5px 2px rgba(33, 203, 243, .3)",
                color: "white",
                fontWeight: "bold",
                borderRadius: "20px",
                padding: "0 30px",
                textTransform: "none",
                transition: "transform 0.2s",
                "&:hover": {
                  transform: "scale(1.05)",
                  background: "linear-gradient(45deg, #1976D2 30%, #00BCD4 90%)",
                }
              }}
            >
              Add Customer
            </Button>
            <Button
              variant="outlined"
              onClick={handleEdit}
              sx={{
                borderRadius: "20px",
                borderColor: "#2196F3",
                color: "#2196F3",
                fontWeight: "bold",
                textTransform: "none",
                padding: "0 25px",
                "&:hover": {
                  borderColor: "#1976D2",
                  backgroundColor: "rgba(33, 150, 243, 0.1)",
                }
              }}
            >
              Update Customer
            </Button>
            <Button
              variant="outlined"
              color="error"
              onClick={handleDelete}
              sx={{
                borderRadius: "20px",
                fontWeight: "bold",
                textTransform: "none",
                padding: "0 25px",
                borderWidth: "1.5px",
                "&:hover": {
                  borderWidth: "1.5px",
                  backgroundColor: "rgba(211, 47, 47, 0.1)",
                }
              }}
            >
              Delete Customer
            </Button>
            <TextField
              label="Search by Name, Email or Mobile No"
              variant="outlined"
              size="small"
              value={search}
              onChange={handleSearch}
              sx={{
                flex: 1,
                "& .MuiOutlinedInput-root": {
                  borderRadius: "20px",
                  backgroundColor: "rgba(255,255,255,0.5)",
                }
              }}
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

          <Dialog
            open={deleteDialogOpen}
            onClose={() => setDeleteDialogOpen(false)}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              {"Confirm Deletion"}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Are you sure you want to delete {selected?.name}? This action cannot be undone.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
                Cancel
              </Button>
              <Button onClick={confirmDelete} color="error" variant="contained" autoFocus>
                Delete
              </Button>
            </DialogActions>
          </Dialog>

        </CardContent>
      </Card>
    </Box >
  );
}
