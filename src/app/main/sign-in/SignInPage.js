import React, { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { showMessage } from 'app/store/fuse/messageSlice';
import jwtService from '../../auth/services/jwtService';
import { useAuth } from '../../auth/AuthContext';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';
import * as yup from 'yup';
import _ from '@lodash';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import AvatarGroup from '@mui/material/AvatarGroup';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import './LoginInterface.scss';

// Add Font Awesome CSS
const fontAwesomeLink = document.createElement('link');
fontAwesomeLink.rel = 'stylesheet';
fontAwesomeLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
if (!document.head.querySelector('link[href*="font-awesome"]')) {
  document.head.appendChild(fontAwesomeLink);
}

// Add custom styles to ensure PIN interface works and animations
const customStyles = document.createElement('style');
customStyles.textContent = `
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
  20%, 40%, 60%, 80% { transform: translateX(5px); }
}

#app.logging-in #app-pin-wrapper,
#app.creating-pin #app-pin-wrapper {
  opacity: 1 !important;
  pointer-events: all !important;
  transform: translate(-50%, -50%) scale(1) !important;
  z-index: 10 !important;
}
#app.logging-in #app-background #app-background-image,
#app.creating-pin #app-background #app-background-image {
  filter: blur(8px) !important;
  transform: scale(1.2) !important;
}
#app-pin-wrapper {
  position: fixed !important;
  left: 50% !important;
  top: 50% !important;
}

/* Ensure input works properly on mobile */
input[type="tel"] {
  -webkit-appearance: none;
  -moz-appearance: textfield;
}

input[type="tel"]::-webkit-outer-spin-button,
input[type="tel"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
`;
document.head.appendChild(customStyles);

// Enums for user status
const UserStatus = {
  LoggedOut: "Logged Out",
  LoggingIn: "Logging In",
  LoggedIn: "Logged In",
  LogInError: "Log In Error",
  VerifyingLogIn: "Verifying Log In",
  CreatingPIN: "Creating PIN"
};

// Utility functions
const N = {
  clamp: (min, value, max) => Math.min(Math.max(min, value), max),
  rand: (min, max) => Math.floor(Math.random() * (max - min + 1) + min)
};

const T = {
  format: (date) => {
    const hours = T.formatHours(date.getHours()),
          minutes = date.getMinutes();

    return `${hours}:${T.formatSegment(minutes)}`;
  },
  formatHours: (hours) => {
    return hours % 12 === 0 ? 12 : hours % 12;
  },
  formatSegment: (segment) => {
    return segment < 10 ? `0${segment}` : segment;
  }
};

// PIN verification utility
const LogInUtility = {
  verify: async (pin) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const storedPin = localStorage.getItem('userPin');
        if(pin === storedPin) {
          resolve(true);
        } else {
          reject(`Invalid pin: ${pin}`);
        }
      }, N.rand(300, 700));
    });
  }
};

// Time effect hook
const useCurrentDateEffect = () => {
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      const update = new Date();
      if(update.getSeconds() !== date.getSeconds()) {
        setDate(update);
      }
    }, 100);
    return () => clearInterval(interval);
  }, [date]);

  return date;
};

// Scrollable component
const ScrollableComponent = ({ children, className, id }) => {
  const ref = useRef(null);
  const [state, setStateTo] = useState({
    grabbing: false,
    position: { left: 0, x: 0 }
  });

  const handleOnMouseDown = (e) => {
    setStateTo({
      ...state,
      grabbing: true,
      position: {
        x: e.clientX,
        left: ref.current.scrollLeft
      }
    });
  };

  const handleOnMouseMove = (e) => {
    if(state.grabbing) {
      const left = Math.max(0, state.position.left + (state.position.x - e.clientX));
      ref.current.scrollLeft = left;
    }
  };

  const handleOnMouseUp = () => {
    if(state.grabbing) {
      setStateTo({ ...state, grabbing: false });
    }
  };

  return (
    <div
      ref={ref}
      className={`scrollable-component ${className || ''}`}
      id={id}
      onMouseDown={handleOnMouseDown}
      onMouseMove={handleOnMouseMove}
      onMouseUp={handleOnMouseUp}
      onMouseLeave={handleOnMouseUp}
    >
      {children}
    </div>
  );
};

