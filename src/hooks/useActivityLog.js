import { useState, useEffect, useMemo } from 'react';
import { calculateEmissions } from '../utils/calculateEmissions';

export const useActivityLog = () => {
  const [logs, setLogs] = useState(() => {
    try {
      const saved = localStorage.getItem('carbon_logs');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error("Failed to parse logs from localStorage", error);
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('carbon_logs', JSON.stringify(logs));
  }, [logs]);

  const addLog = (entry) => {
    const { total: kgCO2 } = calculateEmissions([entry]);
    
    const newLog = {
      ...entry,
      id: Date.now(),
      kgCO2,
      date: entry.date || new Date().toISOString()
    };
    
    setLogs(prevLogs => [newLog, ...prevLogs]);
  };

  const deleteLog = (id) => {
    setLogs(prevLogs => prevLogs.filter(log => log.id !== id));
  };

  const clearLogs = () => {
    setLogs([]);
  };

  const { total: totalCO2, breakdown } = useMemo(() => {
    return calculateEmissions(logs);
  }, [logs]);

  return {
    logs,
    addLog,
    deleteLog,
    clearLogs,
    totalCO2,
    breakdown
  };
};
