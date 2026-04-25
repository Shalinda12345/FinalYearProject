# Smart Business Management & Sales Forecasting System

<div align="center">

![Project Logo](./logo.png)

### Helping food businesses stop guessing and start knowing.

*A full-stack web application that brings together real-time wholesale order management and AI-powered sales forecasting — built specifically for small food production businesses.*

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-Python-009688?logo=fastapi)](https://fastapi.tiangolo.com/)
[![MySQL](https://img.shields.io/badge/MySQL-Database-4479A1?logo=mysql)](https://www.mysql.com/)
[![Prophet](https://img.shields.io/badge/Facebook-Prophet-0668E1?logo=meta)](https://facebook.github.io/prophet/)

</div>

---

## 👋 What is this project?

If you've ever run a small food business, you know the struggle: you make too much and half of it spoils, or you don't make enough and miss out on sales. This project was built to fix that.

**Smart Business Management & Sales Forecasting System** is my final year project for the BSc. (Hons) Software Engineering programme at the University of Bedfordshire. It's a complete web platform for food production SMEs that gives business owners:

- A clean **B2B ordering portal** where wholesale clients can browse products and place orders
- A fully-featured **admin dashboard** to manage everything from products to customers
- An **AI forecasting engine** (powered by Facebook Prophet) that predicts future demand based on real order history — so the owner can plan production intelligently instead of guessing

The goal is simple: less food waste, more revenue, and smarter business decisions.

---

## ✨ What can it do?

### For Customers (Wholesale Buyers)
- Create an account and log in securely
- Browse the product catalogue with images and prices
- Add products to cart and place bulk orders with a delivery date
- Track all past orders from a personal dashboard
- Send inquiries through a contact form

### For the Business Owner (Admin)
- Manage the entire product catalogue — add, edit, or remove products
- View and process all incoming orders
- Manage registered customer accounts
- See real-time analytics: revenue trends, profit tracking
- Get **AI-generated sales forecasts** based on historical data — displayed as beautiful, interactive charts

---

## 🏗️ How it's built

Here's a quick look at how the pieces fit together:

```
┌──────────────────────────┐          ┌──────────────────────────┐
│   Next.js Frontend       │  ◄────►  │   FastAPI Backend        │
│   (what users see)       │  API     │   (business logic + AI)  │
│   Port 3000              │          │   Port 8000              │
└──────────────────────────┘          └────────────┬─────────────┘
                                                   │
                                            SQLAlchemy ORM
                                                   │
                                      ┌────────────▼─────────────┐
                                      │      MySQL Database       │
                                      │   (stores everything)     │
                                      └──────────────────────────┘
```

The frontend talks to the backend through a REST API. The backend handles all the business logic, authentication, and runs the Prophet forecasting model when the analytics page is loaded.

---

## 🛠️ Tech Stack

| Layer | Technology | Why I chose it |
|-------|-----------|----------------|
| **Frontend** | Next.js 15 + TypeScript | Fast, modern React framework with great routing |
| **Styling** | Tailwind CSS | Rapid, consistent UI development |
| **Backend** | FastAPI (Python) | Fast, async, auto-generates API docs — perfect for a data-heavy app |
| **Database ORM** | SQLAlchemy | Clean abstraction over raw SQL, easy to work with |
| **Database** | MySQL | Reliable relational database, great for structured business data |
| **Authentication** | JWT + Bcrypt | Industry-standard secure authentication |
| **Data Validation** | Pydantic | Automatic request/response validation — saves a lot of bugs |
| **AI Forecasting** | Facebook Prophet + Pandas | Purpose-built for time-series forecasting with seasonal trends |
| **Notifications** | Sonner | Smooth, non-intrusive toast notifications |

---

## ✅ Prerequisites

Before you set up the project, make sure you have these installed:

- **Node.js** v18 or higher (and npm)
- **Python** 3.10 or higher
- **MySQL** 8.0 or higher — make sure it's running
- **Git**

No Docker required. This runs natively on your machine.

---

## 🚀 Getting Started

### Step 1 — Clone the project

```bash
git clone https://github.com/your-username/FinalYearProject.git
cd FinalYearProject
```

### Step 2 — Set up the database

Open your MySQL client (MySQL Workbench, TablePlus, or the command line) and run:

```sql
CREATE DATABASE auth_db;
```

Then import the provided schema:

```bash
mysql -u root -p auth_db < auth_db.sql
```

This will create all the tables and any seed data you need to get started.

### Step 3 — Set up the backend

```bash
cd backend

# Create a virtual environment (keeps dependencies isolated)
python -m venv venv

# Activate it
venv\Scripts\activate        # Windows
source venv/bin/activate     # macOS / Linux

# Install all Python dependencies
pip install -r requirements.txt
```

Now open `backend/app/database.py` and update the database connection string with your MySQL credentials:

```python
SQLALCHEMY_DATABASE_URL = "mysql+pymysql://root:your_password@localhost/auth_db"
```

### Step 4 — Set up the frontend

```bash
cd frontend
npm install
```

That's all the setup done!

---

## ▶️ Running the App

You'll need two terminal windows running at the same time.

**Terminal 1 — Start the backend:**

```bash
cd backend
venv\Scripts\activate    # or source venv/bin/activate on Mac/Linux
uvicorn app.main:app --reload
```

**Terminal 2 — Start the frontend:**

```bash
cd frontend
npm run dev
```

Now open your browser and go to **http://localhost:3000** — you should see the homepage!

> The interactive API documentation (Swagger UI) is also available at **http://localhost:8000/docs** — useful for testing endpoints directly.

---

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/register` | Register a new customer account |
| `POST` | `/login` | Customer login — returns a JWT token |
| `POST` | `/admin/login` | Admin login — separate from customer auth |

### Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/products` | List all available products |
| `POST` | `/products` | Create a new product (admin only) |
| `PUT` | `/products/{id}` | Update an existing product (admin only) |
| `DELETE` | `/products/{id}` | Remove a product (admin only) |

### Cart & Orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/cart` | Get the current user's cart |
| `POST` | `/cart` | Add an item to the cart |
| `DELETE` | `/cart/{id}` | Remove a specific cart item |
| `POST` | `/orders` | Place an order from the current cart |
| `GET` | `/orders` | Retrieve all orders (admin only) |

### Analytics & AI Forecasting
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/analytics/revenue` | Revenue data over time |
| `GET` | `/analytics/profit` | Profit over time (revenue minus costs) |
| `GET` | `/analytics/forecast` | AI sales forecast via Facebook Prophet |

### User Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/users` | List all customers (admin only) |
| `PUT` | `/users/{id}` | Update a customer account |
| `DELETE` | `/users/{id}` | Delete a customer account |

---

## 🗄️ Database Schema

| Table | What it stores |
|-------|----------------|
| `users` | Customer accounts (username, email, hashed password) |
| `admin_users` | Admin accounts (separate table, username + hashed password) |
| `products` | The product catalogue (name, description, selling price, cost price, image) |
| `cart_items` | Temporary cart storage per user |
| `orders` | Order header records (who ordered, when, total, delivery date) |
| `order_items` | Line items for each order (what was ordered, quantity, price at purchase) |
| `contact_inquiries` | Messages submitted through the contact form |

---

## 📁 Project Structure

```
FinalYearProject/
│
├── auth_db.sql                  # Full database schema + any seed data
├── README.md                    # This file
├── USER_MANUAL.md               # End-user guide
│
├── backend/
│   ├── requirements.txt         # Python dependencies
│   └── app/
│       ├── main.py              # App entry point, CORS setup, router registration
│       ├── models.py            # Database table definitions (SQLAlchemy)
│       ├── schemas.py           # Request/response shapes (Pydantic)
│       ├── database.py          # DB connection configuration
│       ├── core/
│       │   └── security.py      # JWT creation, password hashing/verification
│       ├── api/routers/
│       │   ├── auth.py          # Login & registration logic
│       │   ├── products.py      # Product CRUD
│       │   ├── cart.py          # Cart operations
│       │   ├── orders.py        # Order placement & retrieval
│       │   ├── users.py         # User management
│       │   ├── contact.py       # Contact form
│       │   └── analytics.py     # Revenue, profit & forecasting
│       └── salesForecastingModel/
│           └── ...              # Facebook Prophet integration
│
└── frontend/
    ├── app/
    │   ├── page.tsx             # Landing / home page
    │   ├── layout.tsx           # Root layout, global Toaster
    │   ├── products/            # Product catalogue page
    │   ├── cart/                # Shopping cart
    │   ├── checkout/            # Order checkout flow
    │   ├── login/               # Customer login
    │   ├── register/            # New customer registration
    │   ├── client-dashboard/    # Customer order history
    │   ├── about/               # About page
    │   ├── contact/             # Contact form
    │   └── admin/
    │       ├── login/           # Admin-only login page
    │       ├── admin-dashboard/ # Overview stats
    │       ├── products/        # Product management table
    │       ├── add-products/    # Add product form
    │       ├── orders/          # All orders management
    │       ├── users/           # Customer account management
    │       └── analytics/       # Charts + AI forecast view
    ├── components/
    │   └── layout/
    │       └── NavigationBar.tsx  # Shared nav with auth state
    └── public/
        └── images/              # Product images served locally
```

---

## 👨‍💻 About the Developer

This project was built by **H S Koralagamage** (Student No. 2521460) as a final year project for the BSc. (Hons) Software Engineering programme at the **University of Bedfordshire**, under the supervision of **Ms. Nideshika Ellepola**.

It's the result of months of planning, designing, building, debugging, and learning — and represents a genuine attempt to solve a real problem faced by local food businesses.

---

*Thanks for reading! If you're reviewing this as part of the academic assessment, I hope the code and documentation reflect the work that went into it.* 🙏