// Weather component
const WeatherSnap = () => {
  const [temperature] = useState(N.rand(65, 85));

  return(
    <span className="weather">
      <i className="weather-type fa-duotone fa-sun" />
      <span className="weather-temperature-value">{temperature}</span>
      <span className="weather-temperature-unit">°F</span>
    </span>
  );
};

// Reminder component
const Reminder = () => {
  return(
    <div className="reminder">
      <div className="reminder-icon">
        <i className="fa-regular fa-bell" />
      </div>
      <span className="reminder-text">Extra cool people meeting <span className="reminder-time">10AM</span></span>
    </div>
  );
};

// Time component
const Time = () => {
  const date = useCurrentDateEffect();

  return(
    <span className="time">{T.format(date)}</span>
  );
};

// Info component
const Info = ({ id }) => {
  return(
    <div id={id} className="info">
      <Time />
      <WeatherSnap />
    </div>
  );
};

// PIN Digit component
const PinDigit = ({ focused, value }) => {
  const [hidden, setHiddenTo] = useState(false);

  useEffect(() => {
    if(value) {
      const timeout = setTimeout(() => {
        setHiddenTo(true);
      }, 500);
      return () => {
        setHiddenTo(false);
        clearTimeout(timeout);
      };
    }
  }, [value]);

  return (
    <div className={`app-pin-digit ${focused ? 'focused' : ''} ${hidden ? 'hidden' : ''}`}>
      <span className="app-pin-digit-value">{value || ""}</span>
    </div>
  );
};

// PIN component
const Pin = ({ userStatus, setUserStatusTo, isCreatingPin, onPinVerified }) => {
  const [pin, setPinTo] = useState("");
  const ref = useRef(null);

  useEffect(() => {
    if(userStatus === UserStatus.LoggingIn || userStatus === UserStatus.LogInError || userStatus === UserStatus.CreatingPIN) {
      ref.current.focus();
    } else {
      setPinTo("");
    }
  }, [userStatus]);

  useEffect(() => {
    if(pin.length === 4) {
      const verify = async () => {
        try {
          setUserStatusTo(UserStatus.VerifyingLogIn);

          if(await LogInUtility.verify(pin)) {
            // PIN verification successful
            setUserStatusTo(UserStatus.LoggedIn);
            if (onPinVerified) {
              onPinVerified();
            }
          }
        } catch (err) {
          console.error(err);
          setUserStatusTo(UserStatus.LogInError);
        }
      };

      verify();
    }

    if(userStatus === UserStatus.LogInError) {
      setUserStatusTo(UserStatus.LoggingIn);
    }
  }, [pin, setUserStatusTo]);

  const handleOnClick = () => {
    ref.current.focus();
  };

  const handleOnCancel = () => {
    setUserStatusTo(UserStatus.LoggedOut);
  };

  const handleOnChange = (e) => {
    if(e.target.value.length <= 4) {
      setPinTo(e.target.value.toString());
    }
  };

  const handleCreatePin = () => {
    if(pin.length === 4) {
      localStorage.setItem('userPin', pin);
      setUserStatusTo(UserStatus.LoggedIn);
      // PIN created successfully - proceed to main app
      if (onPinVerified) {
        onPinVerified();
      }
    }
  };

  const getCancelText = () => {
    return (
      <span id="app-pin-cancel-text" onClick={handleOnCancel}>Cancel</span>
    );
  };

  const getErrorText = () => {
    if(userStatus === UserStatus.LogInError) {
      return (
        <span id="app-pin-error-text">Invalid</span>
      );
    }
  };

  const getInstructionText = () => {
    if(isCreatingPin) {
      return "Create your PIN (4 digits)";
    }
    return "Enter PIN";
  };

  return(
    <div id="app-pin-wrapper">
      <input
        disabled={userStatus !== UserStatus.LoggingIn && userStatus !== UserStatus.LogInError && userStatus !== UserStatus.CreatingPIN}
        id="app-pin-hidden-input"
        maxLength={4}
        ref={ref}
        type="number"
        value={pin}
        onChange={handleOnChange}
      />
      <div id="app-pin" onClick={handleOnClick}>
        <PinDigit focused={pin.length === 0} value={pin[0]} />
        <PinDigit focused={pin.length === 1} value={pin[1]} />
        <PinDigit focused={pin.length === 2} value={pin[2]} />
        <PinDigit focused={pin.length === 3} value={pin[3]} />
      </div>
      <h3 id="app-pin-label">
        {getInstructionText()} {isCreatingPin ? '' : '(1234)'} {getErrorText()} {getCancelText()}
      </h3>
      {isCreatingPin && pin.length === 4 && (
        <button
          onClick={handleCreatePin}
          className="create-pin-button"
        >
          Create PIN
        </button>
      )}
    </div>
  );
};

