import React, { useState } from "react";
import {
  Box, Card, CardContent, Typography, TextField, Button, Tabs, Tab,
  InputAdornment, IconButton, Snackbar, Alert, Dialog, DialogTitle,
  DialogContent, DialogActions
} from "@mui/material";
import { Login as LoginIcon, PersonAdd, Email, Lock, Person, Visibility, VisibilityOff } from "@mui/icons-material";
import { loginUser, registerUser, forgotPassword } from "../api";
import { useNavigate } from "react-router-dom";

export default function Login({ setIsLoggedIn }) {
  const [tab, setTab] = useState(0); // 0: Login, 1: Register
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ username: "", password: "", email: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ open: false, text: "", severity: "info" });

  // Forgot Password Dialog
  const [forgotOpen, setForgotOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");

  const navigate = useNavigate();

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
    setFormData({ username: "", password: "", email: "" });
    setMessage({ ...message, open: false });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCloseMessage = () => setMessage({ ...message, open: false });

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await loginUser({ username: formData.username, password: formData.password });
      setIsLoggedIn(true);
      navigate("/");
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Login failed";
      setMessage({ open: true, text: errorMsg, severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await registerUser(formData);
      setMessage({ open: true, text: "Registration successful! Please login.", severity: "success" });
      setTab(0); // Switch to login
      setFormData({ username: "", password: "", email: "" });
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Registration failed";
      setMessage({ open: true, text: errorMsg, severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    try {
      const res = await forgotPassword(forgotEmail);
      setMessage({ open: true, text: res.data.message, severity: "success" });
      setForgotOpen(false);
    } catch (error) {
      setMessage({ open: true, text: "Failed to process request", severity: "error" });
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        // Background removed to inherit from global index.css
      }}
    >
      <Card sx={{ maxWidth: 450, width: "100%", borderRadius: 4, boxShadow: 10, backdropFilter: "blur(10px)", backgroundColor: "rgba(255, 255, 255, 0.9)" }}>
        <Tabs value={tab} onChange={handleTabChange} variant="fullWidth" indicatorColor="primary" textColor="primary">
          <Tab icon={<LoginIcon />} label="Sign In" />
          <Tab icon={<PersonAdd />} label="Sign Up" />
        </Tabs>

        <CardContent sx={{ p: 4 }}>
          <Typography variant="h4" align="center" gutterBottom fontWeight="bold" color="primary">
            {tab === 0 ? "Welcome Back" : "Create Account"}
          </Typography>
          <Typography variant="body2" align="center" color="textSecondary" mb={3}>
            {tab === 0 ? "Enter your credentials to access your account" : "Fill in the details to get started"}
          </Typography>

          <form onSubmit={tab === 0 ? handleLogin : handleRegister}>
            <TextField
              fullWidth
              label="Username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              margin="normal"
              required
              InputProps={{
                startAdornment: <InputAdornment position="start"><Person color="action" /></InputAdornment>,
              }}
            />

            {tab === 1 && (
              <TextField
                fullWidth
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                margin="normal"
                required
                InputProps={{
                  startAdornment: <InputAdornment position="start"><Email color="action" /></InputAdornment>,
                }}
              />
            )}

            <TextField
              fullWidth
              label="Password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              margin="normal"
              required
              InputProps={{
                startAdornment: <InputAdornment position="start"><Lock color="action" /></InputAdornment>,
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              sx={{ mt: 3, mb: 2, borderRadius: 2, height: 50, fontWeight: "bold", fontSize: "1rem" }}
              disabled={loading}
            >
              {loading ? "Please wait..." : (tab === 0 ? "Login" : "Register")}
            </Button>

            {tab === 0 && (
              <Box textAlign="center">
                <Button color="primary" onClick={() => setForgotOpen(true)} sx={{ textTransform: "none" }}>
                  Forgot Password?
                </Button>
              </Box>
            )}
          </form>
        </CardContent>
      </Card>

      {/* Forgot Password Dialog */}
      <Dialog open={forgotOpen} onClose={() => setForgotOpen(false)}>
        <DialogTitle>Reset Password</DialogTitle>
        <DialogContent>
          <Typography variant="body2" gutterBottom>
            Enter your email address and we'll send you a link to reset your password.
          </Typography>
          <TextField
            autoFocus
            margin="dense"
            label="Email Address"
            type="email"
            fullWidth
            variant="outlined"
            value={forgotEmail}
            onChange={(e) => setForgotEmail(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setForgotOpen(false)}>Cancel</Button>
          <Button onClick={handleForgotPassword} variant="contained">Send Link</Button>
        </DialogActions>
      </Dialog>

      {/* Notifications */}
      <Snackbar open={message.open} autoHideDuration={6000} onClose={handleCloseMessage} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={handleCloseMessage} severity={message.severity} sx={{ width: '100%' }} variant="filled">
          {message.text}
        </Alert>
      </Snackbar>
    </Box>
  );
}