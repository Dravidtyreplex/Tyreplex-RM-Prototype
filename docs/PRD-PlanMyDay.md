# PRD: Plan My Day — Map-First Route Planning

**Version:** 1.0  
**Author:** Kiro  
**Date:** July 9, 2026  
**Status:** Draft  
**Feature Owner:** RM App Team  

---

## 1. Executive Summary

**Plan My Day** replaces the current list-first route planning approach with a **map-first visual experience**. Instead of manually picking dealers from a dropdown and getting text-based suggestions, the RM sees their assigned dealers plotted on an interactive map, visualizes the optimal route, and builds their day plan spatially — the way they actually think about field visits.

### Current Pain Points
| Problem | Impact |
|---------|--------|
| RM has to remember dealer locations mentally | Inefficient route planning, more KMs traveled |
| Suggestions are text-based (distance number) — no spatial context | RM can't judge if a "4.2 KM" dealer is on-route or a detour |
| No visualization of the full day's travel path | Can't optimize for least total driving |
| RM selects dealers one-by-one without seeing the big picture | Leads to criss-cross routes instead of logical loops |
| No awareness of traffic/time estimates | Over-scheduling or under-scheduling |

### Proposed Solution
A full-screen map view showing the RM's starting location, all assigned dealers as pins (color-coded by priority), and AI-suggested optimal routes. The RM taps pins to add/remove dealers from today's plan, sees the route line update in real-time, and confirms when satisfied.

---

## 2. User Personas

### Primary: Field RM (Relationship Manager)
- Visits 4-8 dealers per day across a metro area (Delhi NCR, Mumbai, etc.)
- Manages 100-150 assigned dealers
- Key goals: maximize collections, minimize travel time, hit targets
- Uses the app every morning to plan the day before leaving home/office

### Secondary: Area Sales Manager (ASM)
- Reviews RM routes for coverage optimization
- Needs visibility into whether RMs are covering all territories

---

## 3. Feature Requirements

### 3.1 Map View — The Core Experience

**FR-01: Full-Screen Map Display**
- Opens as a new tab/view within the Route Planning screen (alongside current list view)
- Shows an interactive map (Mapbox/Google Maps) centered on RM's current/home location
- Map occupies ~70% of screen height; bottom 30% is a draggable panel for route summary

**FR-02: Dealer Pins on Map**
- All assigned dealers within the selected city/area plotted as pins
- Pin color coding:
  - 🔴 Red: Collection pending (has outstanding dues)
  - 🟡 Amber: Not visited in 15+ days
  - 🟢 Green: Recently visited, no pending
  - 🔵 Blue: Already added to today's route
- Pin size: Larger for high-priority (pending > ₹10,000)
- Tapping a pin shows a mini info card (dealer name, pending amount, last visited date, distance from current route)

**FR-03: RM Starting Point**
- A distinct marker (🏠 or 📍) showing the RM's start location
- Defaults to last known GPS location or home address from profile
- Tappable to change start point

**FR-04: Route Line Visualization**
- When dealers are added to the plan, a polyline draws the route path
- Route updates in real-time as dealers are added/removed/reordered
- Shows direction arrows on the line
- Dotted line for segments not yet confirmed; solid for confirmed
- Color gradient from green (start) to red (end) to show progression

**FR-05: Cluster View for Dense Areas**
- When multiple dealers are close together, show a cluster bubble with count
- Tapping a cluster zooms in to reveal individual pins
- Cluster shows aggregate info: "5 dealers • ₹1.2L pending"

---

### 3.2 Smart Route Suggestions (AI Layer)

**FR-06: Auto-Suggested Optimal Route**
- On opening "Plan My Day", the system pre-computes and suggests an optimal route
- Algorithm considers:
  1. **Collection priority** — dealers with highest pending first
  2. **Geographic efficiency** — shortest total travel distance (TSP approximation)
  3. **Visit recency** — dealers not visited in 15+ days get boost
  4. **Time windows** — dealer shop open hours (if available)
  5. **Credit period expiry** — urgent collections prioritized
- Shown as a "Suggested Route" card at the bottom: "Visit 5 dealers • 32 KM • ~4.5 hrs • ₹78,000 collectible"
- One-tap "Accept Suggested Route" to confirm

**FR-07: Route Optimization on Modification**
- When RM adds/removes a dealer manually, the route auto-re-optimizes
- Shows before/after comparison: "Adding Lucky Tyre House increases route by 2.3 KM"
- Suggests reordering: "Swap stops 3 & 4 to save 4.1 KM"

