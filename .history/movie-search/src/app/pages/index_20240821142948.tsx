// pages/index.tsx
import React from 'react';
import MovieGrid from '../components/MovieGrid';

const Home: React.FC = () => {
  return (
    <div>
      <h1>Movie List</h1>
      <MovieGrid />
    </div>
  );
};

export default Home;
