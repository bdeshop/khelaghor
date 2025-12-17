# Theme Configuration Usage

## Setup

1. **Wrap your app with ThemeProvider** in `src/main.tsx`:

```tsx
import { ThemeProvider } from "./contexts/ThemeContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
```

2. **Use the theme in any component**:

```tsx
import { useTheme } from "./hooks/useTheme";

function MyComponent() {
  const { theme, isLoading } = useTheme();

  if (isLoading) {
    return <div>Loading theme...</div>;
  }

  return (
    <div style={{ backgroundColor: theme.colors.background.body }}>
      <h1 style={{ color: theme.colors.text.heading }}>
        {theme.brand.site_name}
      </h1>
    </div>
  );
}
```

## Environment Variables

Set your API base URL in `.env`:

```
VITE_API_BASE_URL=https://your-api-domain.com
```

## Features

- Fetches theme config from `GET /api/theme-config`
- Falls back to default config if API fails
- Caches the config to avoid repeated API calls
- Provides loading state for better UX
