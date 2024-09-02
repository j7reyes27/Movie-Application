// sessionContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const SessionContext = createContext<{ sessionId: string | null }>({ sessionId: null });

export const SessionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    const initializeSession = async () => {
      const storedSessionId = localStorage.getItem('sessionId');
      if (storedSessionId) {
        setSessionId(storedSessionId);
      } else {
        const response = await axios.get(
          `https://api.themoviedb.org/3/authentication/guest_session/new?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`
        );
        const newSessionId = response.data.guest_session_id;
        localStorage.setItem('sessionId', newSessionId);
        setSessionId(newSessionId);
      }
    };

    initializeSession();
  }, []);

  return (
    <SessionContext.Provider value={{ sessionId }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => useContext(SessionContext);
