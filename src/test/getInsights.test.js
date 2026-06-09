import { describe, it, expect } from 'vitest';
import { getInsights } from '../utils/getInsights';

describe('getInsights', () => {
  it('returns fallback tip when breakdown is empty or zero', () => {
    const tips = getInsights({ transport: 0, food: 0, energy: 0, shopping: 0 });
    expect(tips).toEqual([]);
  });

  it('returns tips for the highest emission category', () => {
    const breakdown = { transport: 100, food: 0, energy: 0, shopping: 0 };
    const tips = getInsights(breakdown);
    // Transport has 2 tips in DB
    expect(tips.length).toBe(2);
    expect(tips[0].category).toBe('transport');
  });

  it('returns tips for top 2 categories when multiple categories have emissions', () => {
    const breakdown = { transport: 100, food: 80, energy: 20, shopping: 0 };
    const tips = getInsights(breakdown);
    // Should get tips for transport and food (top 2). Transport (2 tips) + Food (2 tips) = 4 tips
    expect(tips.length).toBe(4);
    
    const categories = tips.map(t => t.category);
    expect(categories).toContain('transport');
    expect(categories).toContain('food');
    expect(categories).not.toContain('energy');
  });

  it('each tip object has category, tip, estimatedSaving, difficulty fields', () => {
    const breakdown = { transport: 100 };
    const tips = getInsights(breakdown);
    
    tips.forEach(tipObj => {
      expect(tipObj).toHaveProperty('category');
      expect(tipObj).toHaveProperty('tip');
      expect(tipObj).toHaveProperty('estimatedSaving');
      expect(tipObj).toHaveProperty('difficulty');
    });
  });

  it('difficulty is one of easy, medium, hard', () => {
    const breakdown = { transport: 100, food: 50, energy: 20, shopping: 10 };
    // Get all tips by making them all top artificially in separate calls, or just test the DB implicitly
    const allCategories = ['transport', 'food', 'energy', 'shopping'];
    
    allCategories.forEach(cat => {
      const tips = getInsights({ [cat]: 100 });
      tips.forEach(tipObj => {
        expect(['easy', 'medium', 'hard']).toContain(tipObj.difficulty);
      });
    });
  });

  it('does not return tips for categories with 0 emissions', () => {
    const breakdown = { transport: 0, food: 0, energy: 0, shopping: 0 };
    const tips = getInsights(breakdown);
    expect(tips.length).toBe(0);
  });
});
