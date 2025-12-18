# Woodpecker Design System

## 🎨 Design Philosophy

**"The Gilded Shadow"** - A sophisticated, professional design system that balances elegance with functionality, inspired by legal and financial institutions while maintaining modern accessibility.

## 📐 Layout System

### Grid System
- **12-column grid** with responsive breakpoints
- **Gutter**: 24px (1.5rem) on desktop, 16px (1rem) on mobile
- **Container max-widths**: 640px → 1536px

### Spacing Scale
Based on 8px base unit:
- `xs`: 4px
- `sm`: 8px
- `md`: 16px
- `lg`: 24px
- `xl`: 32px
- `2xl`: 48px
- `3xl`: 64px

## 🎯 Component Patterns

### 1. Page Layouts

#### AppLayout
Main application wrapper with sidebar:
```tsx
<AppLayout maxWidth="xl" padding="md" showSidebar>
  {children}
</AppLayout>
```

#### PageLayout
Full page with header, content, sidebar, footer:
```tsx
<PageLayout
  header={<PageHeader />}
  sidebar={<Sidebar />}
  footer={<Footer />}
>
  {children}
</PageLayout>
```

### 2. Content Organization

#### Section
Organize content into logical sections:
```tsx
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

#### GridLayout
Responsive grid for cards and content:
```tsx
<GridLayout columns={3} gap="md" responsive>
  {items}
</GridLayout>
```

#### CardGrid
Pre-styled card grid with animations:
```tsx
<CardGrid
  items={cardItems}
  columns={3}
  gap="md"
/>
```

## 🎨 Visual Hierarchy

### Typography Scale
- **Display**: 48px (3rem) - Hero headings
- **H1**: 36px (2.25rem) - Page titles
- **H2**: 30px (1.875rem) - Section titles
- **H3**: 24px (1.5rem) - Subsection titles
- **H4**: 20px (1.25rem) - Card titles
- **Body**: 16px (1rem) - Default text
- **Small**: 14px (0.875rem) - Secondary text
- **Tiny**: 12px (0.75rem) - Labels, captions

### Color System
- **Carbon Scale**: Deep blacks (0% - 32% lightness)
- **Mist Scale**: Warm whites (80% - 99% lightness)
- **Accent Colors**: Verdigris blue-grey, Ink black-blue
- **Semantic Colors**: Success, Warning, Error, Info

## 📱 Responsive Breakpoints

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: 1024px - 1280px
- **Large Desktop**: > 1280px

## 🎭 Component States

### Interactive States
- **Default**: Base styling
- **Hover**: Subtle elevation, border color change
- **Active**: Pressed state with slight scale
- **Focus**: Clear focus ring
- **Disabled**: Reduced opacity, no interaction

### Loading States
- **Skeleton**: Placeholder content
- **Spinner**: For inline loading
- **Progress**: For determinate progress

## 🎬 Animations

### Transitions
- **Fast**: 150ms - Micro-interactions
- **Base**: 200ms - Standard transitions
- **Slow**: 300ms - Page transitions
- **Slower**: 500ms - Complex animations

### Motion Principles
- **Ease-in-out**: Natural feeling
- **Stagger**: Sequential animations
- **Spring**: For playful interactions

## 📦 Component Library

### Layout Components
- `AppLayout` - Main app wrapper
- `PageLayout` - Full page structure
- `GridLayout` - Responsive grid
- `Section` - Content sections
- `CardGrid` - Card collections

### UI Components
- Cards, Buttons, Inputs, Selects
- Modals, Dialogs, Popovers
- Tooltips, Toast notifications
- Charts, Tables, Forms

## 🎯 Usage Guidelines

### Do's ✅
- Use consistent spacing scale
- Follow typography hierarchy
- Maintain 8px grid alignment
- Use semantic HTML
- Ensure accessibility (ARIA labels, keyboard navigation)
- Test on multiple screen sizes

### Don'ts ❌
- Don't use arbitrary spacing values
- Don't break typography hierarchy
- Don't ignore responsive breakpoints
- Don't skip accessibility features
- Don't use inline styles for layout

## 🔧 Implementation

All design tokens are available in:
- `lib/design-system/design-tokens.ts`
- CSS variables in `app/globals.css`
- Tailwind config for utility classes

## 📚 Resources

- [Tailwind CSS](https://tailwindcss.com)
- [Shadcn UI](https://ui.shadcn.com)
- [Framer Motion](https://www.framer.com/motion/)

