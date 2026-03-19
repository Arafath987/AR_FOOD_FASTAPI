# ArFood Vendors Frontend

This is the vendor management portal for ArFood Restaurant. Vendors can log in to view and manage their profile information.

## Features

- **Vendor Authentication**: Secure login using backend user router
- **Profile Management**: View vendor details (username, email, designation, phone)
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Session Management**: Persistent login with token-based authentication

## Project Structure

```
frontend_venders/
├── public/
│   └── index.html
├── src/
│   ├── context/
│   │   └── VendorAuthContext.js    # Auth context and hooks
│   ├── pages/
│   │   ├── VendorLogin.js          # Login page component
│   │   └── VendorLogin.css         # Login page styles
│   ├── services/
│   │   └── api.js                  # API calls to backend
│   ├── App.js                      # Main app component
│   ├── App.css                     # App styles
│   ├── index.js                    # React DOM render
│   └── index.css                   # Global styles
├── package.json
└── README.md
```

## Getting Started

### Installation

1. Navigate to the project directory:
```bash
cd frontend_venders
```

2. Install dependencies:
```bash
npm install
```

### Running the Vendor Portal

Start the development server:
```bash
npm start
```

The application will open at `http://localhost:3000`

### Building for Production

```bash
npm run build
```

## API Integration

The vendor portal communicates with the backend using these endpoints:

### Authentication
- **POST** `/auth/token` - Login with username and password

### User Data
- **GET** `/User/view_user` - Get all users (to fetch vendor data)
- **PUT** `/User/update_user/{username}` - Update vendor profile
- **DELETE** `/User/delete_user/{username}` - Delete vendor account

## Authentication Flow

1. User enters credentials on the login page
2. App calls `/auth/token` endpoint with form data
3. Backend returns access token
4. Token is stored in localStorage as `vendor_access_token`
5. User is fetched from `/User/view_user` endpoint
6. User is redirected to dashboard on successful login

## Context Hook Usage

```javascript
import { useVendorAuth } from './context/VendorAuthContext';

function MyComponent() {
  const { vendor, login, logout, updateVendorData, isAuthenticated } = useVendorAuth();
  
  // Use vendor data and methods
}
```

## Environment Configuration

Update the API base URL in `src/services/api.js`:
```javascript
const API_BASE_URL = 'http://localhost:8000'; // Change as needed
```

## Responsive Breakpoints

- **Desktop**: > 768px
- **Tablet**: 481px - 768px
- **Mobile**: ≤ 480px

## Technologies Used

- React 18.2.0
- React Router DOM 6.20.0
- Axios 1.6.2
- CSS3 with Responsive Design

## Authentication Token Storage

- Token is stored in: `localStorage.vendor_access_token`
- Username is stored in: `localStorage.vendor_username`
- Tokens are automatically included in API requests via axios interceptor

## Notes

- The vendor portal uses the same backend user router as the customer portal
- Make sure the backend server is running on port 8000 (or update the API_BASE_URL)
- Clear browser localStorage if you want to force re-login
- Protected routes redirect unauthenticated users to login page