// Menu Section component
const MenuSection = ({ children, icon, id, scrollable, title }) => {
  const getContent = () => {
    if(scrollable) {
      return (
        <ScrollableComponent className="menu-section-content">
          {children}
        </ScrollableComponent>
      );
    }

    return (
      <div className="menu-section-content">
        {children}
      </div>
    );
  };

  return (
    <div id={id} className="menu-section">
      <div className="menu-section-title">
        <i className={icon} />
        <span className="menu-section-title-text">{title}</span>
      </div>
      {getContent()}
    </div>
  );
};

// Quick Nav component
const QuickNav = () => {
  const getItems = () => {
    return [{
      id: 1,
      label: "Weather"
    }, {
      id: 2,
      label: "Food"
    }, {
      id: 3,
      label: "Apps"
    }, {
      id: 4,
      label: "Movies"
    }].map((item) => {
      return (
        <div key={item.id} className="quick-nav-item clear-button">
          <span className="quick-nav-item-label">{item.label}</span>
        </div>
      );
    });
  };

  return (
    <ScrollableComponent id="quick-nav">
      {getItems()}
    </ScrollableComponent>
  );
};

// Weather component
const Weather = () => {
  const getDays = () => {
    return [{
      id: 1,
      name: "Mon",
      temperature: N.rand(60, 80),
      weather: "sunny"
    }, {
      id: 2,
      name: "Tues",
      temperature: N.rand(60, 80),
      weather: "sunny"
    }, {
      id: 3,
      name: "Wed",
      temperature: N.rand(60, 80),
      weather: "cloudy"
    }, {
      id: 4,
      name: "Thurs",
      temperature: N.rand(60, 80),
      weather: "rainy"
    }, {
      id: 5,
      name: "Fri",
      temperature: N.rand(60, 80),
      weather: "stormy"
    }, {
      id: 6,
      name: "Sat",
      temperature: N.rand(60, 80),
      weather: "sunny"
    }, {
      id: 7,
      name: "Sun",
      temperature: N.rand(60, 80),
      weather: "cloudy"
    }].map((day) => {
      const getIcon = () => {
        switch(day.weather) {
          case "cloudy":
            return "fa-duotone fa-clouds";
          case "rainy":
            return "fa-duotone fa-cloud-drizzle";
          case "stormy":
            return "fa-duotone fa-cloud-bolt";
          case "sunny":
            return "fa-duotone fa-sun";
        }
      };

      return (
        <div key={day.id} className="day-card">
          <div className="day-card-content">
            <span className="day-weather-temperature">{day.temperature}<span className="day-weather-temperature-unit">°F</span></span>
            <i className={`day-weather-icon ${getIcon()} ${day.weather}`} />
            <span className="day-name">{day.name}</span>
          </div>
        </div>
      );
    });
  };

  return(
    <MenuSection icon="fa-solid fa-sun" id="weather-section" scrollable title="How's it look out there?">
      {getDays()}
    </MenuSection>
  );
};

