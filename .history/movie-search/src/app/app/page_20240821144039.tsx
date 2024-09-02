// src/app/page.tsx
import React from 'react';
import MovieGrid from './components/MovieGrid'; // Adjust the import path if needed

const Home: React.FC = () => (
  <div>
    <h1>Movie List</h1>
    <MovieGrid />
  </div>
);

export default Home;
