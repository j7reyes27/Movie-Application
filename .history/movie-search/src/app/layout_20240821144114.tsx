// src/app/layout.tsx
import React from 'react';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div>
      <header>
        <h1>My Movie App</h1>
      </header>
      <main>{children}</main>
      <footer>
        <p>© 2024 My Movie App</p>
      </footer>
    </div>
  );
};

export default Layout;
