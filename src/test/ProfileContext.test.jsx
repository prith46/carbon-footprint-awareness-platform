import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { ProfileProvider, useUserProfile } from '../context/ProfileContext';

const renderWithContext = () => renderHook(() => useUserProfile(), { wrapper: ProfileProvider });

describe('ProfileContext', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('default profile has onboarded: false', () => {
    const { result } = renderWithContext();
    expect(result.current.profile.onboarded).toBe(false);
  });

  it('default location is "Bangalore"', () => {
    const { result } = renderWithContext();
    expect(result.current.profile.location).toBe("Bangalore");
  });

  it('setProfile updates name correctly', () => {
    const { result } = renderWithContext();
    act(() => {
      result.current.setProfile({ name: 'Alex' });
    });
    expect(result.current.profile.name).toBe('Alex');
  });

  it('setProfile clamps name to 50 characters', () => {
    const { result } = renderWithContext();
    const longName = 'A'.repeat(60);
    act(() => {
      result.current.setProfile({ name: longName });
    });
    expect(result.current.profile.name.length).toBe(50);
    expect(result.current.profile.name).toBe('A'.repeat(50));
  });

  it('setProfile ignores unknown keys', () => {
    const { result } = renderWithContext();
    act(() => {
      result.current.setProfile({ name: 'Alex', maliciousKey: 'hacked' });
    });
    expect(result.current.profile.maliciousKey).toBeUndefined();
    expect(result.current.profile.name).toBe('Alex');
  });

  it('setProfile persists to localStorage', () => {
    const { result } = renderWithContext();
    act(() => {
      result.current.setProfile({ name: 'Alex', onboarded: true });
    });

    const stored = JSON.parse(localStorage.getItem('carbon_profile'));
    expect(stored.name).toBe('Alex');
    expect(stored.onboarded).toBe(true);
  });
});
