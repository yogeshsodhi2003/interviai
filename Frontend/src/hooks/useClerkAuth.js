import { useUser } from '@clerk/clerk-react';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setUser, clearUser } from '../features/user/userSlice';

export function useClerkAuth() {
  const { user, isSignedIn } = useUser();
  const dispatch = useDispatch();

  useEffect(() => {
    if (isSignedIn && user) {
      dispatch(setUser({
        firebaseUid: user.id, // now Clerk user ID
        email: user.emailAddresses[0]?.emailAddress,
        name: user.fullName,
        resumeSummary: null,
      }));
    } else {
      dispatch(clearUser());
    }
  }, [user, isSignedIn, dispatch]);
}
