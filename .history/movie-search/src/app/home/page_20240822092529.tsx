import { Card, Col, Row } from 'antd';
import { useEffect, useState } from 'react';
import axios from 'axios';

interface Movie {
  id: number;
  title: string;
  release_date: string;
  overview: string;
  poster_path: string;
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
    <div style={{ padding: '20px' }}>
      <Row gutter={[16, 16]}>
        {movies.map((movie) => (
          <Col span={8} key={movie.id}>
            <Card
              hoverable
              cover={
                <img
                  alt={movie.title}
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                />
              }
            >
              <Card.Meta
                title={movie.title}
                description={truncate(movie.overview, 100)}
              />
              <p>{new Date(movie.release_date).toLocaleDateString()}</p>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Home;
