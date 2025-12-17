import * as React from 'react';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import FuseSplashScreen from '@fuse/core/FuseSplashScreen';
import { showMessage } from 'app/store/fuse/messageSlice';
import { logoutUser, setUser } from 'app/store/userSlice';
import jwtService from './services/jwtService';

const AuthContext = React.createContext();

function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(undefined);
  const [waitAuthCheck, setWaitAuthCheck] = useState(true);
  const [needsPinVerification, setNeedsPinVerification] = useState(false);
  const dispatch = useDispatch();

  // Function to complete PIN verification and proceed to main app
  const completePinVerification = () => {
    setNeedsPinVerification(false);
    setIsAuthenticated(true);
  };

  // Function to redirect back to login after PIN creation
  const redirectToLogin = () => {
    setNeedsPinVerification(false);
    setIsAuthenticated(false);
    // Force a page reload to reset the auth state
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  useEffect(() => {
    jwtService.on('onAutoLogin', () => {
      dispatch(showMessage({ message: 'Signing in with JWT' }));

      /**
       * Sign in and retrieve user data with stored token
       */
      jwtService
        .signInWithToken()
        .then((user) => {
          success(user, 'Signed in with JWT');
        })
        .catch((error) => {
          pass(error.message);
        });
    });

    jwtService.on('onLogin', (user) => {
      // Store user data and set PIN verification requirement
      Promise.all([
        dispatch(setUser(user)),
      ]).then(() => {
        // Always require PIN verification after login
        setNeedsPinVerification(true);
        setWaitAuthCheck(false);
        setIsAuthenticated(false);
      });
    });

    jwtService.on('onLogout', () => {
      pass('Signed out');
      setNeedsPinVerification(false);
      dispatch(logoutUser());
    });

    jwtService.on('onAutoLogout', (message) => {
      pass(message);
      setNeedsPinVerification(false);
      dispatch(logoutUser());
    });

    jwtService.on('onNoAccessToken', () => {
      pass();
    });

    jwtService.init();

    function success(user, message) {
      if (message) {
        dispatch(showMessage({ message }));
      }

      Promise.all([
        dispatch(setUser(user)),
        // You can receive data in here before app initialization
      ]).then((values) => {
        setWaitAuthCheck(false);
        setIsAuthenticated(true);
        setNeedsPinVerification(false);
      });
    }

    function pass(message) {
      if (message) {
        dispatch(showMessage({ message }));
      }

      setWaitAuthCheck(false);
      setIsAuthenticated(false);
    }
  }, [dispatch]);

  return waitAuthCheck ? (
    <FuseSplashScreen />
  ) : (
    <AuthContext.Provider value={{ isAuthenticated, needsPinVerification, completePinVerification, redirectToLogin }}>{children}</AuthContext.Provider>
  );
}

function useAuth() {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within a AuthProvider');
  }
  return context;
}

export { AuthProvider, useAuth };