**FR-08: Smart Nudges on Map**
- Pulsing pins for dealers that are "on the way" between two already-selected stops
- Badge on pin: "Only 800m detour" or "₹15,000 pending"
- Nudge card: "You're passing within 1 KM of SAI RAM TYRES (₹12,800 pending). Add to route?"

---

### 3.3 Route Summary Panel (Bottom Drawer)

**FR-09: Draggable Bottom Panel**
- Collapsed state: Shows "3 stops • 18.5 KM • ~2.5 hrs"
- Half-expanded: Shows ordered stop list with drag-to-reorder
- Full-expanded: Shows detailed timeline with ETA per stop

**FR-10: Stop List in Panel**
- Each stop shows:
  - Sequence number (1, 2, 3...)
  - Dealer name
  - Purpose tag (Collection / New Order / Follow-up)
  - ETA (estimated time of arrival)
  - Pending amount (if collection)
  - Distance from previous stop
- Drag handle for reordering
- Swipe-left to remove from route

**FR-11: Route Statistics Bar**
- Total distance (KM)
- Estimated duration (hrs)
- Total collectible amount
- Number of stops
- Fuel estimate (optional, based on avg 12 km/L)

---

### 3.4 Interaction Flows

**FR-12: Adding a Dealer to Route**
- **From map:** Tap pin → mini card appears → "Add to Route" button
- **From search:** Search bar in map view → results highlight matching pins → tap to add
- **From suggestion:** Accept the AI-suggested dealer card
- Animation: Pin transforms from colored to 🔵 blue, route line extends to new point

**FR-13: Removing a Dealer from Route**
- Tap the blue pin → "Remove from Route" in mini card
- Or swipe-left in the bottom panel stop list
- Route line retracts and re-optimizes

**FR-14: Reordering Stops**
- Drag-and-drop in the bottom panel (existing pattern from current app)
- OR long-press a blue pin on map and drag it in the sequence
- Route line redraws with new order
- Time estimates update

**FR-15: Confirming the Plan**
- "Confirm My Day" button at bottom of panel
- Converts the plan into the existing scheduled visits format (integrates with current VisitsView)
- Shows confirmation: "5 visits scheduled for Today, Jan 7"
- Navigate back to Route Planning list view showing the confirmed schedule

---

### 3.5 Filters & Controls

**FR-16: Map Filters**
- Toggle visibility by priority: Show/hide collection pending, never visited, recently visited
- Radius filter: "Show dealers within 5 / 10 / 15 / 20 KM"
- Brand filter: If RM handles multiple brand dealers

**FR-17: Time Budget Setting**
- RM sets available hours: "I have 6 hours today"
- System caps suggestions to fit within time budget
- Warning if added stops exceed time budget: "Route exceeds your 6-hour window by ~45 min"

**FR-18: View Modes**
- Map view (default for Plan My Day)
- Satellite view toggle
- List view toggle (falls back to current experience)

---

### 3.6 Data Intelligence Cards

**FR-19: Morning Brief Card**
- Shows when Plan My Day opens:
  - "You have ₹1,78,000 pending collections across 12 dealers"
  - "3 dealers haven't been visited in 20+ days"
  - "2 credit periods expiring this week"
- Quick-action: "Plan collections route" / "Plan coverage route"

**FR-20: Historical Route Patterns**
- Shows the RM's most common route patterns
- "You usually visit Sector 18 → Gurgaon → Dwarka on Mondays"
- One-tap to repeat a past route pattern

**FR-21: Dealer Availability Indicators**
- If dealer has reported shop timings:
  - Green dot on pin = currently open
  - Red dot = closed
  - Grey dot = unknown
- Prevents scheduling visits to closed shops

---

## 4. Information Architecture

```
My Route (existing tab)
├── Route Planning (existing)
│   ├── List View (current experience — retained)
│   └── 🆕 Map View ("Plan My Day")
│       ├── Map Layer (pins, route line, clusters)
│       ├── Search Bar (overlay on map)
│       ├── Filter Controls (top-right FABs)
│       ├── Morning Brief Card (dismissible overlay)
│       ├── AI Suggestion Card (bottom, above panel)
│       └── Route Summary Panel (bottom drawer)
│           ├── Collapsed: stats bar
│           ├── Half: stop list + reorder
│           └── Full: timeline + ETA + actions
│               └── "Confirm My Day" CTA
└── History (existing)
```

---

## 5. UI/UX Specifications

### 5.1 Screen Layout

