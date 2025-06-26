import React, { useState, useEffect, useContext } from 'react';
import { TextField, Button, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from './UserContext';

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || 'https://mflix-backend-ysnw.onrender.com';

const RegisterForm = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');

  useEffect(() => {
    if (user) navigate('/');
  }, [user, navigate]);

  const handleRegister = async () => {
    setMsg('');
    try {
      await axios.post(`${API_BASE_URL}/api/auth/register`, {
        name,
        email,
        password,
      });
      setMsg('✅ Registration successful! Redirecting to login...');
      setName('');
      setEmail('');
      setPassword('');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setMsg(err.response?.data?.error || '❌ Registration failed.');
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
        required
      />
      <TextField
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        fullWidth
        required
      />
      <TextField
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        fullWidth
        required
      />
      <Button variant="contained" onClick={handleRegister} fullWidth>
        Register
      </Button>
      {msg && (
        <Typography color={msg.includes('success') ? 'primary' : 'error'} align="center">
          {msg}
        </Typography>
      )}
    </Stack>
  );
};

export default RegisterForm;
