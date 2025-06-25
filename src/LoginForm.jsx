import React, { useState, useContext } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
import axios from 'axios';
import { UserContext } from './UserContext';

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL ||
  'https://mflix-backend-ysnw.onrender.com';

export default function LoginForm() {
  const { login } = useContext(UserContext);
  const [email, setEmail]         = useState('');
  const [password, setPassword]   = useState('');
  const [msg, setMsg]             = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/auth/login`,
        { email, password }
      );
      login(res.data.user, res.data.token);
    } catch (err) {
      setMsg(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <Box maxWidth={400} mx="auto" mt={5}>
      <Typography variant="h5" align="center">
        Login
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{ mt: 2 }}
        >
          Login
        </Button>
      </form>
      {msg && (
        <Typography color="error" align="center" mt={2}>
          {msg}
        </Typography>
      )}
    </Box>
  );
}
