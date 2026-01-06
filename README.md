# Performance Lab 🧪

> **Biometric Intelligence System v2.0** - Advanced performance tracking with predictive analytics

A sophisticated React-based application for tracking and analyzing personal performance metrics across multiple domains: learning, screen time, nutrition, training, and sleep.

---

## ✨ Features

### Core Tracking
- 📚 **Learning Tracker** - Active vs passive learning with 1.5x multiplier
- 📱 **Screen Time Monitor** - Quadratic penalties for social/entertainment
- 🥗 **Nutrition Analytics** - Fat quality index, amino acid completeness, macro tracking
- 💪 **Training Logger** - Volume load with fatigue curve analysis
- 😴 **Sleep Tracker** - Duration + quality scoring with nap compensation

### Advanced Analytics
- 📊 **Correlation Matrix** - Discover relationships between metrics
- 🔮 **Predictive Forecasting** - 7-day trend predictions using linear regression
- 🎯 **Daily Coach** - AI-powered recommendations based on current state
- 📈 **Heatmap Calendar** - Visual history of performance
- 🏆 **Achievement System** - Badges and streak tracking

### Intelligent Scoring
- **Geometric Mean System Score** - Weighted aggregate across all modules
- **Bayesian Imputation** - Smart handling of missing data
- **Z-Score Normalization** - Personalized baselines from 14-day history
- **Adaptive Targets** - Dynamic goal adjustment based on performance

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Modern web browser (Chrome, Firefox, Edge, Safari)

### Installation

1. **Clone or navigate to the project directory**
   ```bash
   cd performance-lab
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Fix PowerShell Execution Policy (Windows only)**
   
   If you encounter script execution errors, run ONE of these:
   
   **Option A - Temporary (current session):**
   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process
   ```
   
   **Option B - Permanent (recommended):**
   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```
   
   **Option C - Use CMD instead:**
   ```cmd
   cmd /c npm install
   cmd /c npm run dev
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   ```
   http://localhost:5173
   ```

---

## 📁 Project Structure

```
performance-lab/
├── src/
│   ├── components/          # React components
│   │   ├── UserProfile.jsx
│   │   ├── NutritionTracker.jsx
│   │   ├── ScoreDashboard.jsx
│   │   └── ...
│   ├── hooks/              # Custom React hooks
│   │   ├── useSystemScore.js
│   │   └── useKeyboardShortcuts.js
│   ├── utils/              # Utility functions
│   │   ├── Biostatistics.js
│   │   ├── StatAnalysis.js
│   │   ├── PredictiveAnalytics.js
│   │   └── ...
│   ├── App.jsx             # Main application
│   └── index.css           # Global styles
├── package.json
└── vite.config.js
```

---

## 🎯 Usage Guide

### 1. Setup Your Profile
Navigate to the **Profile** section and enter:
- Name, age, gender
- Weight (kg) and height (cm)
- Body measurements (optional)

Your BMR and calorie targets will be calculated automatically.

### 2. Track Daily Metrics

**Learning:**
- Log active learning (reading, courses, practice)
- Log passive learning (videos, podcasts)
- Active learning gets 1.5x multiplier

**Screen Time:**
- Track social media, entertainment, and productive screen time
- Social/entertainment have quadratic penalties

**Nutrition:**
- Build ingredient database with macros and micronutrients
- Log meals by type (breakfast, lunch, dinner, junk)
- Track hydration
- View fat quality index and amino acid completeness

**Training:**
- Log exercises with sets, reps, and weight
- Automatic volume load calculation
- Fatigue penalty for overtraining

**Sleep:**
- Enter sleep duration and quality (1-10)
- Optional nap tracking for recovery bonus

### 3. View Analytics
- **Dashboard** - Real-time scores and system performance
- **Radar Chart** - Visual comparison across all metrics
- **Heatmap** - 30-day performance history
- **Correlations** - Discover which metrics influence each other
- **Predictions** - 7-day forecasts with confidence intervals
- **Daily Coach** - Personalized recommendations

---

## 🧮 Scoring Algorithm

### System Score
Calculated using **weighted geometric mean**:
```
System = (L^1.2 × S^1.1 × N^1.0 × T^1.0 × Sl^1.2)^(1/5.5)
```
Where: L=Learning, S=Screen, N=Nutrition, T=Training, Sl=Sleep

