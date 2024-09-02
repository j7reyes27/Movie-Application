"use client";
import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Spin, Alert } from 'antd';
import axios from 'axios';
import { useSession } from './sessionContext';

interface Movie {
  id: number;
  title: string;
  release_date: string;
  overview: string;
  poster_path: string | null;
  genre_ids: number[];
  vote_average: number;
}

interface Genre {
  id: number;
  name: string;
}

const RatedMovies = ({ genres }: { genres: Genre[] }) => {
  const { sessionId } = useSession();
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
          setRatedMovies([]);
        } else {
          setError('Failed to load rated movies.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchRatedMovies();
  }, [sessionId]);

  return (
    <div>
      {loading ? (
        <Spin size="large" />
      ) : error ? (
        <Alert message="Error" description={error} type="error" showIcon />
      ) : ratedMovies.length === 0 ? (
        <Alert message="No Results" description="You haven't rated any movies yet." type="info" showIcon />
      ) : (
        <Row gutter={[16, 16]}>
          {ratedMovies.map((movie) => (
            <Col xs={24} sm={12} md={8} key={movie.id}>
              <Card hoverable>
                {/* Rated Movie Details */}
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default RatedMovies;
