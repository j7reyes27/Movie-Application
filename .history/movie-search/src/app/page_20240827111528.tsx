"use client";

import { useEffect, useState } from 'react';
import { Row, Col, Card, Spin, Alert } from 'antd';
import Image from 'next/image';
import axios from 'axios';
import { debounce } from 'lodash';
import './page.css';
import RatedMovies from './RatedMovies';

// The rest of your component code


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

interface RatedMoviesProps {
  sessionId: string;
  genres: Genre[];
}

const ratingColor = (rating: number) => {
  if (rating <= 3) return "#E90000";
  if (rating <= 5) return "#E97E00";
  if (rating <= 7) return "#E9D100";
  return "#66E900";
};

const truncate = (str: string, n: number) => {
  return str.length > n ? str.substr(0, n - 1) + '...' : str;
};

const RatedMovies: React.FC<RatedMoviesProps> = ({ sessionId, genres }) => {
  const [ratedMovies, setRatedMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRatedMovies = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `https://api.themoviedb.org/3/guest_session/${sessionId}/rated/movies?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`
        );
        setRatedMovies(response.data.results);
      } catch (err) {
        setError('Failed to load rated movies.');
        console.error('Error fetching rated movies:', err);
      } finally {
        setLoading(false);
      }
    };

    if (sessionId) {
      fetchRatedMovies();
    }
  }, [sessionId]);

  if (loading) {
    return (
      <div className="loading-container">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <Alert message="Error" description={error} type="error" showIcon />
      </div>
    );
  }

  if (ratedMovies.length === 0) {
    return (
      <div className="no-results">
        <Alert message="No Rated Movies" description="You haven't rated any movies yet." type="info" showIcon />
      </div>
    );
  }

  return (
    <Row gutter={[16, 16]}>
      {ratedMovies.map((movie) => (
        <Col xs={24} sm={12} md={8} key={movie.id}>
          <Card hoverable className="movie-card">
            <div className="rating-circle" style={{ backgroundColor: ratingColor(movie.vote_average) }}>
              {movie.vote_average.toFixed(1)}
            </div>
            <Image
              alt={movie.title}
              src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '/path-to-default-image.jpg'}
              width={150}
              height={225}
              className="movie-image"
            />
            <div className="movie-details">
              <h3 className="movie-title">{movie.title}</h3>
              <p className="movie-release-date">
                {new Date(movie.release_date).toLocaleDateString()}
              </p>
              <div className="movie-genres">
                {movie.genre_ids.map((genreId) => (
                  <span key={genreId} className="movie-genre">
                    {genres.find(genre => genre.id === genreId)?.name || 'Unknown Genre'}
                  </span>
                ))}
              </div>
              <p className="movie-overview">
                {truncate(movie.overview, 120)}
              </p>
            </div>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default RatedMovies;