**Why geometric mean?**
- Penalizes weak links (one low score drastically reduces overall)
- Encourages balanced improvement across all domains
- More realistic than arithmetic mean

### Individual Scores

**Learning (0-100):**
```
ELL = (active × 1.5) + passive
Z-score = (ELL - baseline_mean) / baseline_stddev
Score = logistic(Z-score) × 100
```

**Screen Time (0-100):**
```
Penalty = (0.015 × social^1.8) + (0.02 × entertainment^1.8)
Score = 100 - penalty + (productive × 0.1)
```

**Nutrition (0-100):**
```
Base = macro_distance_score
+ Fat Quality Index (15% weight)
+ Amino Acid Completeness (10% weight)
- Junk Penalty (exponential)
× Hydration Multiplier (0.9 - 1.05)
```

**Training (0-100):**
```
Score = (volume / 10000) × 100
If volume > 15000: Score × fatigue_penalty
```

**Sleep (0-100):**
```
Duration = 100 - ((8 - hours) × 15)
Quality = (quality_rating / 10) × 100
Nap Bonus = min(20, (nap_mins / 60) × 15)
Score = (Duration × 0.7) + (Quality × 0.3) + Nap Bonus
```

---

## 🔧 Configuration

### Tuning Constants
All scoring constants are defined in [`useSystemScore.js`](src/hooks/useSystemScore.js):

```javascript
// Screen time penalties
const SOCIAL_PENALTY_COEFFICIENT = 0.015;
const ENTERTAINMENT_PENALTY_COEFFICIENT = 0.02;

// Nutrition targets
const PROTEIN_PER_KG = 2.2;
const FAT_CALORIES_PERCENTAGE = 0.25;

// Training thresholds
const OPTIMAL_TRAINING_VOLUME = 10000;
const OVERTRAINING_THRESHOLD = 15000;

// Sleep parameters
const OPTIMAL_SLEEP_HOURS = 8;
const SLEEP_DEFICIT_PENALTY = 15;
```

Adjust these to match your personal goals and physiology.

---

## 💾 Data Storage

All data is stored **locally** in your browser's localStorage:
- `pl_profile` - User profile
- `pl_nutrition_db` - Ingredient database
- `pl_nutrition_log_YYYY-MM-DD` - Daily nutrition logs
- `pl_score_history` - 30-day rolling history
- `pl_*` - Other daily metrics

**Privacy:** No data is sent to external servers. Everything stays on your device.

**Backup:** Use the Data Management section to export/import your data as JSON.

---

## 🛠️ Development

### Build for Production
```bash
npm run build
```

### Lint Code
```bash
npm run lint
```

### Tech Stack
- **React 18** - UI framework
- **Vite** - Build tool
- **Recharts** - Data visualization
- **Framer Motion** - Animations
- **Lucide React** - Icons

---

## 🐛 Troubleshooting

### App won't start
- Ensure Node.js 18+ is installed: `node --version`
- Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Check PowerShell execution policy (Windows)

### Scores not calculating
- Open browser console (F12) for errors
- Ensure profile is set up with valid data
- Check that localStorage is enabled (disable private browsing)

### Data lost
- Data is stored in localStorage - clearing browser data will delete it
- Always export backups regularly from Data Management section

---

## 📊 Recent Updates

### v2.0 (2026-01-06)
✅ **Critical Fixes:**
- Fixed dynamic `require()` bug in useSystemScore
- Added comprehensive error handling for localStorage
- Moved framer-motion to correct dependencies
- Reduced polling interval from 2s to 5s

✅ **Code Quality:**
- Replaced magic numbers with named constants
- Added JSDoc comments to utilities
- Removed unused ObsidianDemo component

---

## 📝 License

MIT License - feel free to use and modify for personal use.

---

## 🤝 Contributing

This is a personal project, but suggestions and bug reports are welcome!

---

## 🎓 Learn More

The scoring algorithms are based on:
- **Biostatistics** - Z-scores, logistic functions, geometric means
- **Exercise Science** - Volume load, fatigue curves
- **Nutrition Science** - Macro ratios, amino acid profiles
- **Sleep Research** - Duration vs quality weighting

---

**Built with ❤️ for optimal human performance**
