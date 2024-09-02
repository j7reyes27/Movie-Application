// Home.tsx
import React, { useState, useEffect } from 'react';
import { Card, Col, Row, Spin, Alert, Input, Pagination, Rate, Tabs } from 'antd';
import axios from 'axios';
import { debounce } from 'lodash';
import RatedMovies from './RatedMovies';
import { useSession } from './sessionContext';

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

const Home = () => {
  const { sessionId } = useSession();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('a');
  const [page, setPage] = useState<number>(1);
  const [totalResults, setTotalResults] = useState<number>(0);
  const [genres, setGenres] = useState<Genre[]>([]);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/genre/movie/list?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`
        );
        setGenres(response.data.genres);
      } catch (err) {
        console.error('Failed to load genres.');
      }
    };

    fetchGenres();
  }, []);

  const fetchMovies = async (search: string, page: number) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://api.themoviedb.org/3/search/movie?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&query=${search}&page=${page}`
      );
      setMovies(response.data.results);
      setTotalResults(response.data.total_results);
    } catch (err) {
      setError('Failed to load movies.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const debouncedFetchMovies = debounce((search: string, page: number) => {
      fetchMovies(search, page);
    }, 500);

    debouncedFetchMovies(searchTerm, page);

    return () => {
      debouncedFetchMovies.cancel();
    };
  }, [searchTerm, page]);

  const handleRate = async (movieId: number, rating: number) => {
    if (!sessionId) return;

    try {
      await axios.post(
        `https://api.themoviedb.org/3/movie/${movieId}/rating?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&guest_session_id=${sessionId}`,
        { value: rating * 2 }
      );
    } catch (err) {
      console.error('Failed to rate movie:', err);
    }
  };

  return (
    <div className="container">
      <Tabs defaultActiveKey="1">
        <Tabs.TabPane tab="Search" key="1">
          <Input
            placeholder="Search for movies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ marginBottom: 20 }}
          />
          {loading ? (
            <Spin size="large" />
          ) : error ? (
            <Alert message="Error" description={error} type="error" showIcon />
          ) : (
            <>
              <Row gutter={[16, 16]}>
                {movies.map((movie) => (
                  <Col xs={24} sm={12} md={8} key={movie.id}>
                    <Card hoverable>
                      {/* Movie details here */}
                    </Card>
                  </Col>
                ))}
              </Row>
              <Pagination
                current={page}
                total={totalResults}
                pageSize={20}
                onChange={(page) => setPage(page)}
              />
            </>
          )}
        </Tabs.TabPane>
        <Tabs.TabPane tab="Rated" key="2">
          {sessionId ? <RatedMovies genres={genres} /> : <Spin size="large" />}
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
};

export default Home;
