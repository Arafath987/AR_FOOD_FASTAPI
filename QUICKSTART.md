# Quick Start Instructions

## 1. Backend Setup (Terminal 1)

```bash
cd /Users/yaserarafath/programming/fast\ api/ArFOOD
source fastapienv/bin/activate
pip install aiomysql  # If not already installed
uvicorn app.main:app --reload
```

**Output should show:**
```
Uvicorn running on http://127.0.0.1:8000
```

## 2. Frontend Setup (Terminal 2)

```bash
cd /Users/yaserarafath/programming/fast\ api/ArFOOD/frontend
npm install  # Only needed first time
npm start
```

**Browser will open at:**
```
http://localhost:3000
```

## 3. Create a Test User

1. Open: `http://localhost:8000/docs`
2. Scroll to `POST /User/create_user`
3. Click "Try it out"
4. Enter JSON:
```json
{
  "username": "testuser",
  "email": "test@example.com",
  "designation": "Manager",
  "phone_number": "1234567890",
  "password": "testpass123"
}
```
5. Click Execute

## 4. Login to Frontend

1. Go to `http://localhost:3000`
2. Enter:
   - Username: `testuser`
   - Password: `testpass123`
3. Click Login

## 5. Use the Application

- **Users Tab**: Create, view, delete users
- **Items Tab**: Manage items and categories
- **Orders Tab**: Create and view orders
- **Recent Orders**: Track completed orders

---

## Shutting Down

**Terminal 1 (Backend):** `Ctrl + C`
**Terminal 2 (Frontend):** `Ctrl + C`

---

## Common Issues

| Issue | Solution |
|-------|----------|
| `ModuleNotFoundError` | `pip install aiomysql` |
| `npm command not found` | Install Node.js from nodejs.org |
| `Connection refused` | Ensure MySQL is running |
| `CORS error` | Restart backend (CORS is enabled) |

---

Enjoy! 🚀
