# 🌱 CarbonTrace — Carbon Footprint Awareness Platform

> Track, understand, and reduce your personal carbon footprint — one activity at a time.

🔗 **Live Demo**: https://prith46.github.io/carbon-footprint-awareness-platform/

---

## Vertical

Carbon Footprint Awareness Platform — helping individuals **understand, track, and reduce** their carbon emissions through simple actions and personalized insights.

---

## Approach and Logic

CarbonTrace is a fully client-side application designed around three core pillars:

- **Understand**: A dedicated Learn page explains what a carbon footprint is, why it matters, and how different lifestyle categories contribute to emissions — with real India-specific statistics and a visual category breakdown.

- **Track**: Users log daily activities across four categories (Transport, Food, Energy, Shopping). Each entry is mapped against a real-world `emissionFactors.js` database to compute a standardized kg CO₂ value. All data is persisted locally via `localStorage`.

- **Reduce**: The Insights engine analyzes the user's top two highest-emission categories over the last 30 days and surfaces actionable, difficulty-rated reduction tips. The Dashboard also provides daily Quick Actions — a gamified checklist of small, impactful changes.

---

## How It Works

1. **Onboarding**: New users complete a 3-field setup (name, lifestyle, location). Unauthenticated users are redirected away from all protected routes until onboarding is complete.

2. **Learn**: A static awareness page covering what carbon footprints are, global vs. Indian averages, the Paris Agreement target, category-by-category breakdowns, and beginner-friendly starter actions — with a donut chart showing typical emission splits.

3. **Dashboard**: The central hub showing monthly CO₂ total, highest impact category, activities logged, and savings vs. the average Indian baseline. Includes a bar chart of monthly emissions by category, a recent activity feed, and daily Quick Actions tailored to the user's highest emission category.

4. **Log Activity**: A dynamic form with category-aware dropdowns and quantity labels. Input is validated on both the frontend (HTML constraints) and in the context layer (whitelist validation against `emissionFactors.js`). CO₂ is calculated automatically on submission.

5. **Insights**: Analyzes the user's last 30 days of activity, identifies the top 2 emission categories, and surfaces color-coded tips with estimated savings and difficulty ratings (easy/medium/hard).

6. **Progress**: A 7-day trailing line chart, a 30-day category bar chart, weekly summary stats, and a fully paginated historical log table with delete functionality.

7. **404 Page**: Invalid routes are caught and redirected gracefully.

---

## Assumptions Made

- **India grid electricity factor**: Electricity emission factor is `0.82` kg CO₂ per kWh, reflecting the average Indian grid mix.
- **Average Indian baseline**: User emissions are compared against `1.5` kg CO₂ per day as the average Indian daily footprint.
- **No backend required**: `localStorage` provides sufficient persistence for a personal, privacy-first tracking tool. No user data leaves the browser.
- **Static insights**: Reduction tips are curated and hardcoded. Personalization is achieved by filtering tips to the user's top 2 emission categories from the last 30 days — not AI-generated.
- **Location scope**: City options are limited to major Indian metros (Bangalore, Chennai, Mumbai, Delhi, Hyderabad) with an "Other" fallback.
- **Date range**: Activity logging is bounded between `2020-01-01` and today to prevent absurd historical entries.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Core | React 18 |
| Build Tool | Vite |
| Routing | React Router v6 |
| Styling | TailwindCSS v4 |
| Icons | Lucide React |
| Data Visualization | Recharts |
| State Management | React Context API with `useMemo` and `useCallback` |
| Persistence | Web Storage API (`localStorage`) |
| Testing | Vitest + React Testing Library |

---

## Project Structure

```
src/
  components/       # Reusable UI components (StatCard, LogTable, ChartTooltip, etc.)
  context/          # React Context providers (ActivityContext, ProfileContext)
  data/             # Canonical data (emissionFactors, labels, constants, quickActions)
  pages/            # Route-level page components
  utils/            # Pure functions (calculateEmissions, getInsights)
  test/             # Unit tests
```

---

## How to Run Locally

1. Clone the repository:
```bash
git clone https://github.com/prith46/carbon-footprint-awareness-platform.git
cd carbon-footprint-awareness-platform
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser at `http://localhost:5173`

---

## Running Tests

```bash
npm test
```

28 unit tests covering:
- Emission calculation engine
- Insights generation logic
- ActivityContext (add, delete, validate, clear)
- ProfileContext (strict merge, name clamping, persistence)

---

## Evaluation Criteria Coverage

| Criteria | Implementation |
|---|---|
| Code Quality | Decomposed components, single source of truth, zero dead code, extracted constants |
| Security | localStorage shape validation, input whitelisting, bounds enforcement, no `dangerouslySetInnerHTML` |
| Efficiency | Context values memoized, calculations cached with `useMemo`, Recharts tooltip references optimized |
| Testing | 28 Vitest unit tests covering all core logic and context behavior |
| Accessibility | WCAG AA contrast, `aria-live` regions, skip-to-content link, `scope="col"` on tables, mobile nav |
