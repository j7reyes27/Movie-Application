import { GetStaticProps } from 'next';
import Image from 'next/image';
import { Card, Col, Row } from 'antd';
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
  // Genre mapping as before
};

const truncate = (str: string, n: number) => {
  return str.length > n ? str.substr(0, n - 1) + '...' : str;
};

interface HomeProps {
  movies: Movie[];
}

const Home = ({ movies }: HomeProps) => {
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

export const getStaticProps: GetStaticProps = async () => {
  const response = await axios.get(
    `https://api.themoviedb.org/3/search/movie?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&query=return`
  );

  return {
    props: {
      movies: response.data.results,
    },
    revalidate: 10, // Revalidate every 10 seconds to keep data fresh
  };
};

export default Home;
