# Frontend Vendors - Setup Guide

This guide will help you set up and run the vendor management portal.

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Backend API server running on `http://localhost:8000`

## Step-by-Step Setup

### 1. Install Dependencies

Navigate to the vendor frontend directory and install all required packages:

```bash
cd frontend_venders
npm install
```

This will install:
- React 18.2.0
- React Router DOM 6.20.0
- Axios 1.6.2

### 2. Update API URL (if needed)

If your backend is running on a different URL than `http://localhost:8000`, update it in:

**File**: `src/services/api.js`

```javascript
const API_BASE_URL = 'http://your-backend-url:8000';
```

### 3. Start the Development Server

```bash
npm start
```

The application will automatically open at `http://localhost:3000`

### 4. Login with Vendor Credentials

Use any vendor credentials from the backend user database:

- **Username**: Created in backend
- **Password**: Set during user creation

## Running Against Backend

Make sure your backend API is running:

```bash
# In the main ArFOOD directory
source fastapienv/bin/activate
python -m uvicorn app.main:app --reload --port 8000
```

## File Structure

```
frontend_venders/
│
├── public/
│   └── index.html                    # HTML template
│
├── src/
│   ├── context/
│   │   └── VendorAuthContext.js     # Global auth state & hooks
│   │
│   ├── pages/
│   │   ├── VendorLogin.js           # Login page component
│   │   └── VendorLogin.css          # Login page styling
│   │
│   ├── services/
│   │   └── api.js                    # Axios API client & endpoints
│   │
│   ├── App.js                        # Main app component with routing
│   ├── App.css                       # Dashboard & global styles
│   ├── index.js                      # React entry point
│   └── index.css                     # Base styles
│
├── package.json                      # Dependencies & scripts
├── README.md                         # Project documentation
├── SETUP_GUIDE.md                    # This file
└── .gitignore                        # Git ignore rules
```

## Available Routes

- `/login` - Vendor login page (public)
- `/dashboard` - Vendor dashboard (protected)
- `/` - Redirects to dashboard or login

## Authentication Flow Diagram

```
1. User opens /login
   ↓
2. Enters username & password
   ↓
3. Submits form → API POST /auth/token
   ↓
4. Backend returns access_token
   ↓
5. Token stored in localStorage
   ↓
6. Vendor data fetched from GET /User/view_user
   ↓
7. Redirected to /dashboard
   ↓
8. Dashboard displays vendor profile
```

## Key Features

### Login Component (`VendorLogin.js`)
- Form validation
- Error handling
- Loading state with spinner
- Responsive design
- Smooth animations

### Auth Context (`VendorAuthContext.js`)
- Global authentication state management
- Token persistence in localStorage
- Automatic user data loading
- Login/Logout methods
- Vendor data update capability

### API Service (`api.js`)
- Axios instance with interceptors
- Automatic token injection in headers
- Auth endpoints
- User endpoints

### Dashboard (`App.js`)
- Protected routes
- User profile display
- Logout functionality
- Loading screen during auth check

## Common Tasks

### Getting Vendor Data

```javascript
import { useVendorAuth } from './context/VendorAuthContext';

function MyComponent() {
  const { vendor } = useVendorAuth();
  
  return (
    <div>
      <p>Username: {vendor?.username}</p>
      <p>Email: {vendor?.email}</p>
    </div>
  );
}
```

### Logging Out

```javascript
import { useVendorAuth } from './context/VendorAuthContext';

function LogoutButton() {
  const { logout } = useVendorAuth();
  
  return <button onClick={logout}>Logout</button>;
}
```

### Checking Authentication Status

```javascript
import { useVendorAuth } from './context/VendorAuthContext';

function MyComponent() {
  const { isAuthenticated, loading } = useVendorAuth();
  
  if (loading) return <div>Loading...</div>;
  
  if (!isAuthenticated) return <div>Please login</div>;
  
  return <div>Welcome!</div>;
}
```

## Troubleshooting

### Port Already in Use

If port 3000 is already in use:

```bash
# On macOS/Linux
lsof -i :3000
kill -9 <PID>

# Or use a different port
PORT=3001 npm start
```

### API Connection Issues

1. Verify backend is running on `http://localhost:8000`
2. Check CORS is enabled in backend
3. Check API_BASE_URL in `src/services/api.js`

### Authentication Not Working

1. Verify username and password are correct
2. Check browser console for error messages
3. Clear localStorage and try again:
   ```javascript
   localStorage.clear();
   ```

### CSS Not Loading

```bash
npm install
npm start
```

## Production Build

Create optimized production build:

```bash
npm run build
```

Output will be in the `build/` directory.

## Environment Variables

Create a `.env` file in the root for environment-specific settings:

```
REACT_APP_API_URL=http://localhost:8000
REACT_APP_ENV=development
```

Then use in code:

```javascript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
```

## Support

For issues or questions:
1. Check the README.md
2. Review error messages in browser console
3. Verify backend API is running
4. Check network tab in browser dev tools

## Next Steps

- Add vendor menu management
- Add order management
- Add profile edit functionality
- Add vendor analytics dashboard
- Add notification system
