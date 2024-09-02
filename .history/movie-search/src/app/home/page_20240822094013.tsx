"use client";

import Image from 'next/image';
import { Card, Col, Row } from 'antd';
import { useEffect, useState } from 'react';
import axios from 'axios';
import './page.css';

interface Movie {
  id: number;
  title: string;
  release_date: string;
  overview: string;
  poster_path: string | null;
}

const truncate = (str: string, n: number) => {
  return str.length > n ? str.substr(0, n - 1) + '...' : str;
};

const Home = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  useEffect(() => {
    const fetchMovies = async () => {
      const response = await axios.get(
        `https://api.themoviedb.org/3/search/movie?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&query=return`
      );
      setMovies(response.data.results);
    };

    fetchMovies();
  }, []);

  return (
    <div className="container">
      <Row gutter={[16, 16]}>
        {movies.map((movie) => (
          <Col span={8} key={movie.id}>
            <Card
              hoverable
              className="movie-card"
              cover={
                movie.poster_path ? (
                  <Image
                    alt={movie.title}
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    width={500}
                    height={750}
                    className="movie-image"
                  />
                ) : (
                  <div
                    style={{
                      width: 500,
                      height: 750,
                      backgroundColor: '#eee',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#999',
                    }}
                  >
                    No Image Available
                  </div>
                )
              }
            >
              <Card.Meta
                title={<span className="movie-title">{movie.title}</span>}
                description={
                  <div>
                    <p className="movie-overview">
                      {truncate(movie.overview, 100)}
                    </p>
                    <p className="movie-release-date">
                      {new Date(movie.release_date).toLocaleDateString()}
                    </p>
                  </div>
                }
              />
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Home;