```
┌──────────────────────────┐
│  ← Plan My Day    🔍  ⚙️ │  ← Header (sticky)
├──────────────────────────┤
│                          │
│        MAP AREA          │  ← 65-70% height
│   [Dealer Pins]          │
│   [Route Line]           │
│   [RM Start Point]       │
│                          │
│  ┌─────────────────────┐ │
│  │ 🤖 Suggested Route  │ │  ← AI Card (floating)
│  │ 5 stops • 32KM      │ │
│  │ [Accept] [Customize] │ │
│  └─────────────────────┘ │
├──────────────────────────┤
│  ━━━  (drag handle)      │  ← Bottom Panel
│  3 stops • 18.5 KM • 2h │
│  ┌────────────────────┐  │
│  │ 1. VANSUN (₹11.4K) │  │
│  │ 2. Modern Tyres     │  │
│  │ 3. Super Wheel      │  │
│  └────────────────────┘  │
│  [ Confirm My Day ]      │  ← Primary CTA
└──────────────────────────┘
```

### 5.2 Color Tokens
| Element | Color | Usage |
|---------|-------|-------|
| Collection Pin | #ED1D24 | Dealers with pending amount |
| Stale Pin | #F59E0B | Not visited 15+ days |
| Healthy Pin | #10B981 | Recently visited, no dues |
| Selected Pin | #2563EB | Added to today's route |
| Route Line | #2563EB | Primary route path |
| Route Line Alt | #94A3B8 | Unconfirmed/suggested segments |
| Start Marker | #7C3AED | RM's starting point |

### 5.3 Animations
- Pin add: Scale from 0 → 1 with bounce
- Route line draw: Animate along path (500ms per segment)
- Panel expand: Spring physics (damping: 25, stiffness: 200) — matches existing BottomSheet
- Suggestion card: Slide up from bottom with fade
- Nudge pulse: Repeating scale 1.0 → 1.3 on pins

### 5.4 Gestures
- Pinch to zoom map
- Pan to explore
- Tap pin: Show info card
- Long-press pin: Start drag-to-reorder (if on route)
- Swipe panel up/down: Expand/collapse
- Swipe stop left: Remove from route

---

## 6. Data Requirements

### 6.1 Inputs Needed
| Data | Source | Realtime? |
|------|--------|-----------|
| Dealer lat/lng coordinates | Dealer master DB | No (cached) |
| Dealer pending amounts | Payments/Ledger system | Daily sync |
| Last visit date per dealer | Visit history | Daily sync |
| RM home/office location | Profile settings | Static |
| RM current GPS location | Device GPS | Yes |
| Dealer shop hours | Dealer profile (optional) | No |
| Credit period data | Finance system | Daily |

### 6.2 Computed Data
| Data | Algorithm |
|------|-----------|
| Optimal route order | Nearest-neighbor TSP heuristic (for prototype) |
| ETA per stop | Distance / avg speed (25 km/h city) + 30 min per visit |
| On-route dealers | Check if dealer falls within 1.5 KM of route polyline |
| Cluster grouping | Geo-hash based clustering at zoom levels |

### 6.3 For Prototype (Mock Data)
Since this is a prototype without real APIs:
- Use hardcoded lat/lng for Delhi NCR dealers
- Static map image with overlay pins (or Leaflet.js for interactive)
- Pre-computed distances from existing `getDistanceBetween()` function
- Mock ETA = distance / 25 * 60 minutes + 30 min per stop

---

## 7. Technical Approach (Prototype)

### 7.1 Map Library
**Recommendation: Leaflet.js + OpenStreetMap tiles**
- Free, no API key needed for prototype
- React wrapper: `react-leaflet`
- Lightweight, works well in mobile viewport
- Alternative: Static SVG map for even simpler prototype

### 7.2 Component Architecture
```
PlanMyDayView/
├── MapContainer (Leaflet map)
│   ├── DealerPin (custom markers)
│   ├── RouteLine (polyline)
│   ├── StartMarker
│   └── ClusterGroup
├── SearchOverlay
├── FilterControls
├── AISuggestionCard
├── RouteSummaryPanel (draggable bottom sheet)
│   ├── StatsBar
│   ├── StopList (reorderable)
│   └── ConfirmButton
└── MorningBriefCard (dismissible)
```

### 7.3 State Management
Extend existing VisitsView state or create a dedicated `usePlanMyDay` hook:
```js
{
  selectedDealers: [],      // dealers added to route
  routeOrder: [],           // optimized order
  suggestedRoute: [],       // AI-computed suggestion
  mapCenter: [lat, lng],
  mapZoom: 12,
  filters: { radius, priority, brand },
  timeBudget: 6,            // hours
  panelState: 'collapsed',  // collapsed | half | full
}
```

### 7.4 Integration with Existing System
- "Confirm My Day" writes to the same `days` state in VisitsView
- Output format matches existing visit structure: `{ id, name, locality, time, type, status, distance }`
- Seamless switch between Map and List views

