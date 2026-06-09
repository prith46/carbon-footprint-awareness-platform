import { describe, it, expect } from 'vitest';
import { calculateEmissions } from '../utils/calculateEmissions';

describe('calculateEmissions', () => {
  it('returns 0 for empty logs array', () => {
    const { total, breakdown } = calculateEmissions([]);
    expect(total).toBe(0);
    expect(breakdown).toEqual({ transport: 0, food: 0, energy: 0, shopping: 0 });
  });

  it('correctly calculates kg CO₂ for a single car_petrol entry', () => {
    // 10 km * 0.21 = 2.1
    const { total, breakdown } = calculateEmissions([
      { category: 'transport', type: 'car_petrol', quantity: 10 }
    ]);
    expect(total).toBe(2.1);
    expect(breakdown.transport).toBe(2.1);
  });

  it('correctly sums multiple entries across categories', () => {
    const logs = [
      { category: 'transport', type: 'car_petrol', quantity: 10 }, // 2.1
      { category: 'food', type: 'beef_meal', quantity: 2 }, // 2 * 6.0 = 12.0
      { category: 'energy', type: 'electricity', quantity: 10 } // 10 * 0.82 = 8.2
    ];
    const { total, breakdown } = calculateEmissions(logs);
    // 2.1 + 12.0 + 8.2 = 22.3
    expect(total).toBeCloseTo(22.3);
    expect(breakdown.transport).toBeCloseTo(2.1);
    expect(breakdown.food).toBeCloseTo(12.0);
    expect(breakdown.energy).toBeCloseTo(8.2);
    expect(breakdown.shopping).toBe(0);
  });

  it('returns 0 for unknown category', () => {
    const { total, breakdown } = calculateEmissions([
      { category: 'unknown', type: 'something', quantity: 10 }
    ]);
    expect(total).toBe(0);
    // Breakdown remains unmodified
    expect(breakdown.unknown).toBeUndefined();
  });

  it('returns 0 for unknown type within valid category', () => {
    const { total, breakdown } = calculateEmissions([
      { category: 'transport', type: 'unknown_type', quantity: 10 }
    ]);
    expect(total).toBe(0);
    expect(breakdown.transport).toBe(0);
  });

  it('handles negative quantity gracefully (returns negative)', () => {
    const { total } = calculateEmissions([
      { category: 'transport', type: 'car_petrol', quantity: -10 }
    ]);
    // The calculation assumes valid inputs from context, but mathematically returns negatives
    expect(total).toBe(-2.1);
  });

  it('breakdown object contains correct category keys', () => {
    const { breakdown } = calculateEmissions([]);
    expect(Object.keys(breakdown)).toEqual(['transport', 'food', 'energy', 'shopping']);
  });
});
