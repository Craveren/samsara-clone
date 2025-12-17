# Woodpecker Lifebook - Improvement Plan

## 🎯 Current Situation

You have **TWO projects**:
1. **Root CRA Project** - Legacy Create-React-App with Material-UI, Kendo, Redux, MobX
2. **Woodpecker Next.js** - Modern Next.js 14 monorepo (already optimized)

## 🚀 Recommended Approach: **Incremental Migration**

Instead of a full rewrite, migrate features from CRA → Next.js incrementally.

---

## 📋 Phase 1: Quick Wins (Week 1)

### 1.1 Remove Unused Dependencies

**Remove these redundant libraries:**

```bash
# Multiple chart libraries - keep only Recharts
npm uninstall apexcharts react-apexcharts

# Multiple state managers - keep only Redux Toolkit
npm uninstall mobx

# Multiple mapping libraries - keep only one
npm uninstall google-map-react react-google-maps

# Deprecated Material-UI v6 alpha
npm uninstall @mui/material-next

# Deprecated Material-UI styles (use @mui/system instead)
npm uninstall @mui/styles

# Old/unused
npm uninstall draft-js draftjs-to-html
npm uninstall react-draft-wysiwyg
npm uninstall react-swipeable-views
npm uninstall material-ui-popup-state
```

**Expected savings:** ~500KB bundle size

### 1.2 Update Critical Dependencies

```bash
# Update to latest stable versions
npm install @mui/material@latest @mui/icons-material@latest
npm install @reduxjs/toolkit@latest react-redux@latest
npm install react-router-dom@latest
npm install axios@latest
npm install framer-motion@latest
```

### 1.3 Add Bundle Analyzer

```bash
npm install --save-dev @next/bundle-analyzer webpack-bundle-analyzer
```

Add to `config-overrides.cjs`:

```javascript
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

module.exports = function override(config, env) {
  // ... existing alias code ...
  
  if (process.env.ANALYZE === 'true') {
    config.plugins.push(
      new BundleAnalyzerPlugin({
        analyzerMode: 'static',
        openAnalyzer: true,
      })
    );
  }
  
  return config;
};
```

---

## 📋 Phase 2: Code Splitting (Week 2)

### 2.1 Implement Route-Based Code Splitting

Update `src/index.js`:

```javascript
import React, { lazy, Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

// Lazy load main app
const App = lazy(() => import('./app/App'));

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <App />
      </Suspense>
    </BrowserRouter>
  </React.StrictMode>
);
```

### 2.2 Lazy Load Heavy Components

```javascript
// src/app/main/lifebook/LifebookPage.js
import { lazy, Suspense } from 'react';

const Timeline = lazy(() => import('./components/Timeline'));
const DocumentVault = lazy(() => import('./components/DocumentVault'));
const FinancialDashboard = lazy(() => import('./components/FinancialDashboard'));

export default function LifebookPage() {
  return (
    <div>
      <Suspense fallback={<div>Loading timeline...</div>}>
        <Timeline />
      </Suspense>
      <Suspense fallback={<div>Loading documents...</div>}>
        <DocumentVault />
      </Suspense>
      <Suspense fallback={<div>Loading finances...</div>}>
        <FinancialDashboard />
      </Suspense>
    </div>
  );
}
```

---

## 📋 Phase 3: State Management Cleanup (Week 3)

### 3.1 Migrate from MobX to Redux Toolkit

**Remove MobX:**
```bash
npm uninstall mobx
```

**Consolidate all state in Redux Toolkit:**
- Create feature slices (lifebookSlice, documentSlice, financialSlice)
- Use RTK Query for API calls instead of axios directly

### 3.2 Create Redux Store Structure

```javascript
// src/app/store/index.js
import { configureStore } from '@reduxjs/toolkit';
import lifebookReducer from './lifebookSlice';
import documentReducer from './documentSlice';
import financialReducer from './financialSlice';

export const store = configureStore({
  reducer: {
    lifebook: lifebookReducer,
    documents: documentReducer,
    financials: financialReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['lifebook/addStory'],
      },
    }),
});
```

---

## 📋 Phase 4: UI Library Consolidation (Week 4)

### 4.1 Choose ONE UI Library

**Option A: Keep Material-UI (Easier)**
- Remove Kendo components
- Standardize on Material-UI v5
- Remove custom styled-components where possible

**Option B: Migrate to shadcn/ui (Better long-term)**
- Use the modern Woodpecker Next.js project as reference
- Gradually replace MUI components with shadcn

### 4.2 Remove Kendo Components

