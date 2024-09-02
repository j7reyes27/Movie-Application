'use client';

import React, { useState, useEffect } from 'react'; // Import useState and useEffect from React
import { Row, Col, Card, Spin, Alert, Input, Pagination, Rate, Tabs } from 'antd';
import axios from 'axios';
import Image from 'next/image';
import RatedMovies from './RatedMovies'; // Ensure this import is correct


const ratingColor = (rating: number) => {
  if (rating <= 3) return "#E90000";
  if (rating <= 5) return "#E97E00";
  if (rating <= 7) return "#E9D100";
  return "#66E900";
};


// Your types and interfaces...

const Home = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('a');
  const [page, setPage] = useState<number>(1);
  const [totalResults, setTotalResults] = useState<number>(0);
  const [session_id, setSessionId] = useState<string | null>(null);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [activeTab, setActiveTab] = useState<string>("1");

  // Initialize the session or get the existing session ID
  const initializeSession = async () => {
    try {
      let existingSessionId = localStorage.getItem('session_id'); // Use consistent key
      
      if (existingSessionId) {
        setSessionId(existingSessionId);
        return;
      }

      const response = await axios.get(
        `https://api.themoviedb.org/3/authentication/guest_session/new?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`
      );

      const newSessionId = response.data.guest_session_id;
      setSessionId(newSessionId);
      localStorage.setItem('session_id', newSessionId); // Store under the same key
      
    } catch (err) {
      console.error('Failed to initialize session:', err);
    }
  };

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

  useEffect(() => {
    initializeSession(); // Initialize session when component mounts
    fetchGenres();
  }, []);

  useEffect(() => {
    if (activeTab === "1") {
      fetchMovies(searchTerm, page);
    } else if (activeTab === "2") {
      // Fetch rated movies when the Rated tab is active
      fetchRatedMovies();
    }
  }, [activeTab, searchTerm, page]);

  const handleTabChange = (key: string) => {
    setActiveTab(key);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(1); // Reset to first page when search term changes
  };

  const handleRate = async (movieId: number, rating: number) => {
    if (!session_id) return;
    try {
      const response = await axios.post(
        `https://api.themoviedb.org/3/movie/${movieId}/rating?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&guest_session_id=${session_id}`,
        { value: rating * 2 } // TMDB expects rating out of 10
      );
      console.log('Rating response:', response.data);
    } catch (err) {
      console.error('Failed to rate movie:', err);
    }
  };

  const handlePageChange = (page: number) => {
    setPage(page);
  };

  const truncate = (str: string, n: number) => {
    return str.length > n ? str.substr(0, n - 1) + '...' : str;
  };
  

  const renderMovies = (movies: Movie[]) => (
    <Row gutter={[16, 16]}>
      {movies.map((movie) => (
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
              <Rate
                allowHalf
                defaultValue={movie.userRating || 0}
                onChange={(value) => handleRate(movie.id, value)} // Attach the handleRate function here
              />
            </div>
          </Card>
        </Col>
      ))}
    </Row>
  );

  const tabItems = [
    {
      key: "1",
      label: "Search",
      children: (
        <>
          <Input
            placeholder="Search for movies..."
            value={searchTerm}
            onChange={handleSearch}
            style={{ marginBottom: 20 }}
          />
          {movies.length === 0 ? (
            <div className="no-results">
              <Alert message="No Results" description="No movies found matching your search." type="info" showIcon />
            </div>
          ) : (
            <>
              {renderMovies(movies)}
              <Pagination
                current={page}
                total={totalResults}
                pageSize={20}
                onChange={handlePageChange}
                style={{ marginTop: 20, textAlign: 'center' }}
              />
            </>
          )}
        </>
      ),
    },
    {
      key: "2",
      label: "Rated",
      children: session_id ? <RatedMovies sessionId={session_id} genres={genres} /> : <Spin size="large" />,
    },
  ];

  return (
    <div className="container">
      <Tabs defaultActiveKey="1" activeKey={activeTab} onChange={handleTabChange} items={tabItems} />
    </div>
  );
};

export default Home;