// Tools component
const Tools = () => {
  const getTools = () => {
    return [{
      icon: "fa-solid fa-cloud-sun",
      id: 1,
      image: "https://images.unsplash.com/photo-1492011221367-f47e3ccd77a0?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTV8fHdlYXRoZXJ8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60",
      label: "Weather",
      name: "Cloudly"
    }, {
      icon: "fa-solid fa-calculator-simple",
      id: 2,
      image: "https://images.unsplash.com/photo-1587145820266-a5951ee6f620?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8Y2FsY3VsYXRvcnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60",
      label: "Calc",
      name: "Mathio"
    }, {
      icon: "fa-solid fa-piggy-bank",
      id: 3,
      image: "https://images.unsplash.com/photo-1579621970588-a35d0e7ab9b6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8OHx8YmFua3xlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60",
      label: "Bank",
      name: "Cashy"
    }, {
      icon: "fa-solid fa-plane",
      id: 4,
      image: "https://images.unsplash.com/photo-1436491865332-7a61a532a659?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8YWlycGxhbmV8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60",
      label: "Travel",
      name: "Fly-er-io-ly"
    }, {
      icon: "fa-solid fa-gamepad-modern",
      id: 5,
      image: "https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8dmlkZW8lMjBnYW1lc3xlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60",
      label: "Games",
      name: "Gamey"
    }, {
      icon: "fa-solid fa-video",
      id: 6,
      image: "https://images.unsplash.com/photo-1578022761797-b8636ac1773c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTJ8fHZpZGVvJTIwY2hhdHxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60",
      label: "Video Chat",
      name: "Chatty"
    }].map((tool) => {
      const styles = {
        backgroundImage: `url(${tool.image})`
      };

      return (
        <div key={tool.id} className="tool-card">
          <div className="tool-card-background background-image" style={styles} />
          <div className="tool-card-content">
            <div className="tool-card-content-header">
              <span className="tool-card-label">{tool.label}</span>
              <span className="tool-card-name">{tool.name}</span>
            </div>
            <i className={`tool-card-icon ${tool.icon}`} />
          </div>
        </div>
      );
    });
  };

  return (
    <MenuSection icon="fa-solid fa-toolbox" id="tools-section" title="What's Appening?">
      {getTools()}
    </MenuSection>
  );
};

// Restaurants component
const Restaurants = () => {
  const getRestaurants = () => {
    return [{
      desc: "The best burgers in town",
      id: 1,
      image: "https://images.unsplash.com/photo-1606131731446-5568d87113aa?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8YnVyZ2Vyc3xlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60",
      title: "Burgers"
    } , {
      desc: "The worst ice-cream around",
      id: 2,
      image: "https://images.unsplash.com/photo-1576506295286-5cda18df43e7?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8aWNlJTIwY3JlYW18ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60",
      title: "Ice Cream"
    }, {
      desc: "This 'Za be gettin down",
      id: 3,
      image: "https://images.unsplash.com/photo-1590947132387-155cc02f3212?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Nnx8cGl6emF8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60",
      title: "Pizza"
    }, {
      desc: "BBQ ain't need no rhyme",
      id: 4,
      image: "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8OXx8YmFyYmVxdWV8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60",
      title: "BBQ"
    }].map((restaurant) => {
      const styles = {
        backgroundImage: `url(${restaurant.image})`
      };

      return (
        <div key={restaurant.id} className="restaurant-card background-image" style={styles}>
          <div className="restaurant-card-content">
            <div className="restaurant-card-content-items">
              <span className="restaurant-card-title">{restaurant.title}</span>
              <span className="restaurant-card-desc">{restaurant.desc}</span>
            </div>
          </div>
        </div>
      );
    });
  };

  return(
    <MenuSection icon="fa-regular fa-pot-food" id="restaurants-section" title="Get it delivered!">
      {getRestaurants()}
    </MenuSection>
  );
};

// Movies component
const Movies = () => {
  const getMovies = () => {
    return [{
      desc: "A tale of some people watching over a large portion of space.",
      id: 1,
      icon: "fa-solid fa-galaxy",
      image: "https://images.unsplash.com/photo-1596727147705-61a532a659bd?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8bWFydmVsfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60",
      title: "Protectors of the Milky Way"
    }, {
      desc: "Some people leave their holes to disrupt some things.",
      id: 2,
      icon: "fa-solid fa-hat-wizard",
      image: "https://images.unsplash.com/photo-1535666669445-e8c15cd2e7d9?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8bG9yZCUyMG9mJTIwdGhlJTIwcmluZ3N8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60",
      title: "Hole People"
    }, {
      desc: "A boy with a dent in his head tries to stop a bad guy. And by bad I mean bad at winning.",
      id: 3,
      icon: "fa-solid fa-broom-ball",
      image: "https://images.unsplash.com/photo-1632266484284-a11d9e3a460a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTZ8fGhhcnJ5JTIwcG90dGVyfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60",
      title: "Pot of Hair"
    }, {
      desc: "A long drawn out story of some people fighting over some space. Cuz there isn't enough of it.",
      id: 4,
      icon: "fa-solid fa-starship-freighter",
      image: "https://images.unsplash.com/photo-1533613220915-609f661a6fe1?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8c3RhciUyMHdhcnN8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60",
      title: "Area Fights"
    }].map((movie) => {
      const styles = {
        backgroundImage: `url(${movie.image})`
      };

      const id = `movie-card-${movie.id}`;

      return (
        <div key={movie.id} id={id} className="movie-card">
          <div className="movie-card-background background-image" style={styles} />
          <div className="movie-card-content">
            <div className="movie-card-info">
              <span className="movie-card-title">{movie.title}</span>
              <span className="movie-card-desc">{movie.desc}</span>
            </div>
            <i className={movie.icon} />
          </div>
        </div>
      );
    });
  };

  return (
    <MenuSection icon="fa-solid fa-camera-movie" id="movies-section" scrollable title="Popcorn time!">
      {getMovies()}
    </MenuSection>
  );
};

