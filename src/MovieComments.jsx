// MovieComments.jsx
import React, { useEffect, useState } from 'react';
import { Typography, CircularProgress, Box, Divider } from '@mui/material';
import axios from 'axios';

export default function MovieComments({ movieId }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchComments = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`https://mflix-backend-ysnw.onrender.com/api/comments/${movieId}`);
        setComments(res.data || []);
      } catch (err) {
        setError('Failed to load comments');
      } finally {
        setLoading(false);
      }
    };

    if (movieId) fetchComments();
  }, [movieId]);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box>
      {comments.length === 0 ? (
        <Typography>No comments available.</Typography>
      ) : (
        comments.map((comment) => (
          <Box key={comment._id} sx={{ mb: 2 }}>
            <Typography variant="subtitle2">{comment.name}</Typography>
            <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
              {comment.text}
            </Typography>
            <Divider sx={{ my: 1 }} />
          </Box>
        ))
      )}
    </Box>
  );
}
