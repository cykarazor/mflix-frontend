import React from 'react';
import {
  Container,
  Button,
  Stack,
} from '@mui/material';

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
} from 'react-router-dom';

import { UserProvider } from './UserContext';
import ProtectedRoute from './ProtectedRoute';

import MovieList from './MovieList';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

function App() {
  return (
    <UserProvider>
      <Router>
        <Container maxWidth="md" sx={{ mt: 3 }}>
          <Stack direction="row" spacing={2} justifyContent="center" sx={{ mb: 3 }}>
            <Button component={Link} to="/">Movies</Button>
            <Button component={Link} to="/login">Login</Button>
            <Button component={Link} to="/register">Register</Button>
          </Stack>

          <Routes>
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <MovieList />
                </ProtectedRoute>
              }
            />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegisterForm />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Container>
      </Router>
    </UserProvider>
  );
}

export default App;
