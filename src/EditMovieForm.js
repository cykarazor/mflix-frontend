// EditMovieForm.js
import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Stack,
  CircularProgress,
  Alert,
} from '@mui/material';

function EditMovieForm({ movieId, onClose, onUpdated }) {
  const [form, setForm] = useState({
    title: '',
    year: '',
    plot: '',
    fullplot: '',
    genres: '',
    cast: '',
    languages: '',
    directors: '',
    rated: '',
    poster: '',
    runtime: '',
    countries: ''
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  useEffect(() => {
    if (!movieId) return;
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    fetch(`https://mflix-backend-ysnw.onrender.com/api/movies/${movieId}`)
      .then(res => {
        if (!res.ok) throw new Error(`Failed to fetch movie: ${res.status}`);
        return res.json();
      })
      .then(data => {
        setForm({
          title: data.title || '',
          year: data.year?.toString() || '',
          plot: data.plot || '',
          fullplot: data.fullplot || '',
          genres: data.genres?.join(', ') || '',
          cast: data.cast?.join(', ') || '',
          languages: data.languages?.join(', ') || '',
          directors: data.directors?.join(', ') || '',
          rated: data.rated || '',
          poster: data.poster || '',
          runtime: data.runtime?.toString() || '',
          countries: data.countries?.join(', ') || ''
        });
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [movieId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccessMsg(null);

    if (!form.title.trim()) {
      setError('Title is required');
      setSaving(false);
      return;
    }
    if (form.year && !/^[0-9]{4}$/.test(form.year)) {
      setError('Year must be a 4-digit number');
      setSaving(false);
      return;
    }

    try {
      const response = await fetch(`https://mflix-backend-ysnw.onrender.com/api/movies/${movieId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: form.title.trim(),
          year: form.year ? parseInt(form.year, 10) : null,
          plot: form.plot.trim(),
          fullplot: form.fullplot.trim(),
          genres: form.genres.split(',').map(g => g.trim()).filter(Boolean),
          cast: form.cast.split(',').map(c => c.trim()).filter(Boolean),
          languages: form.languages.split(',').map(l => l.trim()).filter(Boolean),
          directors: form.directors.split(',').map(d => d.trim()).filter(Boolean),
          rated: form.rated.trim(),
          poster: form.poster.trim(),
          runtime: form.runtime ? parseInt(form.runtime, 10) : null,
          countries: form.countries.split(',').map(c => c.trim()).filter(Boolean)
        })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to update movie');
      }

      setSuccessMsg('Movie updated successfully!');
      onUpdated();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <CircularProgress />;

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={2}>
        {error && <Alert severity="error">{error}</Alert>}
        {successMsg && <Alert severity="success">{successMsg}</Alert>}

        <TextField label="Title" name="title" value={form.title} onChange={handleChange} fullWidth required autoFocus />
        <TextField label="Year" name="year" value={form.year} onChange={handleChange} fullWidth inputProps={{ maxLength: 4 }} />
        <TextField label="Plot" name="plot" value={form.plot} onChange={handleChange} fullWidth multiline rows={2} />
        <TextField label="Full Plot" name="fullplot" value={form.fullplot} onChange={handleChange} fullWidth multiline rows={3} />
        <TextField label="Genres (comma-separated)" name="genres" value={form.genres} onChange={handleChange} fullWidth />
        <TextField label="Cast (comma-separated)" name="cast" value={form.cast} onChange={handleChange} fullWidth />
        <TextField label="Languages (comma-separated)" name="languages" value={form.languages} onChange={handleChange} fullWidth />
        <TextField label="Directors (comma-separated)" name="directors" value={form.directors} onChange={handleChange} fullWidth />
        <TextField label="Rated" name="rated" value={form.rated} onChange={handleChange} fullWidth />
        <TextField label="Poster URL" name="poster" value={form.poster} onChange={handleChange} fullWidth />
        <TextField label="Runtime (minutes)" name="runtime" value={form.runtime} onChange={handleChange} fullWidth />
        <TextField label="Countries (comma-separated)" name="countries" value={form.countries} onChange={handleChange} fullWidth />

        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <Button onClick={onClose} disabled={saving}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={saving}>
            {saving ? <CircularProgress size={24} /> : 'Save'}
          </Button>
        </Stack>
      </Stack>
    </form>
  );
}

export default EditMovieForm;
