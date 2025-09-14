import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const useRefresh = (callback) => {
  const location = useLocation();
  
  useEffect(() => {
    if (callback) {
      callback();
    }
  }, [location.pathname, callback]);
};

export const useAutoRefresh = (callback, interval = 30000) => {
  useEffect(() => {
    if (callback) {
      callback();
      const intervalId = setInterval(callback, interval);
      return () => clearInterval(intervalId);
    }
  }, [callback, interval]);
};