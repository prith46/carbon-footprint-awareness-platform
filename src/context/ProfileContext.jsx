import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';

const ProfileContext = createContext();

const DEFAULT_PROFILE = {
  name: "",
  location: "Bangalore",
  lifestyle: "urban",
  onboarded: false
};

export const ProfileProvider = ({ children }) => {
  const [profile, setProfileState] = useState(() => {
    try {
      const saved = localStorage.getItem('carbon_profile');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
          return {
            name: (parsed.name ?? DEFAULT_PROFILE.name).slice(0, 50),
            location: parsed.location ?? DEFAULT_PROFILE.location,
            lifestyle: parsed.lifestyle ?? DEFAULT_PROFILE.lifestyle,
            onboarded: parsed.onboarded ?? DEFAULT_PROFILE.onboarded
          };
        }
      }
      return DEFAULT_PROFILE;
    } catch (error) {
      console.error("Failed to parse profile from localStorage", error);
      return DEFAULT_PROFILE;
    }
  });

  useEffect(() => {
    localStorage.setItem('carbon_profile', JSON.stringify(profile));
  }, [profile]);

  const setProfile = useCallback((data) => {
    setProfileState(prev => ({ 
      ...prev, 
      ...(data.name !== undefined && { name: data.name }),
      ...(data.location !== undefined && { location: data.location }),
      ...(data.lifestyle !== undefined && { lifestyle: data.lifestyle }),
      ...(data.onboarded !== undefined && { onboarded: data.onboarded })
    }));
  }, []);

  const providerValue = useMemo(() => ({
    profile,
    setProfile
  }), [profile, setProfile]);

  return (
    <ProfileContext.Provider value={providerValue}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useUserProfile = () => useContext(ProfileContext);
