import React from 'react';
import { Card, Col, Row } from 'antd';

const { Meta } = Card;

const movies = [
  {
    title: 'The way back',
    releaseDate: 'March 6, 2020',
    genres: ['Action', 'Drama'],
    description:
      'A former basketball all-star, who has lost his wife and family foundation in a struggle with addiction attempts to regain his soul and salvation by becoming the coach of a disparate ethnically mixed high ...',
    image: 'path_to_your_image_here', // Replace with actual path or URL
  },
  // Repeat similar objects for other movies...
];

const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text;
  return text.substr(0, text.lastIndexOf(' ', maxLength)) + '...';
};

const MovieGrid: React.FC = () => {
  return (
    <div style={{ padding: '20px' }}>
      <Row gutter={[16, 16]}>
        {movies.map((movie, index) => (
          <Col xs={24} sm={12} md={8} lg={6} key={index}>
            <Card
              hoverable
              cover={
                <img
                  alt={movie.title}
                  src={movie.image}
                />
              }
            >
              <Meta
                title={movie.title}
                description={
                  <div>
                    <p>{movie.releaseDate}</p>
                    <div>
                      {movie.genres.map((genre, idx) => (
                        <span key={idx} style={{ marginRight: '5px' }}>
                          {genre}
                        </span>
                      ))}
                    </div>
                    <p>{truncateText(movie.description, 100)}</p>
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

export default MovieGrid;
