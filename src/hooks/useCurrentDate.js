import { useState, useEffect } from 'react';

const useCurrentDate = () => {
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setDate(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  return date;
};

export default useCurrentDate;
