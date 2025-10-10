// src/hooks/useClerkRedirect.js
import { useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';

export function useClerkRedirect() {
  const { isSignedIn } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (isSignedIn) {
      navigate('/interview'); // 👈 your interview page route
    }
  }, [isSignedIn, navigate]);
}
