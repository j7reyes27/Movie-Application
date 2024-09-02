// src/app/layout.tsx
import React from 'react';
// import './globals.css'; // Comment out or remove this line

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <html lang="en">
      <head>
        <title>My Movie App</title>
        <meta name="description" content="A movie search app built with Next.js" />
      </head>
      <body>
        <header>
          <h1>My Movie App</h1>
        </header>
        <main>{children}</main>
        <footer>
          <p>© 2024 My Movie App</p>
        </footer>
      </body>
    </html>
  );
};

export default Layout;
