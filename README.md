# CarbonTrace - Carbon Footprint Awareness Platform

## Vertical
Carbon Footprint Awareness Platform

## Approach and Logic
CarbonTrace is a client-side application designed to help users track and reduce their personal carbon emissions. 
- **Emission Calculation**: We use an extensible `emissionFactors.js` database containing real-world CO₂ equivalent values for various activities (e.g., transport, food, energy usage, and shopping). The platform maps each logged activity against this data to compute a standardized kg CO₂ output.
- **Insights Engine**: The platform generates personalized tips by identifying the user's top two highest-emission categories. It references a local database of actionable tips categorized by difficulty and estimated savings.
- **Data Persistence**: All activity logs and user profile data are saved locally in the browser using the `localStorage` API, ensuring data privacy and persistence without requiring a backend database.

## How it works
1. **Onboarding**: New users are greeted with a beautifully designed onboarding flow to set their name, lifestyle, and location. This data customizes their experience.
2. **Dashboard**: The central hub where users get a bird's-eye view of their monthly progress. It features key metrics (Total CO₂, Highest Impact category) and a visual category breakdown chart using Recharts.
3. **Logging**: Users can add daily activities via dynamic dropdowns that automatically adapt based on the selected category, calculating the kg CO₂ equivalent in real-time.
4. **Insights**: The platform analyzes the user's highest emitting categories and surfaces color-coded, actionable reduction tips.
5. **Progress**: Users can track their emission trends over time with a 7-day trailing line chart, a 30-day category distribution bar chart, and a paginated historical log table.

## Assumptions made
- **India grid electricity factor**: The electricity emission factor is assumed to be `0.82` kg CO₂ per kWh, reflecting the average Indian grid mix.
- **Average baseline**: The platform compares the user's emissions to an average Indian baseline of 1.5 kg CO₂ per day.
- **No backend needed**: As a privacy-first, client-centric application, we assume `localStorage` provides sufficient durability for personal tracking.

## Tech stack
- **Core**: React 18
- **Build Tool**: Vite
- **Routing**: React Router v6
- **Styling**: TailwindCSS v4
- **Icons**: Lucide React
- **Data Visualization**: Recharts
- **State/Storage**: Custom React Hooks interfacing with the Web Storage API

## How to run locally

1. **Clone the repository**:
   ```bash
   git clone <repo-url>
   cd carbon-footprint-awareness-platform
   ```
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Start the development server**:
   ```bash
   npm run dev
   ```
4. **View the application**: Open your browser and navigate to the local URL provided by Vite (typically `http://localhost:5173`).
