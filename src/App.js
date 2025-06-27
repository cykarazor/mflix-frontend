// src/App.jsx
import React, { useContext } from 'react';
import {
  Container,
  Button,
  Stack,
  Typography,
  AppBar,
  Toolbar,
  Box, // ✅ Added Box for layout wrapper
} from '@mui/material';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
} from 'react-router-dom';

import LandingPage from './LandingPage'; // ✅ Import styled LandingPage with background image
import MovieList from './MovieList';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import Footer from './Footer'; // ✅ Import the new Footer component
import { UserContext } from './UserContext';

function App() {
  const { user, logout } = useContext(UserContext);

  // ProtectedRoute wrapper to guard private routes
  const ProtectedRoute = ({ children }) => {
    if (!user) return <Navigate to="/login" replace />;
    return children;
  };

  return (
    // ✅ Wrap whole app in a flex column to push footer to bottom
    <Router>
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        {/* AppBar with navigation links and user info */}
        <AppBar position="static">
          <Toolbar sx={{ justifyContent: 'space-between' }}>
            <Typography
              variant="h6"
              component={Link}
              to="/"
              sx={{ textDecoration: 'none', color: 'inherit' }}
            >
              MFlix
            </Typography>

            <Stack direction="row" spacing={2}>
              {user ? (
                <>
                  <Button color="inherit" component={Link} to="/movies">
                    Movies
                  </Button>
                  <Typography variant="body2" sx={{ alignSelf: 'center' }}>
                    Welcome, {user.name}
                  </Typography>
                  <Button color="inherit" onClick={logout}>
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button color="inherit" component={Link} to="/login">
                    Login
                  </Button>
                  <Button color="inherit" component={Link} to="/register">
                    Register
                  </Button>
                </>
              )}
            </Stack>
          </Toolbar>
        </AppBar>

        {/* Main content container */}
        {/* ✅ Added flexGrow: 1 to push footer down */}
        <Container maxWidth="md" sx={{ mt: 4, flexGrow: 1 }}>
          <Routes>
            {/* Use the imported LandingPage with background image if NOT logged in */}
            <Route path="/" element={!user ? <LandingPage /> : <Navigate to="/movies" />} />

            {/* Movies page protected behind login */}
            <Route
              path="/movies"
              element={
                <ProtectedRoute>
                  <MovieList />
                </ProtectedRoute>
              }
            />

            {/* Login and Register routes redirect if already logged in */}
            <Route path="/login" element={user ? <Navigate to="/movies" replace /> : <LoginForm />} />
            <Route path="/register" element={user ? <Navigate to="/movies" replace /> : <RegisterForm />} />

            {/* Redirect any unknown routes to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Container>

        {/* ✅ Added Footer component below main content */}
        <Footer />
      </Box>
    </Router>
  );
}

export default App;
