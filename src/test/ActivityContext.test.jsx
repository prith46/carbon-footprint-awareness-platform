import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { ActivityProvider } from '../context/ActivityProvider';
import { useActivityLog } from '../context/ActivityContext';

const renderWithContext = () => renderHook(() => useActivityLog(), { wrapper: ActivityProvider });

describe('ActivityContext', () => {
  beforeEach(() => {
    localStorage.clear();
    // Mock date to ensure consistent fallback
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-01-01T10:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('initial logs are empty', () => {
    const { result } = renderWithContext();
    expect(result.current.logs).toEqual([]);
    expect(result.current.totalCO2).toBe(0);
  });

  it('addLog adds a valid entry with correct fields', () => {
    const { result } = renderWithContext();
    act(() => {
      result.current.addLog({
        category: 'transport',
        type: 'car_petrol',
        quantity: 10,
        date: '2024-01-01'
      });
    });

    expect(result.current.logs.length).toBe(1);
    const log = result.current.logs[0];
    expect(log.category).toBe('transport');
    expect(log.type).toBe('car_petrol');
    expect(log.quantity).toBe(10);
    expect(log.date).toBe('2024-01-01');
    expect(log).toHaveProperty('id');
    expect(log.kgCO2).toBe(2.1); // 10 * 0.21
  });

  it('addLog rejects an entry with an unknown category', () => {
    const { result } = renderWithContext();
    act(() => {
      result.current.addLog({
        category: 'invalid_cat',
        type: 'car_petrol',
        quantity: 10,
        date: '2024-01-01'
      });
    });
    expect(result.current.logs.length).toBe(0);
  });

  it('addLog rejects an entry with quantity of 0 or negative', () => {
    const { result } = renderWithContext();
    act(() => {
      result.current.addLog({ category: 'transport', type: 'car_petrol', quantity: 0, date: '2024-01-01' });
      result.current.addLog({ category: 'transport', type: 'car_petrol', quantity: -5, date: '2024-01-01' });
    });
    expect(result.current.logs.length).toBe(0);
  });

  it('addLog rejects invalid type', () => {
    const { result } = renderWithContext();
    act(() => {
      result.current.addLog({
        category: 'transport',
        type: 'invalid_type',
        quantity: 10,
        date: '2024-01-01'
      });
    });
    expect(result.current.logs.length).toBe(0);
  });

  it('addLog uses today\'s date when an invalid date format is passed', () => {
    const { result } = renderWithContext();
    act(() => {
      result.current.addLog({
        category: 'transport',
        type: 'car_petrol',
        quantity: 10,
        date: 'invalid-date'
      });
    });
    
    expect(result.current.logs.length).toBe(1);
    expect(result.current.logs[0].date).toBe('2024-01-01'); // fallback to mocked today
  });

  it('deleteLog removes the correct entry by id', () => {
    const { result } = renderWithContext();
    act(() => {
      result.current.addLog({ category: 'transport', type: 'car_petrol', quantity: 10, date: '2024-01-01' });
      result.current.addLog({ category: 'food', type: 'beef_meal', quantity: 1, date: '2024-01-01' });
    });

    expect(result.current.logs.length).toBe(2);
    const idToDelete = result.current.logs[0].id;

    act(() => {
      result.current.deleteLog(idToDelete);
    });

    expect(result.current.logs.length).toBe(1);
    expect(result.current.logs[0].id).not.toBe(idToDelete);
  });

  it('clearLogs empties the logs array', () => {
    const { result } = renderWithContext();
    act(() => {
      result.current.addLog({ category: 'transport', type: 'car_petrol', quantity: 10, date: '2024-01-01' });
    });

    expect(result.current.logs.length).toBe(1);

    act(() => {
      result.current.clearLogs();
    });

    expect(result.current.logs.length).toBe(0);
  });

  it('totalCO2 updates after adding a log', () => {
    const { result } = renderWithContext();
    expect(result.current.totalCO2).toBe(0);

    act(() => {
      result.current.addLog({ category: 'transport', type: 'car_petrol', quantity: 10, date: '2024-01-01' });
    });

    expect(result.current.totalCO2).toBe(2.1);
  });

  it('localStorage is updated after addLog', () => {
    const { result } = renderWithContext();
    
    act(() => {
      result.current.addLog({ category: 'transport', type: 'car_petrol', quantity: 10, date: '2024-01-01' });
    });

    const stored = JSON.parse(localStorage.getItem('carbon_logs'));
    expect(stored).toBeDefined();
    expect(stored.length).toBe(1);
    expect(stored[0].category).toBe('transport');
  });
});
