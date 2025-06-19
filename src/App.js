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
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
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

  // New states for movie details modal
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState(null);

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

  // Fetch single movie details for modal
  const openDetailsModal = async (movieId) => {
    setDetailsLoading(true);
    setDetailsError(null);
    setSelectedMovie(null);

    try {
      const res = await fetch(`https://mflix-backend-ysnw.onrender.com/api/movies/${movieId}`);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      setSelectedMovie(data);
    } catch (error) {
      setDetailsError('Failed to load movie details');
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleCloseDetailsModal = () => {
    setSelectedMovie(null);
    setDetailsError(null);
  };

  const handleCloseEditModal = () => {
    setEditMovieId(null);
  };

  const handleMovieUpdated = () => {
    setPage(1);
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
              secondaryAction={
                <Button
                  variant="outlined"
                  startIcon={<EditIcon sx={{ mr: 0.5 }} />}
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent triggering list item click
                    setEditMovieId(movie._id);
                  }}
                  sx={{ textTransform: 'none' }}
                >
                  Edit
                </Button>
              }
              sx={{
                px: 3,
                bgcolor: index % 2 === 0 ? 'action.hover' : 'background.default',
                cursor: 'pointer',
              }}
              onClick={() => openDetailsModal(movie._id)}
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
      <Dialog
        open={!!selectedMovie || detailsLoading || !!detailsError}
        onClose={handleCloseDetailsModal}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Movie Details</DialogTitle>
        <DialogContent dividers>
          {detailsLoading && (
            <Stack alignItems="center" sx={{ my: 4 }}>
              <CircularProgress />
            </Stack>
          )}
          {detailsError && (
            <Typography color="error" sx={{ textAlign: 'center' }}>
              {detailsError}
            </Typography>
          )}
          {selectedMovie && (
            <>
              <Typography variant="h6" gutterBottom>{selectedMovie.title}</Typography>
              <Typography gutterBottom><strong>Year:</strong> {selectedMovie.year || 'N/A'}</Typography>
              <Typography gutterBottom><strong>Director:</strong> {selectedMovie.director || 'N/A'}</Typography>
              <Typography gutterBottom><strong>Description:</strong> {selectedMovie.description || 'No description available.'}</Typography>
              {/* Add more fields if your data has them */}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDetailsModal}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default App;
