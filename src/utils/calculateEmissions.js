import { emissionFactors } from '../data/emissionFactors';

export const calculateEmissions = (logs) => {
  let total = 0;
  const breakdown = {
    transport: 0,
    food: 0,
    energy: 0,
    shopping: 0
  };

  logs.forEach((log) => {
    const { category, type, quantity } = log;
    
    if (emissionFactors[category] && emissionFactors[category][type] !== undefined) {
      const factor = emissionFactors[category][type];
      const emissions = factor * quantity;
      
      total += emissions;
      if (breakdown[category] !== undefined) {
        breakdown[category] += emissions;
      }
    }
  });

  return { total, breakdown };
};
