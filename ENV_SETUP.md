# Environment Setup for Dynamic Backend URLs

## Overview

This project uses environment variables to dynamically switch between development and production backend URLs based on the `VITE_MODE` setting.

## Environment File Setup

Create a `.env` file in your project root with the following variables:

```bash
# Environment mode (dev or prod)
VITE_MODE=dev

# Development backend URLs
VITE_DEV_API_BASE_URL=http://localhost:3000/api
VITE_DEV_BACKEND_URL=http://localhost:3000

# Production backend URLs
VITE_PROD_API_BASE_URL=https://your-backend-domain.com/api
VITE_PROD_BACKEND_URL=https://your-backend-domain.com
```

## Usage

### 1. RTK Query (Automatic)

The API slice automatically uses the correct base URL based on your environment:

```javascript
// In your components, just use the endpoints normally
const { data, isLoading } = useGetUsersQuery();
// The base URL is automatically handled
```

### 2. Direct API Calls

Use the utility functions for direct API calls:

```javascript
import { apiGet, apiPost, getApiUrl } from "../utils/apiUtils";

// GET request
const response = await apiGet("/users");

// POST request
const newUser = await apiPost("/users", {
  name: "John",
  email: "john@example.com",
});

// Get full URL
const fullUrl = getApiUrl("/users");
```

### 3. Configuration Object

Access the configuration directly:

```javascript
import { config } from "../config/env";

console.log(config.api.baseUrl); // Current API base URL
console.log(config.isDev); // Boolean indicating if in development mode
console.log(config.mode); // Current mode ('dev' or 'prod')
```

## Switching Environments

To switch between environments, simply change the `VITE_MODE` value:

- **Development**: `VITE_MODE=dev`
- **Production**: `VITE_MODE=prod`

## Important Notes

1. **Vite Requirement**: All environment variables must be prefixed with `VITE_` to be accessible in the frontend code.

2. **Restart Required**: After changing environment variables, restart your development server.

3. **Git Ignore**: Make sure your `.env` file is in `.gitignore` to avoid committing sensitive production URLs.

4. **Fallback**: If environment variables are not set, the system defaults to development mode.

## Example Environment Files

### Development (.env)

```bash
VITE_MODE=dev
VITE_DEV_API_BASE_URL=http://localhost:3000/api
VITE_DEV_BACKEND_URL=http://localhost:3000
VITE_PROD_API_BASE_URL=https://api.yourapp.com/api
VITE_PROD_BACKEND_URL=https://api.yourapp.com
```

### Production (.env)

```bash
VITE_MODE=prod
VITE_DEV_API_BASE_URL=http://localhost:3000/api
VITE_DEV_BACKEND_URL=http://localhost:3000
VITE_PROD_API_BASE_URL=https://api.yourapp.com/api
VITE_PROD_BACKEND_URL=https://api.yourapp.com
```

## Troubleshooting

- **URLs not updating**: Restart your development server after changing environment variables
- **Environment variables undefined**: Ensure all variables are prefixed with `VITE_`
- **Wrong base URL**: Check that `VITE_MODE` is set to either `dev` or `prod`