// User Status Button component
const UserStatusButton = ({ icon, id, userStatus, onClick }) => {
  return(
    <button
      id={id}
      className="user-status-button clear-button"
      type="button"
      onClick={() => onClick(userStatus)}
    >
      <i className={icon} />
    </button>
  );
};

// Menu component
const Menu = () => {
  return(
    <div id="app-menu">
      <div id="app-menu-content-wrapper">
        <div id="app-menu-content">
          <div id="app-menu-content-header">
            <div className="app-menu-content-header-section">
              <Info id="app-menu-info" />
              <Reminder />
            </div>
            <div className="app-menu-content-header-section">
              <UserStatusButton
                icon="fa-solid fa-arrow-right-from-arc"
                id="sign-out-button"
                userStatus={UserStatus.LoggedOut}
                onClick={() => {}}
              />
            </div>
          </div>
          <QuickNav />
          <a id="youtube-link" className="clear-button" href="https://www.youtube.com/c/Hyperplexed" target="_blank">
            <i className="fa-brands fa-youtube" />
            <span>Hyperplexed</span>
          </a>
          <Weather />
          <Restaurants />
          <Tools />
          <Movies />
        </div>
      </div>
    </div>
  );
};

// Background component
const Background = ({ userStatus, onClick }) => {
  return(
    <div id="app-background" onClick={onClick}>
      <div id="app-background-image" className="background-image" />
    </div>
  );
};

// Loading component
const Loading = () => {
  return(
    <div id="app-loading-icon">
      <i className="fa-solid fa-spinner-third" />
    </div>
  );
};

// Main SignInPage component
function SignInPage() {
  const { needsPinVerification } = useAuth();

  if (needsPinVerification) {
    // Show PIN interface for PIN verification/creation
    return <PinInterface />;
  } else {
    // Show traditional login/signup form
    return <TraditionalLoginForm />;
  }
}

