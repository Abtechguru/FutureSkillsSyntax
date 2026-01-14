# Accessibility Guidelines

This document outlines accessibility requirements and best practices for the FutureSkillsSyntax application.

---

## WCAG 2.1 Compliance

We target **WCAG 2.1 Level AA** compliance.

---

## Color & Contrast

### Minimum Contrast Ratios
| Element Type | Ratio | WCAG Level |
|--------------|-------|------------|
| Normal text (< 18px) | 4.5:1 | AA |
| Large text (≥ 18px or 14px bold) | 3:1 | AA |
| UI Components | 3:1 | AA |
| Focus indicators | 3:1 | AA |

### Color Blindness
- Never rely on color alone to convey meaning
- Use icons, patterns, or text labels alongside color
- Test with color blindness simulators

### Dark Mode
- Maintain contrast ratios in both light and dark modes
- Use semantic color tokens for automatic switching

---

## Keyboard Navigation

### Focus Management
```tsx
import { FocusTrap, SkipLink } from '@/components/accessibility/FocusManager'

// Skip link for bypassing navigation
<SkipLink targetId="main-content">Skip to main content</SkipLink>

// Focus trap for modals
<FocusTrap active={isOpen}>
  <Modal>...</Modal>
</FocusTrap>
```

### Focus Indicators
All interactive elements must have visible focus states:

```css
/* Default focus-visible styles */
.focus-visible:ring-2
.focus-visible:ring-offset-2
.focus-visible:ring-primary
```

### Tab Order
- Use logical tab order (top-to-bottom, left-to-right)
- Avoid `tabindex` values > 0
- Use `tabindex="-1"` for programmatically focused elements
- Use `tabindex="0"` for custom interactive elements

### Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Tab` | Move focus forward |
| `Shift + Tab` | Move focus backward |
| `Enter` / `Space` | Activate button/link |
| `Escape` | Close modal/dropdown |
| `Arrow keys` | Navigate within components |
| `Home` / `End` | Jump to first/last item |

---

## Touch Targets

### Minimum Sizes
| Platform | Minimum Size |
|----------|--------------|
| Mobile | 44px × 44px |
| Desktop | 32px × 32px |

### Implementation
```tsx
import { AccessibleButton } from '@/components/accessibility/AccessibleButton'

// Automatically enforces minimum touch target
<AccessibleButton size="md">Click me</AccessibleButton>
```

### Spacing
- Minimum 8px between touch targets
- Prefer 16px for adjacent actions

---

## Screen Readers

### Semantic HTML
Always use correct semantic elements:

```tsx
// ✅ Good
<button>Submit</button>
<nav aria-label="Main navigation">...</nav>
<main id="main-content">...</main>
<article>...</article>

// ❌ Bad
<div onClick={handleClick}>Submit</div>
<div class="navigation">...</div>
```

### ARIA Labels
```tsx
// Icon-only buttons MUST have labels
<IconButton icon={<Search />} label="Search" />

// Complex components need descriptions
<AccessibleButton
  ariaLabel="Delete item"
  ariaDescribedBy="delete-warning"
>
  Delete
</AccessibleButton>
<p id="delete-warning">This action cannot be undone</p>
```

### Live Regions
```tsx
import { useAnnounce } from '@/components/accessibility/FocusManager'

const { announce } = useAnnounce()

// Announce dynamic changes
announce('Form submitted successfully', 'polite')
announce('Error: Invalid email', 'assertive')
```

### Hidden Content
```tsx
// Visually hidden but accessible to screen readers
<span className="sr-only">Opens in new window</span>

// Hidden from all (screen readers and visual)
<div aria-hidden="true">Decorative element</div>
```

---

## Reduced Motion

### Detection
```tsx
import { useReducedMotion } from '@/hooks/useReducedMotion'

const prefersReducedMotion = useReducedMotion()

// Conditionally apply animations
<motion.div
  animate={prefersReducedMotion ? {} : { scale: 1.1 }}
>
```

### CSS Fallback
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Forms

### Labels
Every form input must have an associated label:

```tsx
// ✅ Explicit association
<label htmlFor="email">Email</label>
<input id="email" type="email" />

// ✅ Using ValidatedInput (auto-labels)
<ValidatedInput
  id="email"
  label="Email Address"
  type="email"
/>
```

### Error Messages
- Associate errors with inputs using `aria-describedby`
- Announce errors to screen readers
- Don't rely on color alone

```tsx
<ValidatedInput
  id="email"
  aria-invalid={hasError}
  aria-describedby="email-error"
/>
{hasError && (
  <p id="email-error" role="alert">
    Please enter a valid email
  </p>
)}
```

### Required Fields
```tsx
// Mark required fields visually and programmatically
<label>
  Email <span aria-hidden="true">*</span>
  <span className="sr-only">(required)</span>
</label>
<input required aria-required="true" />
```

---

## Images & Media

### Alternative Text
```tsx
// Informative images
<img src="chart.png" alt="Sales growth: 25% increase in Q4" />

// Decorative images
<img src="decoration.png" alt="" aria-hidden="true" />
```

### Video Captions
- Provide closed captions for all video content
- Include audio descriptions where needed
- Provide transcripts for audio content

---

## Interactive Components

### Buttons vs Links
| Use Button | Use Link |
|------------|----------|
| Form submission | Navigation |
| Toggle states | External URLs |
| Open modals | Anchor links |
| Actions | Route changes |

### Modal Dialogs
```tsx
<ModalTransition isOpen={isOpen}>
  <div
    role="dialog"
    aria-modal="true"
    aria-labelledby="modal-title"
    aria-describedby="modal-description"
  >
    <h2 id="modal-title">Confirm Delete</h2>
    <p id="modal-description">Are you sure?</p>
  </div>
</ModalTransition>
```

### Loading States
```tsx
<button
  aria-busy={isLoading}
  aria-disabled={isLoading}
>
  {isLoading && <span className="sr-only">Loading...</span>}
  Submit
</button>
```

---

## Testing Checklist

### Automated Testing
- [ ] Run axe-core on all pages
- [ ] Test with ESLint jsx-a11y plugin
- [ ] Validate HTML semantics

### Manual Testing
- [ ] Test with keyboard only (no mouse)
- [ ] Test with screen reader (NVDA, VoiceOver)
- [ ] Test with zoom at 200%
- [ ] Test with high contrast mode
- [ ] Test with reduced motion

### Screen Readers to Test
| Platform | Screen Reader |
|----------|---------------|
| Windows | NVDA (free), JAWS |
| macOS | VoiceOver |
| iOS | VoiceOver |
| Android | TalkBack |

---

## Component Checklist

When building new components, verify:

- [ ] Correct semantic HTML element
- [ ] Keyboard accessible
- [ ] Visible focus states
- [ ] Sufficient color contrast
- [ ] Screen reader friendly
- [ ] Touch target sizes (mobile)
- [ ] Reduced motion alternative
- [ ] Error states announced
- [ ] Loading states announced
