# Design System Quick Reference

## 🚀 Quick Start

```tsx
import {
  AppLayout,
  EnhancedPageHeader,
  StatsGrid,
  Section,
  CardGrid,
} from '@/components/layout'
```

## 📐 Most Used Components

### 1. AppLayout (Every Page)
```tsx
<AppLayout maxWidth="xl" padding="md" showSidebar>
  {children}
</AppLayout>
```

### 2. EnhancedPageHeader (Page Headers)
```tsx
<EnhancedPageHeader
  title="Page Title"
  description="Description"
  icon="solar:wallet-bold-duotone"
  breadcrumbs={[{ label: 'Home', href: '/' }]}
  action={<Button>Action</Button>}
/>
```

### 3. StatsGrid (Dashboard Stats)
```tsx
<StatsGrid
  stats={[
    {
      id: '1',
      label: 'Total',
      value: 'R 125,000',
      change: { value: 12.5, trend: 'up' },
      icon: 'solar:wallet-bold-duotone',
    },
  ]}
  columns={4}
/>
```

### 4. Section (Content Organization)
```tsx
<Section
  title="Section Title"
  description="Description"
  variant="bordered"
  action={<Button>Action</Button>}
>
  {content}
</Section>
```

### 5. CardGrid (Card Collections)
```tsx
<CardGrid
  items={[
    {
      id: '1',
      title: 'Card Title',
      description: 'Description',
      content: <div>Content</div>,
      icon: <Icon icon="wallet" />,
    },
  ]}
  columns={3}
/>
```

## 🎨 Design Patterns

### FeatureCard
```tsx
<FeatureCard
  icon="solar:wallet-bold-duotone"
  title="Feature"
  description="Description"
  badge="New"
  onClick={() => {}}
/>
```

### MetricCard
```tsx
<MetricCard
  label="Total"
  value="R 125,000"
  icon="solar:wallet-bold-duotone"
  trend={{ value: 12.5, direction: 'up' }}
/>
```

### EmptyState
```tsx
<EmptyState
  icon="solar:document-text-bold-duotone"
  title="No items"
  description="Get started by creating your first item"
  action={{ label: 'Create', onClick: () => {} }}
/>
```

## 📱 Layout Patterns

### Two Column
```tsx
<TwoColumnLayout
  left={<Sidebar />}
  right={<MainContent />}
  leftWidth="narrow"
  rightWidth="wide"
/>
```

### Stack
```tsx
<Stack spacing="md" direction="column">
  <Item1 />
  <Item2 />
</Stack>
```

### Grid
```tsx
<GridLayout columns={3} gap="md" responsive>
  {items}
</GridLayout>
```

## 🎯 Common Patterns

### Dashboard
```tsx
<AppLayout>
  <EnhancedPageHeader title="Dashboard" />
  <StatsGrid stats={stats} columns={4} />
  <Section title="Charts">
    <GridLayout columns={2}>
      <Chart1 />
      <Chart2 />
    </GridLayout>
  </Section>
</AppLayout>
```

### Form
```tsx
<AppLayout>
  <EnhancedPageHeader title="Form" />
  <Section title="Personal Info" variant="bordered">
    <Stack spacing="md">
      <Input />
      <Input />
    </Stack>
  </Section>
</AppLayout>
```

### List
```tsx
<AppLayout>
  <EnhancedPageHeader title="List" />
  <Section variant="bordered">
    {items.map(item => (
      <ListItem key={item.id} {...item} />
    ))}
  </Section>
</AppLayout>
```

## 📏 Spacing Reference

- `xs`: 4px
- `sm`: 8px
- `md`: 16px
- `lg`: 24px
- `xl`: 32px

## 🎨 Variants

### Section Variants
- `default` - No background
- `muted` - Muted background
- `bordered` - With border

### Card Variants
- `default` - Standard card
- `minimal` - No border
- `elevated` - With shadow

## 🔗 Resources

- Full Guide: `DESIGN_SYSTEM.md`
- Wireframes: `WIREFRAMES.md`
- Visual Guide: `VISUAL_DESIGN_GUIDE.md`
- Showcase: `/design-system`








