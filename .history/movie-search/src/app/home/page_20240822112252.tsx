import Image from 'next/image';
import { Card, Col, Row } from 'antd';
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

};

const truncate = (str: string, n: number) => {
  return str.length > n ? str.substr(0, n - 1) + '...' : str;
};


async function fetchMovies() {
  const response = await fetch(
    `https://api.themoviedb.org/3/search/movie?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&query=a`
  );
  const data = await response.json();
  return data.results;
}

export default async function Home() {
  const movies = await fetchMovies();

  return (
    <div className="container">
      <Row gutter={[16, 16]}>
        {movies.map((movie: Movie) => (
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
}
