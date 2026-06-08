import { useState, useEffect } from 'react';

const DEFAULT_PROFILE = {
  name: "",
  location: "India",
  lifestyle: "urban",
  onboarded: false
};

export const useUserProfile = () => {
  const [profile, setProfileState] = useState(() => {
    try {
      const saved = localStorage.getItem('carbon_profile');
      if (saved) {
        // Merge saved profile with default profile to ensure all fields exist
        return { ...DEFAULT_PROFILE, ...JSON.parse(saved) };
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

  const setProfile = (data) => {
    setProfileState(prev => ({ ...prev, ...data }));
  };

  return {
    profile,
    setProfile
  };
};
