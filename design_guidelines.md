# Personal AI Assistant - Design Guidelines

## Design Approach

**Selected Approach:** Design System with Modern Productivity App Aesthetic  
**Reference Products:** Linear, Notion, ChatGPT, Claude  
**Justification:** As a utility-focused AI assistant emphasizing efficiency and daily productivity, the design should prioritize clarity, consistency, and minimal cognitive load. Drawing from modern AI tools and productivity apps ensures users feel immediately familiar with interaction patterns.

**Core Principles:**
- Clean, distraction-free interfaces that let content breathe
- Consistent patterns across all pages for intuitive navigation
- Smooth, purposeful micro-interactions
- Information hierarchy that guides user attention

---

## Core Design Elements

### A. Color Palette

**Dark Mode (Primary):**
- Background Base: 220 20% 10%
- Surface Elevated: 220 18% 14%
- Surface Overlay: 220 16% 18%
- Border Subtle: 220 15% 25%
- Border Default: 220 12% 35%
- Text Primary: 0 0% 98%
- Text Secondary: 220 10% 70%
- Text Tertiary: 220 8% 50%

**Brand & Accent:**
- Primary Brand: 250 80% 65% (vibrant purple-blue for CTAs, active states)
- Primary Hover: 250 75% 60%
- Success: 142 76% 45%
- Warning: 38 92% 50%
- Destructive: 0 84% 60%

**Light Mode (Secondary):**
- Background Base: 0 0% 100%
- Surface Elevated: 220 20% 98%
- Surface Overlay: 220 18% 96%
- Border Subtle: 220 15% 88%
- Text Primary: 220 25% 10%
- Text Secondary: 220 15% 35%

### B. Typography

**Font Families:**
- Primary: 'Inter' via Google Fonts (UI, body text)
- Monospace: 'JetBrains Mono' (code snippets, technical details)

**Type Scale:**
- Heading XL: text-4xl font-bold (36px, hero sections)
- Heading L: text-3xl font-semibold (30px, page titles)
- Heading M: text-2xl font-semibold (24px, section headers)
- Heading S: text-xl font-semibold (20px, card titles)
- Body L: text-base font-normal (16px, main content)
- Body M: text-sm font-normal (14px, secondary content)
- Body S: text-xs font-medium (12px, labels, metadata)

### C. Layout System

**Spacing Primitives:** Use Tailwind units of 2, 3, 4, 6, 8, 12, 16, 20 for consistent rhythm
- Component padding: p-4 (cards), p-6 (modals)
- Section spacing: space-y-6 (related items), space-y-8 (sections)
- Page margins: px-6 md:px-8 lg:px-12

**Container Strategy:**
- Sidebar: Fixed w-64 on desktop, collapsible on mobile
- Main Content: max-w-7xl mx-auto with responsive padding
- Chat Window: max-w-4xl centered for optimal reading
- Task Cards: max-w-2xl for focused task management

### D. Component Library

**Navigation:**
- Sidebar: Fixed left navigation (desktop), slide-out drawer (mobile)
- Nav items: Hover state with subtle background (bg-surface-elevated), active state with primary accent border-l-2
- Icons: Heroicons (outline for inactive, solid for active states)

**Chat Interface:**
- Message Bubbles: User messages aligned right with primary brand background, AI responses aligned left with surface-elevated background
- Input Area: Sticky bottom bar with rounded-xl input field, h-12 minimum height, expanding to max-h-32 for multiline
- Timestamp: text-xs text-tertiary below messages
- Typing Indicator: Animated dots using primary brand color

**Task Management:**
- Task Cards: Rounded-lg cards with p-4, border border-subtle, hover:border-default transition
- Task Actions: Icon buttons (edit, delete) revealed on hover, positioned absolute right-4
- Add Task: Floating action button (FAB) fixed bottom-right, or inline "+ New Task" button
- Status Toggle: Custom checkbox with checkmark animation, success color when completed

**Forms & Inputs:**
- Input Fields: h-10 rounded-md border border-default, focus:ring-2 focus:ring-primary
- Select Dropdowns: Custom styled with Heroicons chevron
- Theme Toggles: Segmented control or radio cards for personalization options
- Settings Sections: Grouped with subtle dividers (border-t border-subtle)

**Modals & Overlays:**
- Modal Background: bg-black/50 backdrop-blur-sm
- Modal Container: bg-surface-overlay rounded-2xl shadow-2xl max-w-md p-6
- Close Button: Absolute top-4 right-4, hover:bg-surface-elevated

### E. Page-Specific Guidelines

**Home Page:**
- Hero Section: h-48 with gradient background (from-primary/10 to-transparent), welcome message text-4xl
- Quick Actions: Grid of 3 cards (Chat, Tasks, Personalization) with icons, titles, and brief descriptions
- Recent Activity: Timeline-style list of last 5 interactions

**Chat Page:**
- Full-height layout (h-screen) with messages container and fixed input footer
- Message grouping: Group consecutive messages from same sender, show avatar only on first message
- Code blocks: bg-black/50 rounded-md p-3 with copy button
- Suggested prompts: Pill-shaped buttons below input when conversation is empty

**Tasks Page:**
- Filter tabs: "All", "Active", "Completed" using border-b-2 for active state
- Empty state: Centered illustration placeholder with "No tasks yet" message
- Bulk actions: Checkbox selection with floating action bar when items selected

**Personalization Page:**
- Section cards: Each preference category in separate card (Communication Style, Theme, Language)
- Preview panel: Right-side preview showing changes in real-time
- Radio cards: Bordered containers for each option, full-width on mobile

**Settings Page:**
- Two-column layout on desktop: Nav menu left (w-48), content right
- Integration cards: Logo, name, description, toggle switch aligned right
- Danger zone: Red-tinted card (bg-destructive/10) at bottom for account deletion

### F. Interactions & Animations

- Page transitions: Fade in content with stagger (animate-in fade-in duration-300)
- Button clicks: Scale down slightly (active:scale-95)
- Hover states: Subtle background change (transition-colors duration-200)
- Loading states: Skeleton loaders with shimmer effect for chat and tasks
- Avoid excessive animations - only use for meaningful feedback

### G. Responsive Breakpoints

- Mobile: Base styles, stack all layouts vertically
- Tablet (md: 768px): Show sidebar as drawer, 2-column for settings
- Desktop (lg: 1024px): Fixed sidebar, multi-column layouts where appropriate

---

## Images

**Hero Image:** No large hero image needed. This is a utility-focused app where functionality takes precedence. Use gradient backgrounds and iconography instead.

**Supporting Images:**
- Empty state illustrations: Simple, line-art style illustrations for empty chat/task states
- Avatar placeholders: Circular avatars (w-10 h-10) for user and AI in chat
- Integration logos: Small brand logos (h-8) in settings integrations section