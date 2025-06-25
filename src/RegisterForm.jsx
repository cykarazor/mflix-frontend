import React, { useState } from 'react';
import { TextField, Button, Stack, Typography } from '@mui/material';
import axios from 'axios';

// Use your environment variable or fallback URL
const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL ||
  'https://mflix-backend-ysnw.onrender.com';

const RegisterForm = () => {
  const [name, setName]       = useState('');
  const [email, setEmail]     = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg]         = useState('');

  const handleRegister = async () => {
    try {
      await axios.post(
        `${API_BASE_URL}/api/auth/register`,
        { name, email, password }
      );
      setMsg('Registration successful! You can now log in.');
    } catch (err) {
      setMsg(err.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <Stack spacing={2} maxWidth={400} mx="auto" mt={5}>
      <Typography variant="h5" align="center">
        Register
      </Typography>
      <TextField
        label="Full Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        fullWidth
      />
      <TextField
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        fullWidth
      />
      <TextField
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        fullWidth
      />
      <Button variant="contained" onClick={handleRegister} fullWidth>
        Register
      </Button>
      {msg && (
        <Typography color="primary" align="center">
          {msg}
        </Typography>
      )}
    </Stack>
  );
};

export default RegisterForm;
