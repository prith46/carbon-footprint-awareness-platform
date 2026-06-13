/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { calculateEmissions } from '../utils/calculateEmissions';
import { emissionFactors } from '../data/emissionFactors';
import useCurrentDate from '../hooks/useCurrentDate';

const ActivityContext = createContext();

export const ActivityProvider = ({ children }) => {
  const currentDate = useCurrentDate();
  const [logs, setLogs] = useState(() => {
    try {
      const saved = localStorage.getItem('carbon_logs');
      if (!saved) return [];
      
      const parsed = JSON.parse(saved);
      if (!Array.isArray(parsed)) return [];

      return parsed.filter(log => 
        log && typeof log === 'object' &&
        'id' in log && 'category' in log && 'type' in log && 
        'quantity' in log && 'date' in log && 'kgCO2' in log
      ).map(log => ({
        ...log,
        kgCO2: Number.isFinite(log.kgCO2) ? log.kgCO2 : 0
      }));
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('carbon_logs', JSON.stringify(logs));
  }, [logs]);

  const addLog = useCallback((entry) => {
    if (!entry || !entry.category || !entry.type) return;
    
    // Validate category and type exist in emissionFactors
    if (!emissionFactors[entry.category] || emissionFactors[entry.category][entry.type] === undefined) {
      return;
    }

    if (!Number.isFinite(entry.quantity) || entry.quantity <= 0) return;

    const { total: kgCO2 } = calculateEmissions([entry]);
    
    // Validate date format YYYY-MM-DD
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    const validDate = entry.date && dateRegex.test(entry.date) 
      ? entry.date 
      : new Date().toISOString().split('T')[0];
    
    const newLog = {
      ...entry,
      id: crypto.randomUUID(),
      kgCO2,
      date: validDate
    };
    
    setLogs(prevLogs => [newLog, ...prevLogs]);
  }, []);

  const deleteLog = useCallback((id) => {
    setLogs(prevLogs => prevLogs.filter(log => log.id !== id));
  }, []);

  const clearLogs = useCallback(() => {
    setLogs([]);
  }, []);

  const { total: totalCO2, breakdown } = useMemo(() => {
    return calculateEmissions(logs);
  }, [logs]);

  const recentBreakdown = useMemo(() => {
    const today = new Date(currentDate);
    today.setHours(0, 0, 0, 0);
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentLogs = logs.filter(log => {
      const logDate = new Date(log.date);
      logDate.setHours(0, 0, 0, 0);
      return logDate >= thirtyDaysAgo && logDate <= today;
    });

    return calculateEmissions(recentLogs).breakdown;
  }, [logs, currentDate]);

  const providerValue = useMemo(() => ({
    logs,
    addLog,
    deleteLog,
    clearLogs,
    totalCO2,
    breakdown,
    recentBreakdown
  }), [logs, addLog, deleteLog, clearLogs, totalCO2, breakdown, recentBreakdown]);

  return (
    <ActivityContext.Provider value={providerValue}>
      {children}
    </ActivityContext.Provider>
  );
};

ActivityProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useActivityLog = () => useContext(ActivityContext);
