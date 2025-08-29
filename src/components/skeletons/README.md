# Skeleton Components

This folder contains skeleton loading components that provide visual feedback while data is being fetched.

## Available Components

### AccessCardSkeleton

Skeleton loader for access cards in the account management system.

```jsx
import { AccessCardSkeleton } from "../skeletons";

// Show 8 skeleton cards while loading
{
  Array.from({ length: 8 }).map((_, index) => (
    <AccessCardSkeleton key={index} />
  ));
}
```

### TableSkeleton

Skeleton loader for table components with customizable rows and columns.

```jsx
import { TableSkeleton } from '../skeletons';

// Default: 5 rows, 4 columns
<TableSkeleton />

// Custom: 10 rows, 6 columns
<TableSkeleton rows={10} columns={6} />
```

### FormSkeleton

Skeleton loader for form components with customizable number of fields.

```jsx
import { FormSkeleton } from '../skeletons';

// Default: 6 form fields
<FormSkeleton />

// Custom: 8 form fields
<FormSkeleton fields={8} />
```

## Usage Pattern

1. **Import the skeleton component**
2. **Show skeleton while loading**
3. **Replace with actual content when data arrives**

```jsx
const MyComponent = () => {
  const { data, isLoading } = useMyQuery();

  if (isLoading) {
    return <TableSkeleton rows={5} columns={4} />;
  }

  return <table>{/* Actual table content */}</table>;
};
```

## Styling

All skeleton components use:

- **Tailwind CSS** for styling
- **`animate-pulse`** for loading animation
- **Gray colors** (`bg-gray-300`) for skeleton elements
- **Consistent spacing** and sizing

## Adding New Skeletons

1. Create the skeleton component in this folder
2. Export it from `index.js`
3. Follow the naming convention: `ComponentNameSkeleton`
4. Use consistent styling patterns
