// src/LandingPage.jsx
import React from 'react';
import { Button, Container, Typography, Stack, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function LandingPage() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundImage: 'url(https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?auto=format&fit=crop&w=1950&q=80)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2,
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <Container maxWidth="md" sx={{ textAlign: 'center', backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: 4, p: 5 }}>
          <Typography variant="h2" fontWeight="bold" color="white" gutterBottom>
            Welcome to Mflix 🎬
          </Typography>
          <Typography variant="h6" color="white" gutterBottom>
            Discover and manage your favorite movies in one place.
          </Typography>

          <Stack direction="row" spacing={2} justifyContent="center" mt={4}>
            <Button
              component={Link}
              to="/login"
              variant="contained"
              size="large"
              sx={{ fontWeight: 'bold' }}
            >
              Login
            </Button>
            <Button
              component={Link}
              to="/register"
              variant="outlined"
              size="large"
              sx={{ color: 'white', borderColor: 'white', fontWeight: 'bold' }}
            >
              Register
            </Button>
          </Stack>
        </Container>
      </motion.div>
    </Box>
  );
}
