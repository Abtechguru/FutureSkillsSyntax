# Component Documentation

API documentation for all reusable components in the FutureSkillsSyntax design system.

---

## Table of Contents

1. [Buttons](#buttons)
2. [Forms](#forms)
3. [Loading States](#loading-states)
4. [Transitions](#transitions)
5. [Gamification](#gamification)
6. [Accessibility](#accessibility)
7. [Flow Components](#flow-components)

---

## Buttons

### AccessibleButton

Primary button component with accessibility features.

```tsx
import AccessibleButton from '@/components/accessibility/AccessibleButton'

<AccessibleButton
  variant="primary"
  size="md"
  icon={<Save />}
  loading={isLoading}
  loadingText="Saving..."
>
  Save Changes
</AccessibleButton>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'primary' \| 'secondary' \| 'outline' \| 'ghost' \| 'danger'` | `'primary'` | Visual style |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Button size |
| `icon` | `ReactNode` | - | Icon element |
| `iconPosition` | `'left' \| 'right'` | `'left'` | Icon placement |
| `loading` | `boolean` | `false` | Show loading spinner |
| `loadingText` | `string` | - | Screen reader text during loading |
| `fullWidth` | `boolean` | `false` | Expand to container width |
| `ariaLabel` | `string` | - | Accessible label |
| `ariaDescribedBy` | `string` | - | ID of description element |

### IconButton

Button with icon only (requires label for accessibility).

```tsx
import { IconButton } from '@/components/accessibility/AccessibleButton'

<IconButton
  icon={<Search />}
  label="Search"
  variant="ghost"
/>
```

### ButtonGroup

Group related buttons together.

```tsx
import { ButtonGroup } from '@/components/accessibility/AccessibleButton'

<ButtonGroup ariaLabel="Text alignment">
  <AccessibleButton>Left</AccessibleButton>
  <AccessibleButton>Center</AccessibleButton>
  <AccessibleButton>Right</AccessibleButton>
</ButtonGroup>
```

---

## Forms

### ValidatedInput

Input with real-time validation.

```tsx
import { ValidatedInput, validationRules } from '@/components/forms/FormValidation'

<ValidatedInput
  id="email"
  type="email"
  label="Email Address"
  placeholder="you@example.com"
  rules={[
    validationRules.required(),
    validationRules.email(),
  ]}
  validateOnBlur
  helperText="We'll never share your email"
/>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | - | Input label |
| `rules` | `ValidationRule[]` | `[]` | Validation rules |
| `validateOnBlur` | `boolean` | `true` | Validate on blur |
| `validateOnChange` | `boolean` | `false` | Validate on change |
| `showStrength` | `boolean` | `false` | Show password strength |
| `helperText` | `string` | - | Help text below input |
| `error` | `string` | - | External error message |

### Validation Rules

```tsx
import { validationRules } from '@/components/forms/FormValidation'

validationRules.required('Field is required')
validationRules.email('Invalid email')
validationRules.minLength(8, 'Minimum 8 characters')
validationRules.maxLength(100)
validationRules.pattern(/^\d+$/, 'Numbers only')
validationRules.password()
validationRules.match(otherValue, 'Passwords must match')
```

### useFormValidation

Form-level validation hook.

```tsx
import { useFormValidation, validationRules } from '@/components/forms/FormValidation'

const { formState, setValue, validateAll, isValid } = useFormValidation({
  email: { value: '', rules: [validationRules.required(), validationRules.email()] },
  password: { value: '', rules: [validationRules.password()] },
})

const handleSubmit = () => {
  if (validateAll()) {
    // Submit form
  }
}
```

---

## Loading States

### LoadingOverlay

Full-screen loading overlay with states.

```tsx
import { LoadingOverlay } from '@/components/loading/LoadingStates'

<LoadingOverlay
  state="loading" // 'idle' | 'loading' | 'success' | 'error'
  message="Processing..."
  error="Something went wrong"
  onRetry={handleRetry}
  onDismiss={handleDismiss}
/>
```

### LoadingSpinner

Inline loading spinner.

```tsx
import { LoadingSpinner } from '@/components/loading/LoadingStates'

<LoadingSpinner size="md" color="text-primary" />
```

### LoadingButton

Button with loading state.

```tsx
import { LoadingButton } from '@/components/loading/LoadingStates'

<LoadingButton
  isLoading={isSubmitting}
  loadingText="Saving..."
>
  Save
</LoadingButton>
```

### SkeletonScreen

Skeleton loading layouts.

```tsx
import { SkeletonScreen } from '@/components/loading/LoadingStates'

<SkeletonScreen layout="dashboard" />
// Options: 'dashboard' | 'profile' | 'list' | 'detail'
```

---

## Transitions

### PageTransition

Animated page wrapper.

```tsx
import { PageTransition, TransitionProvider } from '@/components/transitions/PageTransitions'

// Wrap app with provider
<TransitionProvider defaultTransition="fade">
  <App />
</TransitionProvider>

// Use in pages
<PageTransition transition="slide-left">
  <YourPage />
</PageTransition>
```

#### Transition Types

| Type | Description |
|------|-------------|
| `fade` | Simple opacity fade |
| `slide-left` | Slide in from right |
| `slide-right` | Slide in from left |
| `slide-up` | Slide in from bottom |
| `slide-down` | Slide in from top |
| `push` | Push with scale effect |
| `pop` | Pop with scale effect |
| `zoom` | Zoom in/out |

### ModalTransition

Animated modal/drawer.

```tsx
import { ModalTransition } from '@/components/transitions/PageTransitions'

<ModalTransition
  isOpen={isOpen}
  type="slide-up"
  onClose={handleClose}
>
  <ModalContent />
</ModalTransition>
```

### StaggeredList

Staggered children animation.

```tsx
import { StaggeredList } from '@/components/transitions/PageTransitions'

<StaggeredList staggerDelay={0.1}>
  {items.map(item => <Card key={item.id}>{item.title}</Card>)}
</StaggeredList>
```

---

## Gamification

### BadgeCard

Display achievement badge.

```tsx
import BadgeCard from '@/components/gamification/BadgeCard'

<BadgeCard
  badge={badge}
  size="lg"
  showProgress
  onClick={handleClick}
/>
```

### BadgeUnlockAnimation

Badge unlock celebration.

```tsx
import BadgeUnlockAnimation from '@/components/gamification/BadgeUnlockAnimation'

<BadgeUnlockAnimation
  badge={unlockedBadge}
  isVisible={showAnimation}
  onClose={handleClose}
  onShare={handleShare}
/>
```

### XpProgressBar

XP progress display.

```tsx
import XpProgressBar from '@/components/gamification/XpProgressBar'

<XpProgressBar
  level={userLevel}
  showDetails
  onLevelUp={handleViewProgress}
/>
```

### StreakCounter

Daily streak display.

```tsx
import StreakCounter from '@/components/gamification/StreakCounter'

<StreakCounter
  streak={userStreak}
  compact={false}
  showMilestones
/>
```

### AnimatedAvatar

Animated user avatar.

```tsx
import AnimatedAvatar from '@/components/gamification/AnimatedAvatar'

<AnimatedAvatar
  state="success" // 'idle' | 'success' | 'thinking' | 'happy' | 'sad' | 'wave'
  skinTone="#FFDBB4"
  size="lg"
/>
```

---

## Accessibility

### FocusTrap

Trap focus within a container.

```tsx
import { FocusTrap } from '@/components/accessibility/FocusManager'

<FocusTrap active={isModalOpen} restoreFocus>
  <Modal>Focus stays here</Modal>
</FocusTrap>
```

### SkipLink

Skip to main content link.

```tsx
import { SkipLink } from '@/components/accessibility/FocusManager'

<SkipLink targetId="main-content">
  Skip to main content
</SkipLink>
```

### useAnnounce

Screen reader announcements.

```tsx
import { useAnnounce, AnnounceProvider } from '@/components/accessibility/FocusManager'

// Wrap app
<AnnounceProvider>
  <App />
</AnnounceProvider>

// Use in components
const { announce } = useAnnounce()
announce('Item deleted', 'assertive')
```

### useKeyboardNavigation

Keyboard event handlers.

```tsx
import { useKeyboardNavigation } from '@/components/accessibility/FocusManager'

useKeyboardNavigation({
  onEscape: closeModal,
  onArrowDown: selectNext,
  onArrowUp: selectPrevious,
})
```

---

## Flow Components

### OnboardingFlow

Complete registration flow.

```tsx
import OnboardingFlow from '@/components/flows/OnboardingFlow'

<OnboardingFlow />
```

Steps: Welcome → Account → Profile → Goals → Complete

### MentorshipFlow

Session booking flow.

```tsx
import MentorshipFlow from '@/components/flows/MentorshipFlow'

<MentorshipFlow
  initialStep="browse"
  mentorId={selectedMentorId}
/>
```

Steps: Browse → Schedule → Confirm → Session → Feedback

---

## Hooks

### useReducedMotion

Detect reduced motion preference.

```tsx
import { useReducedMotion } from '@/hooks/useReducedMotion'

const prefersReducedMotion = useReducedMotion()

if (prefersReducedMotion) {
  // Use simple transitions
}
```

### usePageTransition

Page transition context.

```tsx
import { usePageTransition } from '@/components/transitions/PageTransitions'

const { navigateWithTransition, setTransition } = usePageTransition()

navigateWithTransition('/dashboard', 'slide-left')
```
