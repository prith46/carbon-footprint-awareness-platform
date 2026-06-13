import { useState, useEffect, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { ProfileContext } from './ProfileContext';

const DEFAULT_PROFILE = {
  name: "",
  location: "Bangalore",
  lifestyle: "urban",
  onboarded: false
};

const VALID_LOCATIONS = ['Bangalore', 'Chennai', 'Mumbai', 'Delhi', 'Hyderabad', 'Pune', 'Other'];
const VALID_LIFESTYLES = ['urban', 'suburban', 'rural'];

export const ProfileProvider = ({ children }) => {
  const [profile, setProfileState] = useState(() => {
    try {
      const saved = localStorage.getItem('carbon_profile');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
          return {
            name: String(parsed.name ?? DEFAULT_PROFILE.name).slice(0, 50),
            location: VALID_LOCATIONS.includes(parsed.location) ? parsed.location : DEFAULT_PROFILE.location,
            lifestyle: VALID_LIFESTYLES.includes(parsed.lifestyle) ? parsed.lifestyle : DEFAULT_PROFILE.lifestyle,
            onboarded: parsed.onboarded ?? DEFAULT_PROFILE.onboarded
          };
        }
      }
      return DEFAULT_PROFILE;
    } catch {
      return DEFAULT_PROFILE;
    }
  });

  useEffect(() => {
    localStorage.setItem('carbon_profile', JSON.stringify(profile));
  }, [profile]);

  const setProfile = useCallback((data) => {
    setProfileState(prev => ({ 
      ...prev, 
      ...(data.name !== undefined && { name: String(data.name).slice(0, 50) }),
      ...(data.location !== undefined && { 
        location: VALID_LOCATIONS.includes(data.location) ? data.location : prev.location 
      }),
      ...(data.lifestyle !== undefined && { 
        lifestyle: VALID_LIFESTYLES.includes(data.lifestyle) ? data.lifestyle : prev.lifestyle 
      }),
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

ProfileProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
