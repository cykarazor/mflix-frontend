// App.js
import React, { useContext } from 'react';
import {
  Container,
  Button,
  Stack,
  Typography,
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

function App() {
  const { user, logout } = useContext(UserContext);

  return (
    <Router>
      <Container maxWidth="md" sx={{ mt: 3 }}>
        <Stack direction="row" spacing={2} justifyContent="center" alignItems="center" sx={{ mb: 3 }}>
          <Button component={Link} to="/">Movies</Button>

          {!user ? (
            <>
              <Button component={Link} to="/login">Login</Button>
              <Button component={Link} to="/register">Register</Button>
            </>
          ) : (
            <>
              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                Welcome, {user.name}
              </Typography>
              <Button onClick={logout} color="error">
                Logout
              </Button>
            </>
          )}
        </Stack>

        <Routes>
          <Route path="/" element={<MovieList />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;
