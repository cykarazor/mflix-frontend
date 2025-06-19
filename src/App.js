import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  Button,
  Stack,
  CircularProgress,
  TextField,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Box,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import ClearIcon from '@mui/icons-material/Clear';  // <-- import this at the top

// Pagination icons
import FirstPageIcon from '@mui/icons-material/FirstPage';
import LastPageIcon from '@mui/icons-material/LastPage';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

import EditMovieForm from './EditMovieForm'; // Your form component

const PAGE_SIZE = 10;
const sortOptions = [
  { label: 'Title', value: 'title' },
  { label: 'Year', value: 'year' },
];

function App() {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('title');

  const [editMovieId, setEditMovieId] = useState(null);

  // For movie details modal
  const [detailsMovie, setDetailsMovie] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    const params = new URLSearchParams({
      page,
      limit: PAGE_SIZE,
      sortBy: sort,
      search,
    });

    fetch(`https://mflix-backend-ysnw.onrender.com/api/movies?${params.toString()}`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setMovies(data.movies || []);
        setTotalPages(data.totalPages || 1);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load movies');
        setLoading(false);
      });
  }, [page, sort, search]);

  const handleCloseEditModal = () => setEditMovieId(null);
  const handleMovieUpdated = () => setPage(1);

  // Open movie details modal by setting the full movie object
  const openDetailsModal = (movie) => setDetailsMovie(movie);
  const closeDetailsModal = () => setDetailsMovie(null);

  // Helper to format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const d = new Date(dateString);
    return d.toLocaleDateString();
  };

  return (
    <Container maxWidth="md" sx={{ mt: 5, mb: 6 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'center' }}>
        Mflix Movies
      </Typography>

      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        sx={{ mb: 4, justifyContent: 'space-between' }}
      >
       <TextField
  label="Search"
  variant="outlined"
  value={search}
  onChange={(e) => {
    setSearch(e.target.value);
    setPage(1);
  }}
  fullWidth
  sx={{ maxWidth: 400 }}
  InputProps={{
    endAdornment: search ? (
      <IconButton
        aria-label="clear search"
        onClick={() => {
          setSearch('');
          setPage(1);
        }}
        edge="end"
        size="small"
      >
        <ClearIcon />
      </IconButton>
    ) : null,
  }}
/> 

        <TextField
          select
          label="Sort By"
          value={sort}
          onChange={(e) => {
            setSort(e.target.value);
            setPage(1);
          }}
          sx={{ width: 140 }}
        >
          {sortOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      </Stack>

      {loading && (
        <Stack alignItems="center" sx={{ my: 4 }}>
          <CircularProgress />
        </Stack>
      )}

      {error && (
        <Typography color="error" sx={{ mb: 2, textAlign: 'center' }}>
          {error}
        </Typography>
      )}

      {!loading && !error && movies.length === 0 && (
        <Typography sx={{ textAlign: 'center' }}>No movies found.</Typography>
      )}

      {!loading && !error && movies.length > 0 && (
        <List sx={{ bgcolor: 'background.paper', borderRadius: 2, boxShadow: 3 }}>
          {movies.map((movie, index) => (
            <ListItem
              key={movie._id}
              divider
              // Add striped background for even rows
              sx={{ 
                px: 3, 
                bgcolor: index % 2 === 0 ? 'grey.100' : 'background.paper', 
                cursor: 'pointer' 
              }}
              // Open details modal when clicking anywhere on the list item except the Edit button
              onClick={(e) => {
                // Prevent opening modal when clicking edit button
                if (e.target.closest('button')) return;
                openDetailsModal(movie);
              }}
              secondaryAction={
                <Button
                  variant="outlined"
                  startIcon={<EditIcon />}
                  onClick={() => setEditMovieId(movie._id)}
                  sx={{ textTransform: 'none' }}
                >
                  Edit
                </Button>
              }
            >
              <ListItemText
                primary={<Typography sx={{ fontWeight: 'medium' }}>{movie.title}</Typography>}
                secondary={movie.year ? `Year: ${movie.year}` : null}
              />
            </ListItem>
          ))}
        </List>
      )}

      {totalPages > 1 && (
        <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 4 }}>
          <Button
            variant="outlined"
            onClick={() => setPage(1)}
            disabled={page === 1}
            sx={{ minWidth: 80 }}
            startIcon={<FirstPageIcon />}
          >
            First
          </Button>
          <Button
            variant="outlined"
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
            sx={{ minWidth: 80 }}
            startIcon={<NavigateBeforeIcon />}
          >
            Prev
          </Button>
          <Typography variant="body1" sx={{ alignSelf: 'center' }}>
            Page {page} of {totalPages}
          </Typography>
          <Button
            variant="outlined"
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={page === totalPages}
            sx={{ minWidth: 80 }}
            endIcon={<NavigateNextIcon />}
          >
            Next
          </Button>
          <Button
            variant="outlined"
            onClick={() => setPage(totalPages)}
            disabled={page === totalPages}
            sx={{ minWidth: 80 }}
            endIcon={<LastPageIcon />}
          >
            Last
          </Button>
        </Stack>
      )}

      {/* Edit Movie Modal */}
      <Dialog open={!!editMovieId} onClose={handleCloseEditModal} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Movie Details</DialogTitle>
        <DialogContent dividers>
          {editMovieId && (
            <EditMovieForm
              movieId={editMovieId}
              onClose={handleCloseEditModal}
              onUpdated={() => {
                handleMovieUpdated();
                handleCloseEditModal();
              }}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditModal}>Cancel</Button>
        </DialogActions>
      </Dialog>

      {/* Movie Details Modal */}
      <Dialog open={!!detailsMovie} onClose={closeDetailsModal} maxWidth="sm" fullWidth>
        <DialogTitle>
          {detailsMovie?.title}
          <IconButton
            aria-label="close"
            onClick={closeDetailsModal}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {detailsMovie && (
            <Box>
              {detailsMovie.poster && (
                <Box
                  component="img"
                  src={detailsMovie.poster}
                  alt={detailsMovie.title}
                  sx={{ width: '100%', borderRadius: 1, mb: 2 }}
                />
              )}
              <Typography variant="body1" gutterBottom><strong>Year:</strong> {detailsMovie.year || 'N/A'}</Typography>
              <Typography variant="body1" gutterBottom><strong>Rated:</strong> {detailsMovie.rated || 'N/A'}</Typography>
              <Typography variant="body1" gutterBottom><strong>Runtime:</strong> {detailsMovie.runtime ? `${detailsMovie.runtime} minutes` : 'N/A'}</Typography>
              <Typography variant="body1" gutterBottom><strong>Genres:</strong> {detailsMovie.genres?.join(', ') || 'N/A'}</Typography>
              <Typography variant="body1" gutterBottom><strong>Plot:</strong> {detailsMovie.plot || 'N/A'}</Typography>
              <Typography variant="body1" gutterBottom><strong>Full Plot:</strong> {detailsMovie.fullplot || 'N/A'}</Typography>
              <Typography variant="body1" gutterBottom><strong>Cast:</strong> {detailsMovie.cast?.join(', ') || 'N/A'}</Typography>
              <Typography variant="body1" gutterBottom><strong>Directors:</strong> {detailsMovie.directors?.join(', ') || 'N/A'}</Typography>
              <Typography variant="body1" gutterBottom><strong>Languages:</strong> {detailsMovie.languages?.join(', ') || 'N/A'}</Typography>
              <Typography variant="body1" gutterBottom><strong>Countries:</strong> {detailsMovie.countries?.join(', ') || 'N/A'}</Typography>
              <Typography variant="body1" gutterBottom><strong>Released:</strong> {formatDate(detailsMovie.released?.$date || detailsMovie.released) || 'N/A'}</Typography>
              <Typography variant="body1" gutterBottom><strong>IMDb Rating:</strong> {detailsMovie.imdb?.rating || 'N/A'}</Typography>
              <Typography variant="body1" gutterBottom><strong>IMDb Votes:</strong> {detailsMovie.imdb?.votes || 'N/A'}</Typography>
              <Typography variant="body1" gutterBottom><strong>Tomato Meter:</strong> {detailsMovie.tomatoes?.viewer?.meter ? `${detailsMovie.tomatoes.viewer.meter}%` : 'N/A'}</Typography>
              <Typography variant="body1" gutterBottom><strong>Awards:</strong> {detailsMovie.awards?.text || 'N/A'}</Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDetailsModal}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default App;