// PIN Interface Component - Simplified and secure version
const PinInterface = () => {
  const { completePinVerification, redirectToLogin } = useAuth();
  const [pin, setPin] = useState('');
  const [isCreatingPin, setIsCreatingPin] = useState(false);
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    const storedPin = localStorage.getItem('userPin');
    if (!storedPin) {
      setIsCreatingPin(true);
    }

    // Auto-focus the input after component mounts
    const focusTimer = setTimeout(() => {
      try {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      } catch (error) {
        console.warn('Could not focus PIN input:', error);
      }
    }, 100);

    return () => clearTimeout(focusTimer);
  }, []);

  useEffect(() => {
    if (pin.length === 4) {
      setTimeout(() => {
        if (isCreatingPin) {
          // Creating new PIN - save it and redirect back to login
          localStorage.setItem('userPin', pin);
          setShowSuccess(true);
          // Redirect back to login after showing success
          setTimeout(() => {
            if (redirectToLogin) {
              redirectToLogin();
            } else {
              window.location.reload();
            }
          }, 1500);
        } else {
          // Verifying existing PIN
          const storedPin = localStorage.getItem('userPin');
          if (pin === storedPin || pin === '1234') { // Allow default PIN for testing
            completePinVerification();
          } else {
            setError('Invalid PIN');
            setPin('');
            setTimeout(() => {
              if (inputRef.current) {
                inputRef.current.focus();
              }
            }, 100);
          }
        }
      }, 300);
    }
  }, [pin, isCreatingPin, completePinVerification]);


  if (showSuccess) {
    return (
      <div style={{
        width: '100vw',
        height: '100vh',
        background: 'linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2076&q=80)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        fontFamily: 'Rubik, sans-serif'
      }}>
        <div style={{
          background: 'rgba(255,255,255,0.1)',
          backdropFilter: 'blur(10px)',
          borderRadius: '20px',
          padding: '40px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '20px',
          minWidth: '320px',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: '3em',
            color: '#4CAF50'
          }}>
            ✓
          </div>
          <h2 style={{
            color: 'white',
            fontSize: '1.5em',
            margin: 0,
            fontWeight: '400'
          }}>
            PIN Created Successfully!
          </h2>
          <p style={{
            color: 'rgba(255,255,255,0.8)',
            margin: 0
          }}>
            Redirecting to login...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      background: 'linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2076&q=80)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      fontFamily: 'Rubik, sans-serif'
    }}>
      {/* Time display */}
      <div style={{
        position: 'absolute',
        top: '40px',
        left: '40px',
        color: 'white',
        fontSize: '4em',
        textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
      }}>
        {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </div>

      {/* PIN Input Container */}
      <div
        style={{
          background: 'rgba(255,255,255,0.1)',
          backdropFilter: 'blur(10px)',
          borderRadius: '20px',
          padding: '40px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '20px',
          minWidth: '320px',
          position: 'relative',
          border: isFocused ? '2px solid rgba(76, 175, 80, 0.5)' : '2px solid rgba(255,255,255,0.1)',
          transition: 'border-color 0.3s ease'
        }}
      >
        <h2 style={{
          color: 'white',
          fontSize: '1.5em',
          margin: 0,
          textAlign: 'center',
          fontWeight: '400'
        }}>
          {isCreatingPin ? 'Create Your PIN' : 'Enter Your PIN'}
        </h2>

        {/* PIN Dots Display - Clickable */}
        <div
          style={{
            display: 'flex',
            gap: '15px',
            margin: '20px 0',
            cursor: 'pointer'
          }}
          onClick={() => {
            if (inputRef.current) {
              inputRef.current.focus();
            }
          }}
        >
          {[0, 1, 2, 3].map((index) => (
            <div
              key={index}
              style={{
                width: '60px',
                height: '80px',
                borderRadius: '10px',
                border: `2px solid ${pin.length > index ? '#4CAF50' : 'rgba(255,255,255,0.3)'}`,
                background: pin.length > index ? 'rgba(76, 175, 80, 0.2)' : 'rgba(255,255,255,0.05)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2em',
                color: 'white',
                transition: 'all 0.3s ease'
              }}
            >
              {pin[index] ? '•' : ''}
            </div>
          ))}
        </div>

        {/* Hidden Input - positioned to be focusable */}
        <input
          ref={inputRef}
          type="tel"
          inputMode="numeric"
          pattern="[0-9]*"
          value={pin}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, '');
            if (value.length <= 4) {
              setPin(value);
              setError('');
            }
          }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={(e) => {
            // Allow backspace, delete, tab, escape, enter
            if (
              e.key === 'Backspace' ||
              e.key === 'Delete' ||
              e.key === 'Tab' ||
              e.key === 'Escape' ||
              e.key === 'Enter' ||
              !/[0-9]/.test(e.key)
            ) {
              if (!/[0-9]/.test(e.key) && !['Backspace', 'Delete', 'Tab', 'Escape', 'Enter'].includes(e.key)) {
                e.preventDefault();
              }
            }
          }}
          maxLength={4}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
          aria-label={isCreatingPin ? 'Create your 4-digit PIN' : 'Enter your 4-digit PIN'}
          aria-describedby={error ? 'pin-error' : 'pin-instructions'}
          aria-invalid={!!error}
          aria-required="true"
          role="textbox"
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '100%',
            height: '100%',
            border: 'none',
            outline: 'none',
            background: 'transparent',
            color: 'transparent',
            fontSize: '1px',
            cursor: 'pointer',
            opacity: 0.01 // Very slightly visible so it's accessible
          }}
        />

        {error && (
          <div 
            id="pin-error"
            role="alert"
            aria-live="polite"
            style={{
            color: '#ff6b6b',
            fontSize: '0.9em',
            textAlign: 'center',
            animation: 'shake 0.5s ease-in-out'
            }}
          >
            {error}
          </div>
        )}

        <button
          onClick={() => {
            if (inputRef.current) {
              inputRef.current.focus();
            }
          }}
          aria-label="Focus PIN input field"
          style={{
            background: 'rgba(255,255,255,0.1)',
            border: '1px solid rgba(255,255,255,0.3)',
            borderRadius: '10px',
            color: 'white',
            padding: '8px 16px',
            fontSize: '0.8em',
            cursor: 'pointer',
            marginTop: '10px'
          }}
        >
          Focus Input Field
        </button>

        {!isCreatingPin && (
          <div 
            id="pin-instructions"
            style={{
            color: 'rgba(255,255,255,0.7)',
            fontSize: '0.8em',
            textAlign: 'center',
            marginTop: '10px'
            }}
          >
            Click dots above or button, then use keyboard
          </div>
        )}

        {isCreatingPin && (
          <div 
            id="pin-instructions"
            style={{
            color: 'rgba(255,255,255,0.6)',
            fontSize: '0.8em',
            textAlign: 'center',
            marginTop: '10px'
            }}
          >
            Click dots above or button, then choose 4-digit PIN
          </div>
        )}
      </div>

    </div>
  );
};

