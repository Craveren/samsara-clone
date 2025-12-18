# Visual Design Guide

## 🎨 Design System Overview

This guide showcases all layout components, design patterns, and visual elements available in the Woodpecker design system.

## 📐 Layout Components

### AppLayout
Main application wrapper with sidebar integration.

```tsx
import { AppLayout } from '@/components/layout'

<AppLayout maxWidth="xl" padding="md" showSidebar>
  {children}
</AppLayout>
```

### PageLayout
Full page structure with header, sidebar, and footer.

```tsx
import { PageLayout } from '@/components/layout'

<PageLayout
  header={<PageHeader />}
  sidebar={<Sidebar />}
  footer={<Footer />}
>
  {content}
</PageLayout>
```

### GridLayout
Responsive grid system that automatically adjusts columns.

```tsx
import { GridLayout } from '@/components/layout'

<GridLayout columns={3} gap="md" responsive>
  {items}
</GridLayout>
```

### Section
Organize content into logical sections.

```tsx
import { Section } from '@/components/layout'

<Section
  title="Section Title"
  description="Section description"
  action={<Button>Action</Button>}
  variant="bordered"
  spacing="lg"
>
  {content}
</Section>
```

### TwoColumnLayout
Flexible two-column layout with configurable widths.

```tsx
import { TwoColumnLayout } from '@/components/layout'

<TwoColumnLayout
  left={<SidebarContent />}
  right={<MainContent />}
  leftWidth="narrow"
  rightWidth="wide"
  gap="lg"
/>
```

### PageContainer
Consistent page container with max-width and padding.

```tsx
import { PageContainer } from '@/components/layout'

<PageContainer maxWidth="xl" padding="lg">
  {content}
</PageContainer>
```

### Stack
Vertical or horizontal layouts with consistent spacing.

```tsx
import { Stack } from '@/components/layout'

<Stack spacing="md" direction="column" align="start">
  {items}
</Stack>
```

## 🎯 Component Patterns

### StatsGrid
Beautiful stat cards with trend indicators.

```tsx
import { StatsGrid } from '@/components/layout'

<StatsGrid
  stats={[
    {
      id: '1',
      label: 'Total Balance',
      value: 'R 125,000',
      change: { value: 12.5, trend: 'up', period: 'vs last month' },
      icon: 'solar:wallet-bold-duotone',
    },
  ]}
  columns={4}
/>
```

### CardGrid
Pre-styled card collections with animations.

```tsx
import { CardGrid } from '@/components/layout'

<CardGrid
  items={cardItems}
  columns={3}
  gap="md"
/>
```

### EmptyState
Beautiful empty states for when there's no content.

```tsx
import { EmptyState } from '@/components/layout'

<EmptyState
  icon="solar:document-text-bold-duotone"
  title="No items found"
  description="Get started by creating your first item"
  action={{
    label: 'Create Item',
    onClick: () => {},
  }}
/>
```

### EnhancedPageHeader
Page headers with breadcrumbs, icons, and actions.

```tsx
import { EnhancedPageHeader } from '@/components/layout'

<EnhancedPageHeader
  title="Page Title"
  description="Page description"
  icon="solar:wallet-bold-duotone"
  breadcrumbs={[
    { label: 'Home', href: '/' },
    { label: 'Current Page' },
  ]}
  action={<Button>Action</Button>}
/>
```

## 🎭 Design Patterns

### FeatureCard
Cards for showcasing features.

```tsx
import { FeatureCard } from '@/components/layout'

<FeatureCard
  icon="solar:wallet-bold-duotone"
  title="Feature Name"
  description="Feature description"
  badge="New"
  onClick={() => {}}
/>
```

### MetricCard
Simple metric display cards.

```tsx
import { MetricCard } from '@/components/layout'

<MetricCard
  label="Total Balance"
  value="R 125,000"
  icon="solar:wallet-bold-duotone"
  trend={{ value: 12.5, direction: 'up' }}
/>
```

### ActionCard
Cards with built-in action buttons.

```tsx
import { ActionCard } from '@/components/layout'

<ActionCard
  title="Card Title"
  description="Card description"
  icon="solar:add-circle-bold-duotone"
  action={{
    label: 'Take Action',
    onClick: () => {},
  }}
/>
```

### ListItem
Consistent list item pattern.

```tsx
import { ListItem } from '@/components/layout'

<ListItem
  title="Item Title"
  subtitle="Subtitle"
  description="Description text"
  icon="solar:document-text-bold-duotone"
  badge={<Badge>Status</Badge>}
  action={<Button>Action</Button>}
  onClick={() => {}}
/>
```

### StatusBadge
Status indicators with semantic colors.

```tsx
import { StatusBadge } from '@/components/layout'

<StatusBadge status="success" label="Active" />
<StatusBadge status="warning" label="Pending" />
<StatusBadge status="error" label="Error" />
```

## 📐 Wireframe Templates

Pre-built wireframe templates for common layouts:

```tsx
import { WireframeTemplates } from '@/components/layout'

<WireframeTemplates.Dashboard />
<WireframeTemplates.Form />
<WireframeTemplates.Detail />
<WireframeTemplates.List />
<WireframeTemplates.Settings />
<WireframeTemplates.Profile />
<WireframeTemplates.Empty />
```

## 🎨 Visual Hierarchy

### Typography Scale
- **Display**: 48px - Hero headings
- **H1**: 36px - Page titles
- **H2**: 30px - Section titles
- **H3**: 24px - Subsection titles
- **H4**: 20px - Card titles
- **Body**: 16px - Default text
- **Small**: 14px - Secondary text
- **Tiny**: 12px - Labels

### Spacing Scale
Based on 8px base unit:
- `xs`: 4px
- `sm`: 8px
- `md`: 16px
- `lg`: 24px
- `xl`: 32px
- `2xl`: 48px

### Color Usage
- **Foreground**: Primary text color
- **Muted Foreground**: Secondary text
- **Border**: Subtle borders (60% opacity)
- **Background**: Page background
- **Card**: Card background
- **Muted**: Subtle backgrounds

## 📱 Responsive Patterns

### Mobile First
All layouts start with mobile (single column) and expand:
- Mobile: < 640px - Single column
- Tablet: 640px - 1024px - 2 columns
- Desktop: > 1024px - 3-4 columns

### Breakpoint Usage
```tsx
// Automatically responsive
<GridLayout columns={3} responsive />

// Manual control
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
```

## 🎬 Animation Patterns

### Page Transitions
- Fade in: 300ms
- Slide up: 300ms with 20px offset
- Stagger: 50ms delay between items

### Card Interactions
- Hover: Scale 1.02, border color change
- Click: Scale 0.98
- Focus: Ring with 2px offset

## 🎯 Best Practices

1. **Consistency**: Always use layout components
2. **Spacing**: Stick to the 8px grid
3. **Typography**: Follow the hierarchy
4. **Responsive**: Test on all breakpoints
5. **Accessibility**: Include ARIA labels
6. **Performance**: Use CSS transitions over JS animations when possible

## 📚 Component Examples

See `components/layout/VisualDesignGuide.tsx` for live examples of all components.








