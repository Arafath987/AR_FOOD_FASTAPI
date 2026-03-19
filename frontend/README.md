# ArFood Frontend

A React-based management system frontend for the ArFood API.

## Features

- **User Management**: Create, view, update, and delete users
- **Items Management**: Manage food items and categories
- **Orders Management**: Create and view orders
- **Recent Orders**: Track recently completed orders
- **Authentication**: Secure login with JWT token management
- **Responsive UI**: Mobile-friendly minimal interface

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- The backend FastAPI server running on `http://localhost:8000`

## Installation

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

## Running the Application

### Development Mode

Start the development server:
```bash
npm start
```

The app will open in your browser at `http://localhost:3000`.

### Production Build

Create an optimized production build:
```bash
npm build
```

## Project Structure

```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Login.js           # Login page component
│   │   ├── Dashboard.js       # Main dashboard
│   │   ├── UserManagement.js  # User management component
│   │   ├── ItemsManagement.js # Items & categories component
│   │   ├── OrdersManagement.js# Orders component
│   │   ├── OrderRecentManagement.js # Recent orders component
│   │   └── *.css              # Component styles
│   ├── services/
│   │   └── api.js             # Axios API configuration
│   ├── App.js                 # Main app component
│   ├── index.js               # React entry point
│   └── index.css              # Global styles
├── package.json
└── README.md
```

## API Configuration

The frontend is configured to connect to the backend at `http://localhost:8000`. 

To change the API URL, edit the `API_BASE_URL` in `src/services/api.js`:

```javascript
const API_BASE_URL = 'http://localhost:8000';
```

## Key Features

### Authentication
- Login with username and password
- Token stored in localStorage
- Automatic token injection in API requests

### Components

#### Login Component
- Secure login form
- Error handling
- Form validation

#### Dashboard
- Tabbed navigation
- User management
- Items & categories management
- Orders management
- Recent orders tracking

#### Management Components
- Create, read, update, delete operations
- Form validation
- Error and success notifications
- Data tables with responsive design

## Styling

The application uses minimal CSS for a clean, professional look:
- Global styles in `index.css`
- Component-specific styles in `*.css` files
- Responsive design with mobile support

## Troubleshooting

### CORS Errors
If you encounter CORS errors, ensure the backend is running with proper CORS configuration:
```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### API Connection Issues
1. Verify the backend is running on `http://localhost:8000`
2. Check network tab in browser DevTools
3. Verify API endpoints match backend routes

## Default Credentials

You'll need to create a user through the backend first, then use those credentials to log in through the frontend.

## License

MIT
