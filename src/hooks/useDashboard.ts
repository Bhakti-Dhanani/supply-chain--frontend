import { useState, useEffect } from 'react';

export const useDashboard = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    // Fetch dashboard data here
    const fetchData = async () => {
      try {
        const response = await fetch('/api/dashboard');
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
      }
    };

    fetchData();
  }, []);

  return { data };
};
