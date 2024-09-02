"use client";

import { useEffect, useState } from 'react';
import axios from 'axios';
import { debounce } from 'lodash';
import './page.css';
import RatedMovies from './RatedMovies';
import { Card, Col, Row, Spin, Alert, Input, Pagination, Rate, Tabs } from 'antd';
import Image from 'next/image';


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

const ratingColor = (rating: number) => {
  if (rating <= 3) return "#E90000";
  if (rating <= 5) return "#E97E00";
  if (rating <= 7) return "#E9D100";
  return "#66E900";
};

const truncate = (str: string, n: number) => {
  return str.length > n ? str.substr(0, n - 1) + '...' : str;
};

const Home = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('a');
  const [page, setPage] = useState<number>(1);
  const [totalResults, setTotalResults] = useState<number>(0);
  const [session_id, setSessionId] = useState<string | null>(null);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [activeTab, setActiveTab] = useState<string>("1"); // Track the active tab

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