---

## 8. Success Metrics

| Metric | Current | Target |
|--------|---------|--------|
| Avg daily KM driven per RM | Unknown | -20% reduction |
| Time spent planning route | ~5 min (manual) | <2 min |
| Dealers visited per day | 4-5 | 6-7 (more efficient routing) |
| Collection amount per trip | Baseline | +15% (priority-based suggestions) |
| Route plan completion rate | 60% (skips/cancels) | 85% |
| Feature adoption | — | 70% RMs using map view within 2 weeks |

---

## 9. Phases & Scope

### Phase 1 — Prototype (Current Sprint) ✅
- Static/interactive map with dealer pins
- Color-coded pins by priority
- Tap-to-add flow
- Route line visualization
- Bottom panel with stop list + reorder
- Basic distance-based suggestion
- Confirm → integrates with existing schedule

### Phase 2 — Smart Routing
- Real geocoding (dealer addresses → lat/lng)
- TSP route optimization algorithm
- Time-based suggestions (shop hours)
- Traffic-aware ETA

### Phase 3 — Intelligence
- ML-based route patterns (learn from RM behavior)
- Predictive collections (which dealer is likely to pay today)
- Manager dashboard (ASM views RM routes)
- Offline map support

---

## 10. Edge Cases & Handling

| Edge Case | Handling |
|-----------|----------|
| RM has 0 assigned dealers in area | Show empty state: "No dealers assigned in this area" |
| All dealers already visited this week | Show green pins, suggest "coverage visit" for stale ones |
| RM adds 10+ stops (unrealistic) | Warning: "This exceeds a typical day. Consider splitting across 2 days." |
| Two dealers at same location | Stack pins with +1 badge, expand on tap |
| GPS unavailable | Fallback to last known location or manual pin drop |
| Route exceeds time budget | Amber warning banner + suggestion to drop lowest-priority stop |
| Dealer data missing lat/lng | Don't show on map; show in "Unmapped dealers" list below map |

---

## 11. Accessibility

- Map pins have aria-labels: "Modern Tyres, Collection pending ₹23,290, 4.2 KM away"
- Bottom panel is screen-reader navigable
- Color coding supplemented with shape indicators (circle = healthy, triangle = pending, diamond = stale)
- High contrast mode support for route lines
- Keyboard navigation for list view fallback

---

## 12. Out of Scope (for now)

- Real-time traffic integration
- Turn-by-turn navigation (defer to Google Maps intent)
- Multi-day route planning (plan week at once)
- Dealer check-in via geofencing
- Photo proof of visit from map view
- Expense tracking per route

---

## 13. Open Questions (Resolved)

| Question | Resolution |
|----------|-----------|
| Which map provider? | Leaflet + OSM for prototype, Google Maps for production |
| How to handle 150 dealers on one map? | Clustering + radius filter (default 10 KM) |
| Should AI suggestion be dismissible? | Yes, swipe to dismiss, show "View suggestion" button to recall |
| Can RM plan for tomorrow from map? | Yes, date selector at top (Today / Tomorrow / Pick Date) |
| Does confirm override existing visits? | Yes, replaces the target day's visits (same as current behavior) |

---

## 14. Appendix: User Flow Diagram

```
RM opens My Route
    │
    ├── Sees existing List View (Route Planning tab)
    │
    └── Taps "🗺️ Plan My Day" button (new entry point)
            │
            ▼
    ┌─────────────────────┐
    │  Morning Brief Card  │ → "₹1.78L pending across 12 dealers"
    │  [Plan Collections]  │
    │  [Plan Coverage]     │
    └─────────────────────┘
            │ (dismiss or tap action)
            ▼
    ┌─────────────────────┐
    │     MAP VIEW         │
    │  • All dealer pins   │
    │  • RM start marker   │
    │  • AI suggested line │
    └─────────────────────┘
            │
    ┌───────┴────────┐
    │                │
    ▼                ▼
  Accept AI      Customize
  Suggestion      manually
    │                │
    │         Tap pins / search
    │         to add dealers
    │                │
    └───────┬────────┘
            │
            ▼
    Route line updates in real-time
    Bottom panel shows ordered stops
            │
            ▼
    RM reorders if needed (drag)
    Checks stats: 5 stops • 28 KM • 3.5 hrs
            │
            ▼
    ┌─────────────────────┐
    │  [Confirm My Day]    │
    └─────────────────────┘
            │
            ▼
    Visits written to schedule
    Navigates to Route Planning list view
    Shows confirmed visits for today
```

---

*End of PRD*
