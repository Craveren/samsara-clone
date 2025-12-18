# Wireframes & Design Patterns

## 📐 Layout Wireframes

### Dashboard Layout
```
┌─────────────────────────────────────────────────┐
│ Sidebar │ Header                                │
│         ├───────────────────────────────────────┤
│         │ Stats Grid (4 cards)                  │
│         ├───────────────────────────────────────┤
│         │ Chart 1        │ Chart 2             │
│         ├───────────────────────────────────────┤
│         │ Table/List                             │
│         └───────────────────────────────────────┘
```

### Form Layout
```
┌─────────────────────────────────────┐
│ Form Header                          │
├─────────────────────────────────────┤
│ Field 1                              │
│ Field 2                              │
│ Field 3                              │
│ Field 4                              │
├─────────────────────────────────────┤
│ [Cancel] [Submit]                    │
└─────────────────────────────────────┘
```

### Detail Page Layout
```
┌─────────────────────────────────────────────┐
│ Page Header                                  │
├──────────────────────────┬──────────────────┤
│                          │ Sidebar          │
│ Main Content             │                  │
│                          │ Actions          │
│                          │                  │
└──────────────────────────┴──────────────────┘
```

## 🎨 Component Patterns

### Card Pattern
```
┌─────────────────────────┐
│ [Icon] Title      [Action]│
│        Description      │
├─────────────────────────┤
│ Content                 │
│                         │
└─────────────────────────┘
```

### Stats Card Pattern
```
┌─────────────────────────┐
│ Label                   │
│ Value                   │
│ Subtext                 │
│ [Icon]                  │
└─────────────────────────┘
```

### Chart Card Pattern
```
┌─────────────────────────┐
│ Title            [Menu] │
│ Description             │
├─────────────────────────┤
│                         │
│      Chart Area         │
│                         │
└─────────────────────────┘
```

## 📱 Responsive Breakpoints

### Mobile (< 640px)
- Single column layout
- Stacked cards
- Full-width sections
- Collapsible sidebar

### Tablet (640px - 1024px)
- 2-column grids
- Side-by-side charts
- Expanded sidebar

### Desktop (> 1024px)
- 3-4 column grids
- Multi-column layouts
- Full sidebar visible

## 🎯 Usage Examples

### Using AppLayout
```tsx
import { AppLayout } from '@/components/layout'

export default function DashboardPage() {
  return (
    <AppLayout maxWidth="xl" padding="md">
      <h1>Dashboard</h1>
      {/* Content */}
    </AppLayout>
  )
}
```

### Using GridLayout
```tsx
import { GridLayout } from '@/components/layout'

<GridLayout columns={3} gap="md" responsive>
  <Card>Item 1</Card>
  <Card>Item 2</Card>
  <Card>Item 3</Card>
</GridLayout>
```

### Using Section
```tsx
import { Section } from '@/components/layout'

<Section
  title="Financial Overview"
  description="Track your financial health"
  action={<Button>View Details</Button>}
  variant="bordered"
>
  {/* Content */}
</Section>
```

### Using CardGrid
```tsx
import { CardGrid } from '@/components/layout'

<CardGrid
  items={[
    {
      id: '1',
      title: 'Total Balance',
      description: 'All accounts',
      content: <div>R 125,000</div>,
      icon: <Icon icon="wallet" />,
    },
    // ... more items
  ]}
  columns={3}
/>
```

## 🎨 Design Tokens Usage

### Spacing
```tsx
// Use design tokens for consistent spacing
import { designTokens } from '@/lib/design-system/design-tokens'

<div style={{ padding: designTokens.spacing.lg }}>
  Content
</div>
```

### Typography
```tsx
<h1 style={{ fontSize: designTokens.typography.fontSize['3xl'] }}>
  Title
</h1>
```

## 📐 Grid System

### 12-Column Grid
```
┌──┬──┬──┬──┬──┬──┬──┬──┬──┬──┬──┬──┐
│ 1│ 2│ 3│ 4│ 5│ 6│ 7│ 8│ 9│10│11│12│
└──┴──┴──┴──┴──┴──┴──┴──┴──┴──┴──┴──┘
```

### Common Layouts
- **3-column**: 4-4-4
- **2-column**: 6-6
- **Sidebar + Content**: 3-9
- **Content + Sidebar**: 9-3

## 🎭 Animation Patterns

### Page Transitions
- Fade in: 300ms
- Slide up: 300ms with 20px offset
- Stagger: 50ms delay between items

### Card Interactions
- Hover: Elevation + border color change
- Click: Scale down 0.98
- Focus: Ring with 2px offset

## 📚 Best Practices

1. **Consistency**: Use layout components consistently
2. **Responsive**: Always test on multiple screen sizes
3. **Accessibility**: Include ARIA labels and keyboard navigation
4. **Performance**: Use motion sparingly, prefer CSS transitions
5. **Spacing**: Stick to the 8px grid system

