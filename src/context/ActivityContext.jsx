import { createContext, useContext } from 'react';

export const ActivityContext = createContext();

export const useActivityLog = () => useContext(ActivityContext);
