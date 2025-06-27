// src/LandingPage.jsx
import React from 'react';
import { Button, Container, Typography, Stack, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function LandingPage() {
  return (
    <Box
      sx={{
        position: 'relative',
        minHeight: '100vh',
        backgroundImage: `url('https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?auto=format&fit=crop&w=1950&q=80')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2,
        color: 'white',
        zIndex: 0,
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          zIndex: 1,
        },
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        style={{ position: 'relative', zIndex: 2, width: '100%' }}
      >
        <Container maxWidth="sm" sx={{ textAlign: 'center', p: 5 }}>
          <Typography
            variant="h2"
            fontWeight="bold"
            gutterBottom
            sx={{ textShadow: '0 2px 8px rgba(0,0,0,0.7)' }}
          >
            Welcome to Mflix 🎬
          </Typography>
          <Typography
            variant="h6"
            gutterBottom
            sx={{ textShadow: '0 1px 6px rgba(0,0,0,0.6)' }}
          >
            Discover and manage your favorite movies in one place.
          </Typography>

          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            justifyContent="center"
            mt={4}
          >
            <Button
              component={Link}
              to="/login"
              variant="contained"
              size="large"
              sx={{ fontWeight: 'bold', px: 5 }}
            >
              Login
            </Button>
            <Button
              component={Link}
              to="/register"
              variant="outlined"
              size="large"
              sx={{
                color: 'white',
                borderColor: 'white',
                fontWeight: 'bold',
                px: 5,
                '&:hover': {
                  borderColor: 'primary.main',
                  color: 'primary.main',
                  bgcolor: 'transparent',
                },
              }}
            >
              Register
            </Button>
          </Stack>
        </Container>
      </motion.div>
    </Box>
  );
}
