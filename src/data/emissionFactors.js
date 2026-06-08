export const emissionFactors = {
  transport: {
    car_petrol: 0.21,        // per km
    car_diesel: 0.17,        // per km
    bus: 0.089,              // per km
    train: 0.041,            // per km
    flight_domestic: 0.255,  // per km
    bike: 0,
    walk: 0
  },
  food: {
    beef_meal: 6.0,          // per meal
    chicken_meal: 1.5,
    fish_meal: 1.3,
    veg_meal: 0.5,
    vegan_meal: 0.3
  },
  energy: {
    electricity: 0.82,       // per kWh (India grid avg)
    ac_hour: 1.0,            // per hour
    heating_hour: 0.8
  },
  shopping: {
    new_clothing: 10.0,      // per item
    electronics: 70.0,       // per item
    secondhand: 0.5
  }
};