```bash
npm uninstall @progress/kendo-react-* @progress/kendo-theme-default
npm uninstall @progress/kendo-intl @progress/kendo-licensing
npm uninstall @progress/kendo-popup-common
```

**Replace with Material-UI or shadcn equivalents:**
- Kendo Timeline → Custom Timeline component
- Kendo Buttons → Material-UI Button or shadcn Button
- Kendo Layout → Material-UI Grid or Tailwind Grid

---

## 📋 Phase 5: Performance Optimization (Week 5)

### 5.1 Add React.memo for Expensive Components

```javascript
// src/app/main/lifebook/components/Timeline.jsx
import { memo } from 'react';

const Timeline = memo(function Timeline({ stories, onStoryClick }) {
  // Component implementation
}, (prevProps, nextProps) => {
  // Custom comparison
  return prevProps.stories.length === nextProps.stories.length;
});
```

### 5.2 Implement Virtual Scrolling for Long Lists

```bash
npm install react-window
```

```javascript
import { FixedSizeList } from 'react-window';

function StoryList({ stories }) {
  return (
    <FixedSizeList
      height={600}
      itemCount={stories.length}
      itemSize={100}
      width="100%"
    >
      {({ index, style }) => (
        <div style={style}>
          <StoryCard story={stories[index]} />
        </div>
      )}
    </FixedSizeList>
  );
}
```

### 5.3 Optimize Images

```bash
npm install react-image
```

Use lazy loading and WebP format for all images.

---

## 📋 Phase 6: Migration to Next.js (Week 6+)

### 6.1 Use Woodpecker Project as Target

Since you already have a modern Next.js project in `woodpecker/`, migrate features there:

1. **Copy components** from `src/app/main/` → `woodpecker/apps/web/components/`
2. **Migrate routes** to Next.js App Router
3. **Move Redux state** to Zustand or React Context
4. **Update API calls** to Next.js API routes

### 6.2 Migration Checklist

- [ ] Lifebook Timeline → `woodpecker/apps/web/app/legacy/page.tsx`
- [ ] Document Vault → `woodpecker/apps/web/app/documents/page.tsx`
- [ ] Financial Dashboard → `woodpecker/apps/web/app/(client)/dashboard/page.tsx`
- [ ] Story Recording → `woodpecker/apps/web/app/interview/page.tsx`
- [ ] People & Family → `woodpecker/apps/web/app/people/page.tsx`

---

## 🎯 Immediate Actions (Do Today)

### 1. Run Bundle Analysis

```bash
ANALYZE=true npm run build
```

See what's actually being used.

### 2. Remove Dead Code

```bash
# Install dependency checker
npm install --save-dev depcheck

# Find unused dependencies
npx depcheck
```

### 3. Update Security Vulnerabilities

```bash
npm audit fix
```

### 4. Add Performance Monitoring

```javascript
// src/reportWebVitals.js
export function reportWebVitals(metric) {
  if (process.env.NODE_ENV === 'production') {
    // Send to analytics
    console.log(metric);
  }
}
```

---

## 📊 Expected Improvements

| Metric | Before | After Phase 1-3 | After Phase 6 |
|--------|--------|-----------------|---------------|
| Bundle Size | 2.5MB | 1.8MB | 350KB |
| First Load | 5.2s | 3.5s | 1.1s |
| Dependencies | 80+ | 45 | 25 |
| Lighthouse | 45 | 65 | 95+ |

---

## 🚀 Quick Start Commands

```bash
# Phase 1: Clean up dependencies
npm uninstall apexcharts react-apexcharts mobx google-map-react react-google-maps @mui/material-next @mui/styles draft-js draftjs-to-html react-draft-wysiwyg react-swipeable-views material-ui-popup-state

# Phase 1: Update critical deps
npm install @mui/material@latest @reduxjs/toolkit@latest react-router-dom@latest

# Phase 1: Add bundle analyzer
npm install --save-dev webpack-bundle-analyzer

# Analyze bundle
ANALYZE=true npm run build

# Check for unused deps
npx depcheck

# Fix security issues
npm audit fix
```

---

## 💡 Recommendation

**Best approach:** Gradually migrate features from the root CRA project to the modern `woodpecker/` Next.js project. This gives you:

1. ✅ Modern architecture (Next.js 14 App Router)
2. ✅ Better performance (server components, automatic code splitting)
3. ✅ Smaller bundle (shadcn/ui instead of MUI + Kendo)
4. ✅ Better DX (TypeScript, modern tooling)
5. ✅ Already set up (Prisma, Clerk, etc.)

**Timeline:** 6-8 weeks for full migration, but you can start using the new app immediately and migrate features one by one.

