import React, { useState, useEffect, useContext } from 'react';
import {
  Container, Typography, List, ListItem, Button, Stack,
  CircularProgress, TextField, MenuItem, Dialog, DialogTitle, DialogContent,
  DialogActions, IconButton, Box
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import ClearIcon from '@mui/icons-material/Clear';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import LastPageIcon from '@mui/icons-material/LastPage';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import EditMovieForm from './EditMovieForm';
import axios from 'axios';
import { UserContext } from './UserContext';
import { useNavigate } from 'react-router-dom';

const PAGE_SIZE = 10;

const sortOptions = [
  { label: 'Title', value: 'title' },
  { label: 'Release Year', value: 'year' },
  { label: 'IMDb Rating', value: 'rating' },
  { label: 'Popularity (Votes)', value: 'popularity' },
  { label: 'Date Added', value: 'dateAdded' },
];

export default function MovieList() {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('title');
  const [ascending, setAscending] = useState(true);
  const [editMovieId, setEditMovieId] = useState(null);
  const [detailsMovie, setDetailsMovie] = useState(null);

  useEffect(() => {
    switch (sort) {
      case 'title': setAscending(true); break;
      case 'year':
      case 'dateAdded':
      case 'rating':
      case 'popularity': setAscending(false); break;
      default: setAscending(true);
    }
  }, [sort]);

  useEffect(() => {
    if (!user?.token) {
      navigate('/login');
      return;
    }
    const fetchMovies = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams({
          page,
          limit: PAGE_SIZE,
          sortBy: sort,
          sortOrder: ascending ? 'asc' : 'desc',
          search,
        });
        const res = await axios.get(
          `https://mflix-backend-ysnw.onrender.com/api/movies?${params.toString()}`,
          { headers: { Authorization: `Bearer ${user.token}` } }
        );
        setMovies(res.data.movies || []);
        setTotalPages(res.data.totalPages || 1);
      } catch (err) {
        setError('Failed to load movies');
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, [page, sort, ascending, search, user, navigate]);

  const handleCloseEditModal = () => setEditMovieId(null);
  const handleMovieUpdated = () => setPage(1);
  const openDetailsModal = (movie) => setDetailsMovie(movie);
  const closeDetailsModal = () => setDetailsMovie(null);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const d = new Date(dateString);
    return d.toLocaleDateString();
  };

  if (!user) {
    return (
      <Stack alignItems="center" sx={{ mt: 10 }}>
        <CircularProgress />
      </Stack>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 5, mb: 6 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'center' }}>
        Mflix Movies
      </Typography>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 4, justifyContent: 'space-between' }}>
        <TextField
          label="Search"
          variant="outlined"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          fullWidth
          sx={{ maxWidth: 400 }}
          InputProps={{
            endAdornment: search ? (
              <IconButton
                aria-label="clear search"
                onClick={() => { setSearch(''); setPage(1); }}
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
          onChange={(e) => { setSort(e.target.value); setPage(1); }}
          sx={{ width: 180 }}
        >
          {sortOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>

        <IconButton
          onClick={() => { setAscending((prev) => !prev); setPage(1); }}
          sx={{ alignSelf: 'center' }}
          aria-label={ascending ? 'Sort ascending' : 'Sort descending'}
        >
          {ascending ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />}
        </IconButton>
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
              sx={{
                px: 3,
                bgcolor: index % 2 === 0 ? 'grey.100' : 'background.paper',
                cursor: 'pointer',
                alignItems: 'flex-start',
                flexDirection: 'column', // Added to stack title + details vertically on small screens
              }}
              onClick={(e) => {
                if (e.target.closest('button')) return;
                openDetailsModal(movie);
              }}
              secondaryAction={
                <Button
                  variant="outlined"
                  startIcon={<EditIcon />}
                  onClick={() => setEditMovieId(movie._id)}
                  sx={{ textTransform: 'none', ml: 2 }}
                >
                  Edit
                </Button>
              }
            >
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'medium', wordBreak: 'break-word' }}>
                  {movie.title}
                </Typography>

                <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', mt: 0.5 }}>
                  Year: {movie.year || 'N/A'} | Rating: {movie.imdb?.rating ?? movie.rating ?? 'N/A'}
                  {"\n"}Popularity: {movie.imdb?.votes ?? movie.views ?? 'N/A'}
                  {"\n"}Released: {formatDate(movie.released?.$date || movie.dateAdded || movie.released)}
                </Typography>
              </Box>

            </ListItem>
          ))}
        </List>
      )}

      {totalPages > 1 && (
        <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 4 }}>
          <Button variant="outlined" onClick={() => setPage(1)} disabled={page === 1} startIcon={<FirstPageIcon />}>First</Button>
          <Button variant="outlined" onClick={() => setPage((prev) => Math.max(prev - 1, 1))} disabled={page === 1} startIcon={<NavigateBeforeIcon />}>Prev</Button>
          <Typography variant="body1" sx={{ alignSelf: 'center' }}>Page {page} of {totalPages}</Typography>
          <Button variant="outlined" onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))} disabled={page === totalPages} endIcon={<NavigateNextIcon />}>Next</Button>
          <Button variant="outlined" onClick={() => setPage(totalPages)} disabled={page === totalPages} endIcon={<LastPageIcon />}>Last</Button>
        </Stack>
      )}

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
                <Box component="img" src={detailsMovie.poster} alt={detailsMovie.title} sx={{ width: '100%', borderRadius: 1, mb: 2 }} />
              )}
              <Typography variant="body1" gutterBottom><strong>Year:</strong> {detailsMovie.year || 'N/A'}</Typography>
              <Typography variant="body1" gutterBottom><strong>Rated:</strong> {detailsMovie.rated || 'N/A'}</Typography>
              <Typography variant="body1" gutterBottom><strong>Runtime:</strong> {detailsMovie.runtime ? `${detailsMovie.runtime} minutes` : 'N/A'}</Typography>
              <Typography variant="body1" gutterBottom><strong>Genres:</strong> {detailsMovie.genres?.join(', ') || 'N/A'}</Typography>
              <Typography variant="body1" gutterBottom><strong>Plot:</strong> {detailsMovie.plot || 'N/A'}</Typography>
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
