# ArFood Project - Complete Setup Guide

## Overview

ArFood is a restaurant management system with:
- **Backend**: FastAPI with async SQLAlchemy
- **Frontend**: React with Axios
- **Database**: MySQL

## Prerequisites

### System Requirements
- Node.js v14+ (for frontend)
- Python 3.8+ (for backend)
- MySQL Server running
- npm or yarn (for frontend)

### Required Packages
Backend packages are already in your `fastapienv` virtual environment.
Frontend packages will be installed when you run `npm install`.

---

## Backend Setup

### 1. Activate Virtual Environment
```bash
cd /Users/yaserarafath/programming/fast\ api/ArFOOD
source fastapienv/bin/activate
```

### 2. Install/Verify Backend Dependencies
```bash
pip install fastapi uvicorn sqlalchemy aiomysql python-dotenv
```

### 3. Update Database Configuration
Edit `app/database.py` if needed to match your MySQL credentials:
```python
SQL_DATABASE_URL = "mysql+aiomysql://root:test1234!@127.0.0.1:3306/AR_FOOD_DATABASE"
```

### 4. Run Backend Server
```bash
uvicorn app.main:app --reload
```

The backend will be available at `http://localhost:8000`
API docs: `http://localhost:8000/docs`

---

## Frontend Setup

### 1. Navigate to Frontend Directory
```bash
cd frontend
```

### 2. Install Dependencies
```bash
npm install
```

This will install:
- react@^18.2.0
- react-dom@^18.2.0
- axios@^1.6.0
- react-scripts@5.0.1

### 3. Start Development Server
```bash
npm start
```

The frontend will open at `http://localhost:3000`

---

## Full Application Startup

### Terminal 1: Backend
```bash
cd /Users/yaserarafath/programming/fast\ api/ArFOOD
source fastapienv/bin/activate
uvicorn app.main:app --reload
```

### Terminal 2: Frontend
```bash
cd /Users/yaserarafath/programming/fast\ api/ArFOOD/frontend
npm start
```

---

## Project Structure

```
ArFOOD/
├── app/
│   ├── models/          # SQLAlchemy models
│   ├── router/          # API endpoints
│   ├── schemas/         # Pydantic schemas
│   ├── database.py      # Async database configuration
│   └── main.py          # FastAPI app entry point
├── frontend/            # React application
│   ├── public/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── services/    # Axios API service
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
└── fastapienv/          # Python virtual environment
```

---

## API Endpoints

### Authentication
- `POST /auth/token` - Login and get access token

### Users
- `POST /User/create_user` - Create new user
- `GET /User/view_user` - Get all users
- `PUT /User/update_user/{username}` - Update user
- `DELETE /User/delete_user/{username}` - Delete user

### Items
- `GET /items/items` - Get all items
- `GET /items/categories` - Get all categories
- `POST /items/categories` - Create category
- `POST /items/items/{category_name}` - Create item
- `GET /items/items/with-category` - Get items with categories
- `GET /items/items/by-category/{category_name}` - Get items by category

### Orders
- `GET /orders/orders` - Get all orders
- `POST /orders/orders` - Create order
- `GET /orders/order-items` - Get all order items
- `GET /orders/order-items/{order_id}` - Get order items by order ID
- `POST /orders/order-items` - Create order item

### Recent Orders
- `GET /order_item_recent/order_item_recent/view` - Get recent orders
- `POST /order_item_recent/order_items_recent/create/{order_id}` - Create recent order
- `DELETE /order_item_recent/order_item_recent/delete/{order_id}` - Delete recent order
- `DELETE /order_item_recent/order_item_recent` - Delete all recent orders

---

## Usage

### 1. Create a User
1. Go to Frontend Login page
2. You need to create user via backend or API
3. Use the API docs: `http://localhost:8000/docs`

### 2. Login
1. Use your username and password on the login page
2. Token will be stored in localStorage

### 3. Manage Users
Navigate to "Users" tab:
- Create new users
- View all users
- Delete users

### 4. Manage Items
Navigate to "Items" tab:
- Create categories
- Create items with categories
- View all items

### 5. Manage Orders
Navigate to "Orders" tab:
- Create new orders
- View order items
- Track orders

### 6. Recent Orders
Navigate to "Recent Orders" tab:
- View recently completed orders
- Delete orders

---

## Testing APIs with Frontend

The frontend is set up to:
1. Automatically include JWT token in all requests
2. Handle authentication errors
3. Display success/error messages
4. Manage form states

---

## Troubleshooting

### Backend Issues

**MySQL Connection Error**
```
Check database credentials in app/database.py
Ensure MySQL server is running
```

**Module Not Found Errors**
```bash
# Activate virtual environment
source fastapienv/bin/activate
# Install missing packages
pip install -r requirements.txt
```

### Frontend Issues

**npm install fails**
```bash
# Clear npm cache
npm cache clean --force
# Try again
npm install
```

**Can't connect to backend**
1. Verify backend is running on port 8000
2. Check CORS is enabled in main.py
3. Check browser console for errors

**Port already in use**
```bash
# Kill process on port 3000 (frontend)
lsof -ti:3000 | xargs kill -9

# Kill process on port 8000 (backend)
lsof -ti:8000 | xargs kill -9
```

---

## Environment Variables

Create a `.env` file in the frontend (optional):
```
REACT_APP_API_URL=http://localhost:8000
```

In `src/services/api.js`, use:
```javascript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
```

---

## Performance Tips

1. **Backend**: The async setup allows handling multiple requests concurrently
2. **Frontend**: React DevTools extension helps debug components
3. **Database**: Ensure indexes on frequently queried columns

---

## Next Steps

1. Test all endpoints using the frontend
2. Add data validation enhancements
3. Implement pagination for large datasets
4. Add more advanced filtering options
5. Deploy to production

---

## Support

For issues or questions:
1. Check the component files in `frontend/src/components/`
2. Review API configuration in `frontend/src/services/api.js`
3. Check backend logs in terminal

---

## Version Info

- FastAPI: 0.100+
- React: 18.2.0
- Axios: 1.6.0
- SQLAlchemy: async
- Python: 3.8+
- Node: 14+
