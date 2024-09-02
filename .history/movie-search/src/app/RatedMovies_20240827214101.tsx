import { useEffect, useState } from 'react';
import axios from 'axios';

interface Movie {
  id: number;
  title: string;
  release_date: string;
  overview: string;
  poster_path: string | null;
  genre_ids: number[];
  vote_average: number;
  userRating?: number;
}

interface Genre {
  id: number;
  name: string;
}

const useSessionId = () => {
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    const fetchSessionId = async () => {
      try {
        const storedSessionId = localStorage.getItem('sessionId');
        if (storedSessionId) {
          setSessionId(storedSessionId);
        } else {
          const response = await axios.get(
            `https://api.themoviedb.org/3/authentication/guest_session/new?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`
          );
          const newSessionId = response.data.guest_session_id;
          localStorage.setItem('sessionId', newSessionId);
          setSessionId(newSessionId);
        }
      } catch (err) {
        console.error('Failed to initialize session.', err);
      }
    };

    fetchSessionId();
  }, []);

  return sessionId;
};

const RatedMovies = ({ genres }: { genres: Genre[] }) => {
  const sessionId = useSessionId();
  const [ratedMovies, setRatedMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRatedMovies = async () => {
      if (!sessionId) return;

      try {
        setLoading(true);
        const response = await axios.get(
          `https://api.themoviedb.org/3/guest_session/${sessionId}/rated/movies?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`
        );
        setRatedMovies(response.data.results);
      } catch (err) {
        if (err.response && err.response.status === 404) {
          setRatedMovies([]); // Handle no rated movies
        } else {
          setError('Failed to load rated movies.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchRatedMovies();
  }, [sessionId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (ratedMovies.length === 0) {
    return <div>No rated movies found.</div>;
  }

  return (
    <div>
      {ratedMovies.map((movie) => (
        <div key={movie.id}>{movie.title}</div>
      ))}
    </div>
  );
};

export default RatedMovies;
