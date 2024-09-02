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
  genre_ids: number[];
}

const genreMap: { [key: number]: string } = {
  28: "Action",
  12: "Adventure",
  16: "Animation",
  35: "Comedy",
  80: "Crime",
  99: "Documentary",
  18: "Drama",
  10751: "Family",
  14: "Fantasy",
  36: "History",
  27: "Horror",
  10402: "Music",
  9648: "Mystery",
  10749: "Romance",
  878: "Science Fiction",
  10770: "TV Movie",
  53: "Thriller",
  10752: "War",
  37: "Western",
};

const truncate = (str: string, n: number) => {
  return str.length > n ? str.substr(0, n - 1) + '...' : str;
};

const Home = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  useEffect(() => {
    const fetchMovies = async () => {
      const response = await axios.get(
        `https://api.themoviedb.org/3/search/movie?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&query=hello`
      );
      setMovies(response.data.results);
    };

    fetchMovies();
  }, []);

  return (
    <div className="container">
      <Row gutter={[16, 16]}>
        {movies.map((movie) => (
          <Col xs={24} sm={12} md={8} key={movie.id}>
            <Card hoverable className="movie-card">
              <Image
                alt={movie.title}
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
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
                      {genreMap[genreId]}
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
    </div>
  );
};

export default Home;
