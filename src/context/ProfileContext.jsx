import { createContext, useContext } from 'react';

export const ProfileContext = createContext();

export const useUserProfile = () => useContext(ProfileContext);
