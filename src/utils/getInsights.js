export const getInsights = (breakdown) => {
  const tipsDB = {
    transport: [
      { category: 'transport', tip: 'Try carpooling or taking public transit twice a week.', estimatedSaving: '15-30 kg CO₂', difficulty: 'medium' },
      { category: 'transport', tip: 'Switch to biking or walking for short trips under 3km.', estimatedSaving: '5-10 kg CO₂', difficulty: 'easy' }
    ],
    food: [
      { category: 'food', tip: 'Swap one beef meal for a plant-based option.', estimatedSaving: '5.5 kg CO₂', difficulty: 'easy' },
      { category: 'food', tip: 'Plan your meals carefully to reduce food waste.', estimatedSaving: '10-20 kg CO₂', difficulty: 'medium' }
    ],
    energy: [
      { category: 'energy', tip: 'Raise your AC temperature by 2 degrees.', estimatedSaving: '15-20 kg CO₂', difficulty: 'easy' },
      { category: 'energy', tip: 'Switch to LED bulbs and unplug idle electronics.', estimatedSaving: '5-15 kg CO₂', difficulty: 'easy' }
    ],
    shopping: [
      { category: 'shopping', tip: 'Buy second-hand clothes instead of new items.', estimatedSaving: '9.5 kg CO₂', difficulty: 'medium' },
      { category: 'shopping', tip: 'Repair older electronics instead of replacing them.', estimatedSaving: '70+ kg CO₂', difficulty: 'hard' }
    ]
  };

  const sortedCategories = Object.entries(breakdown || {})
    .sort((a, b) => b[1] - a[1])
    .filter(([_, emissions]) => emissions > 0)
    .map(([category]) => category);

  const topCategories = sortedCategories.slice(0, 2);

  let insights = [];
  topCategories.forEach(category => {
    if (tipsDB[category]) {
      insights = [...insights, ...tipsDB[category]];
    }
  });

  return insights;
};
