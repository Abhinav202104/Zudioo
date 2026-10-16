# CineStore — MERN E-Commerce (Glassmorphism + Cinematic UI)

## Run
Prereq: Node 18+, MongoDB running locally (or an Atlas URI).

```bash
# Terminal 1 — API
cd server && cp .env.example .env && npm install && npm run seed && npm run dev

# Terminal 2 — UI
cd client && npm install && npm run dev
```
Open http://localhost:5173

Seeded admin: admin@cinestore.com / admin123 — or register a new user.
Admin panel: /admin (update order status → customer sees live tracking).

## Stack
- Frontend: React (Vite), React Router, Context API (auth + cart), custom CSS
- Backend: Express, Mongoose, JWT, bcryptjs
- DB: MongoDB — collections: users, products, orders

## API
| Method | Route | Access |
|---|---|---|
| POST | /api/auth/register, /api/auth/login | public |
| GET | /api/auth/me | user |
| GET | /api/products?q=&category=&sort= , /api/products/:id | public |
| POST/PUT/DELETE | /api/products(/:id) | admin |
| POST | /api/orders | user |
| GET | /api/orders/mine, /api/orders/:id | user |
| GET | /api/orders, PUT /api/orders/:id/status | admin |
