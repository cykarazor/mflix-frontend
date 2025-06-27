import React, { useContext } from 'react';
import {
  Container,
  Button,
  Stack,
  Typography,
  AppBar,
  Toolbar,
  Box,
} from '@mui/material';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
} from 'react-router-dom';

import MovieList from './MovieList';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import { UserContext } from './UserContext';

// ✅ New Landing Page Component
function LandingPage() {
  return (
    <Box textAlign="center" mt={10}>
      <Typography variant="h3" gutterBottom>
        🎬 Welcome to MFlix!
      </Typography>
      <Typography variant="h6" color="text.secondary" paragraph>
        Browse and manage your movie collection with ease.
      </Typography>
      <Stack direction="row" spacing={2} justifyContent="center" mt={4}>
        <Button variant="contained" component={Link} to="/login">
          Login
        </Button>
        <Button variant="outlined" component={Link} to="/register">
          Register
        </Button>
      </Stack>
    </Box>
  );
}

function App() {
  const { user, logout } = useContext(UserContext);

  // ✅ ProtectedRoute wrapper for private pages
  const ProtectedRoute = ({ children }) => {
    if (!user) return <Navigate to="/login" replace />;
    return children;
  };

  return (
    <Router>
      {/* ✅ AppBar added for a cleaner header */}
      <AppBar position="static">
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography variant="h6" component={Link} to="/" sx={{ textDecoration: 'none', color: 'inherit' }}>
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

      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Routes>
          {/* ✅ Landing page shows only if not logged in */}
          <Route path="/" element={!user ? <LandingPage /> : <Navigate to="/movies" />} />

          {/* ✅ MovieList moved to /movies and protected */}
          <Route
            path="/movies"
            element={
              <ProtectedRoute>
                <MovieList />
              </ProtectedRoute>
            }
          />

          <Route path="/login" element={user ? <Navigate to="/movies" replace /> : <LoginForm />} />
          <Route path="/register" element={user ? <Navigate to="/movies" replace /> : <RegisterForm />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;
// ✅ Added LandingPage component for a welcoming introduction