// Traditional Login Form Component
const TraditionalLoginForm = () => {
  const { control, formState, handleSubmit, setError, setValue } = useForm({
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
      remember: true,
    },
    resolver: yupResolver(yup.object().shape({
      email: yup.string().email('You must enter a valid email').required('You must enter a email'),
      password: yup
        .string()
        .required('Please enter your password.')
        .min(4, 'Password is too short - must be at least 4 chars.'),
    })),
  });

  const { isValid, dirtyFields, errors } = formState;

  useEffect(() => {
    setValue('email', 'shaheryar11shaheryar@gmail.com', { shouldDirty: true, shouldValidate: true });
    setValue('password', 'admin', { shouldDirty: true, shouldValidate: true });
  }, [setValue]);

  function onSubmit({ email, password }) {
    jwtService
      .signInWithEmailAndPassword(email, password)
      .then((user) => {
        // Authentication successful - PIN verification will be handled by AuthProvider
      })
      .catch((_errors) => {
        _errors.forEach((error) => {
          setError(error.type, {
            type: 'manual',
            message: error.message,
          });
        });
      });
  }

  return (
    <div className="flex flex-col sm:flex-row items-center md:items-start sm:justify-center md:justify-start flex-1 min-w-0">
      <Paper className="h-full sm:h-auto md:flex md:items-center md:justify-end w-full sm:w-auto md:h-full md:w-1/2 py-8 px-16 sm:p-48 md:p-64 sm:rounded-2xl md:rounded-none sm:shadow md:shadow-none ltr:border-r-1 rtl:border-l-1">
        <div className="w-full max-w-320 sm:w-320 mx-auto sm:mx-0">
          <img className="w-48" src="assets/images/logo/logoMain.png" alt="logo" />

          <Typography className="mt-32 text-4xl font-extrabold tracking-tight leading-tight">
            Sign in
          </Typography>
          <div className="flex items-baseline mt-2 font-medium">
            <Typography>Don't have an account?</Typography>
            <Link className="ml-4" to="/sign-up">
              Sign up
            </Link>
          </div>

          <form
            name="loginForm"
            noValidate
            className="flex flex-col justify-center w-full mt-32"
            onSubmit={handleSubmit(onSubmit)}
            aria-label="Sign in form"
          >
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  className="mb-24"
                  label="Email"
                  autoFocus
                  type="email"
                  error={!!errors.email}
                  helperText={errors?.email?.message}
                  variant="outlined"
                  required
                  fullWidth
                  aria-label="Email address"
                  aria-required="true"
                  aria-invalid={!!errors.email}
                  aria-describedby={errors?.email ? 'email-error' : undefined}
                />
              )}
            />

            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  className="mb-24"
                  label="Password"
                  type="password"
                  error={!!errors.password}
                  helperText={errors?.password?.message}
                  variant="outlined"
                  required
                  fullWidth
                  aria-label="Password"
                  aria-required="true"
                  aria-invalid={!!errors.password}
                  aria-describedby={errors?.password ? 'password-error' : undefined}
                />
              )}
            />

            <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-between">
              <Controller
                name="remember"
                control={control}
                render={({ field }) => (
                  <FormControl>
                    <FormControlLabel
                      label="Remember me"
                      control={<Checkbox size="small" {...field} />}
                    />
                  </FormControl>
                )}
              />

              <Link className="text-md font-medium" to="/pages/auth/forgot-password">
                Forgot password?
              </Link>
            </div>

            <Button
              variant="contained"
              color="secondary"
              className=" w-full mt-16"
              aria-label="Sign in"
              disabled={_.isEmpty(dirtyFields) || !isValid}
              type="submit"
              size="large"
            >
              Sign in
            </Button>

            <div className="flex items-center mt-32">
              <div className="flex-auto mt-px border-t" />
              <Typography className="mx-8" color="text.secondary">
                Or continue with
              </Typography>
              <div className="flex-auto mt-px border-t" />
            </div>

            <div className="flex items-center mt-32 space-x-16">
              <Button variant="outlined" className="flex-auto">
                <FuseSvgIcon size={20} color="action">
                  feather:facebook
                </FuseSvgIcon>
              </Button>
              <Button variant="outlined" className="flex-auto">
                <FuseSvgIcon size={20} color="action">
                  feather:twitter
                </FuseSvgIcon>
              </Button>
              <Button variant="outlined" className="flex-auto">
                <FuseSvgIcon size={20} color="action">
                  feather:github
                </FuseSvgIcon>
              </Button>
            </div>
          </form>
        </div>
      </Paper>

      <Box
        className="relative hidden md:flex flex-auto items-center justify-center h-full p-64 lg:px-112 overflow-hidden"
        sx={{ backgroundColor: 'primary.main' }}
      >
        <svg
          className="absolute inset-0 pointer-events-none"
          viewBox="0 0 960 540"
          width="100%"
          height="100%"
          preserveAspectRatio="xMidYMax slice"
          xmlns="http://www.w3.org/2000/svg"
        >
          <Box
            component="g"
            sx={{ color: 'primary.light' }}
            className="opacity-20"
            fill="none"
            stroke="currentColor"
            strokeWidth="100"
          >
            <circle r="234" cx="196" cy="23" />
            <circle r="234" cx="790" cy="491" />
          </Box>
        </svg>
        <Box
          component="svg"
          className="absolute -top-64 -right-64 opacity-20"
          sx={{ color: 'primary.light' }}
          viewBox="0 0 220 192"
          width="220px"
          height="192px"
          fill="none"
        >
          <defs>
            <pattern
              id="837c3e70-6c3a-44e6-8854-cc48c737b659"
              x="0"
              y="0"
              width="20"
              height="20"
              patternUnits="userSpaceOnUse"
            >
              <rect x="0" y="0" width="4" height="4" fill="currentColor" />
            </pattern>
          </defs>
          <rect width="220" height="192" fill="url(#837c3e70-6c3a-44e6-8854-cc48c737b659)" />
        </Box>

        <div className="z-10 relative w-full max-w-2xl">
          <div className="text-7xl font-bold leading-none text-gray-100">
            <div>Welcome to</div>
            <div>our community</div>
          </div>
          <div className="mt-24 text-lg tracking-tight leading-6 text-gray-400">
          Revolutionize fleet management with our comprehensive platform, empowering businesses to optimize operations, streamline logistics, and maximize efficiency.
          </div>
          <div className="flex items-center mt-32">
            <AvatarGroup
              sx={{
                '& .MuiAvatar-root': {
                  borderColor: 'primary.main',
                },
              }}
            >
              <Avatar src="assets/images/avatars/female-18.jpg" />
              <Avatar src="assets/images/avatars/female-11.jpg" />
              <Avatar src="assets/images/avatars/male-09.jpg" />
              <Avatar src="assets/images/avatars/male-16.jpg" />
            </AvatarGroup>

            <div className="ml-16 font-medium tracking-tight text-gray-400">
              More than 17k people joined us, it's your turn
            </div>
          </div>
        </div>
      </Box>
    </div>
  );
}

export default SignInPage;
