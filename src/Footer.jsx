// src/Footer.jsx
import React from 'react';
import { Box, Container, Typography, Link, Stack, IconButton } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import TwitterIcon from '@mui/icons-material/Twitter';
import FacebookIcon from '@mui/icons-material/Facebook';

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'primary.dark',
        color: 'white',
        py: 4,
        mt: 'auto', // push footer to bottom if using flex column layout
      }}
    >
      <Container maxWidth="md">
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="body2" component="p">
            &copy; {new Date().getFullYear()} MFlix. All rights reserved.
          </Typography>

          <Stack direction="row" spacing={1}>
            <Link href="https://github.com/yourusername" target="_blank" rel="noopener" color="inherit" underline="none" aria-label="GitHub">
              <IconButton color="inherit" size="small">
                <GitHubIcon />
              </IconButton>
            </Link>
            <Link href="https://twitter.com/yourusername" target="_blank" rel="noopener" color="inherit" underline="none" aria-label="Twitter">
              <IconButton color="inherit" size="small">
                <TwitterIcon />
              </IconButton>
            </Link>
            <Link href="https://facebook.com/yourusername" target="_blank" rel="noopener" color="inherit" underline="none" aria-label="Facebook">
              <IconButton color="inherit" size="small">
                <FacebookIcon />
              </IconButton>
            </Link>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
