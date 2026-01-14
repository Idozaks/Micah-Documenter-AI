# Design Guidelines: Bureaucracy-to-Animation Service

## Design Approach

**Selected Framework**: Accessibility-First Design System (inspired by GOV.UK Design System + Material Design accessibility patterns)

**Rationale**: This is a utility-focused application serving elderly users who need maximum clarity, minimal cognitive load, and reduced anxiety. The design must prioritize readability, ease of navigation, and trustworthiness over visual flair.

---

## Core Design Principles

1. **Radical Simplicity**: Every element must have a clear purpose
2. **High Contrast**: Ensure WCAG AAA compliance throughout
3. **Generous Spacing**: Prevent crowding and visual overwhelm
4. **Predictable Patterns**: Consistent interaction models across the entire application
5. **Calming Presence**: Soft, rounded corners; avoid sharp angles and aggressive geometries

---

## Typography System

**Font Family**: 
- Primary: Inter or Open Sans (Google Fonts via CDN) - exceptional readability
- Monospace (if needed for technical text): JetBrains Mono

**Type Scale**:
- Hero/H1: text-5xl (48px) font-bold
- H2: text-3xl (30px) font-semibold
- H3: text-2xl (24px) font-semibold
- Body Large: text-xl (20px) font-normal - DEFAULT for most content
- Body: text-lg (18px) font-normal
- Small/Helper: text-base (16px) font-normal
- Minimum size: Never below 16px

**Line Height**: Generous leading (leading-relaxed, leading-loose) for all body text

---

## Layout & Spacing System

**Spacing Units**: Use Tailwind units of **4, 6, 8, 12, 16** (e.g., p-4, m-8, gap-12, py-16)

**Container Structure**:
- Max-width: max-w-4xl for primary content (optimized for reading)
- Outer padding: px-6 md:px-8
- Section vertical spacing: py-12 md:py-16

**Grid System**: Single-column layout as default; use 2-column only for:
- Before/After text comparison view
- Video player + transcript side-by-side on desktop (stack on mobile)

---

## Component Library

### Primary Layout Components

**Header**:
- Fixed top navigation (sticky)
- Logo/Service name (left)
- Simple "How it Works" and "About" links (right)
- Height: h-16 md:h-20
- Drop shadow for depth: shadow-md

**Main Content Area**:
- Centered container with generous margins
- Clear visual hierarchy with step-by-step progression
- Minimum 40px between major sections

**Footer**:
- Contact information
- Accessibility statement link
- Trust indicators ("Secure processing", "Privacy protected")
- Social links (if applicable)
- Padding: py-8

### Core UI Elements

**Input Text Area**:
- Large, prominent textarea: min-h-48 md:min-h-64
- Rounded corners: rounded-lg
- Clear label above: "Paste your official letter here"
- Helper text below: "Your text is processed securely and never stored"
- Border focus state with thick outline (4px)

**Buttons**:
- Primary CTA: Large size (px-8 py-4, text-lg)
- Rounded: rounded-full
- Text: Bold weight (font-semibold)
- Include icon where helpful (right-aligned arrow or processing icon)
- Disabled state must be obvious
- If placed over images: backdrop-blur-md with semi-transparent background

**Video Player**:
- Custom-styled or embedded player with large controls
- Aspect ratio: 16:9 in a card container
- Rounded: rounded-xl
- Controls: Oversized play/pause, progress bar
- Captions/subtitles enabled by default
- Padding around player: p-4 within a card

**Progress Indicator** (while AI processes):
- Large, clear spinner or progress bar
- Accompanying text: "Simplifying your letter..." / "Creating your video..."
- Center-aligned with generous whitespace

### Cards & Containers

**Content Cards**:
- Rounded: rounded-xl
- Elevation: shadow-lg
- Padding: p-6 md:p-8
- Clear visual separation from background

**Step Indicators** (for multi-step flow):
- Large numbered circles (w-12 h-12 md:w-16 md:h-16)
- Connected with vertical lines
- Current step highlighted
- Completed steps indicated with checkmark

---

## Page Structure

### Main Application Page

**Hero Section** (80vh max):
- Centered headline: "Transform Complex Letters into Clear Explanations"
- Subheadline explaining the service
- Large "Get Started" button → scrolls to input area
- NO background image (keep it calm and clear)

**Input Section**:
- Clear step label: "Step 1: Paste Your Letter"
- Large textarea (described above)
- Primary button: "Simplify & Create Video"
- Trust indicators below button

**Processing State**:
- Replace input area with progress indicator
- Show processing steps visually
- Estimated time remaining

**Results Section**:
- "Step 2: Watch Your Explanation" label
- Video player (prominent, centered)
- Transcript toggle below video
- Action buttons: "Download Video", "Create Another", "Not Clear? Try Again"

**How It Works Section** (on same page, below fold):
- 3-column grid on desktop (stack on mobile): grid-cols-1 md:grid-cols-3
- Each column: Icon (large, simple), Title, Description
- Icons: Use Heroicons (CDN) - DocumentTextIcon, SparklesIcon, VideoCameraIcon

---

## Interaction Patterns

**Form Validation**:
- Inline validation with clear, friendly error messages
- Error messages: text-base, positioned below input
- Success states with checkmarks

**Loading States**:
- Skeleton screens for video area before processing
- Smooth transitions (transition-all duration-300)

**Animations**: 
- Minimal, purposeful only
- Fade-ins for content: fade-in on scroll
- Smooth page transitions
- NO distracting motion

---

## Accessibility Features

- All interactive elements: min-height of 44px (touch target size)
- Focus indicators: Thick, high-contrast outlines
- Skip navigation link at top
- Semantic HTML throughout
- ARIA labels for all icons and non-text elements
- Keyboard navigation fully supported
- Screen reader announcements for state changes

---

## Icons

**Library**: Heroicons (outline variant via CDN)
**Usage**:
- Navigation: 24px icons
- Feature sections: 48px icons
- Buttons: 20px icons paired with text
- All icons with aria-hidden="true" when decorative

---

## Images

**Hero Image**: NO - Use solid background for calmness
**Feature Icons**: Large, simple illustrative icons (from icon library)
**Trust Badges/Logos**: If partnered with government entities, display small logos in footer

---

## Responsive Behavior

**Mobile-First Breakpoints**:
- Mobile: Default (< 768px) - single column, stacked
- Tablet: md: (768px+) - minor layout adjustments
- Desktop: lg: (1024px+) - max 2-column where appropriate

**Mobile Optimizations**:
- Larger touch targets (minimum 48px)
- Simplified navigation (hamburger if needed)
- Video player fills width
- Text remains highly readable (never below text-base)