## Problem
When a user scrolls down on one page and clicks a link to another route, the new page renders at the same scroll position instead of starting at the top. This happens because React Router does not reset scroll position by default.

## Solution
Add a small `ScrollToTop` component inside the `BrowserRouter` that resets `window.scrollTo(0, 0)` on every route change. This covers both desktop and mobile.

### Steps
1. **Create `src/components/ScrollToTop.tsx`** — A component that uses `useLocation` from `react-router-dom` to detect route changes and scrolls to the top of the document.
2. **Update `src/App.tsx`** — Import and render `<ScrollToTop />` inside the `BrowserRouter`, before `<AppContent />`.

No other files need changes. No package installation needed (`react-router-dom` is already in use).