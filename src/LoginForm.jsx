import React, { useState } from 'react';
import { TextField, Button, Stack, Typography } from '@mui/material';
import axios from 'axios';

const API = 'https://mflix-backend-ysnw.onrender.com/api/auth'; // update this

const LoginForm = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');

  const handleLogin = async () => {
    try {
      const res = await axios.post(`${API}/login`, { username, password });
      localStorage.setItem('token', res.data.token);
      setMsg('Login successful!');
      onLogin && onLogin(res.data.username);
    } catch (err) {
      setMsg(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <Stack spacing={2}>
      <Typography variant="h5">Login</Typography>
      <TextField label="Username" value={username} onChange={e => setUsername(e.target.value)} />
      <TextField label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
      <Button variant="contained" onClick={handleLogin}>Login</Button>
      {msg && <Typography color="primary">{msg}</Typography>}
    </Stack>
  );
};

export default LoginForm;
