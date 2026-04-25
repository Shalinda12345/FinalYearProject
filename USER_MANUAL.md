# User Manual
## Smart Business Management & Sales Forecasting System

**University of Bedfordshire — Final Year Project**
**Student:** H S Koralagamage (2521460) | **Supervisor:** Ms. Nideshika Ellepola

---

Hey there! 👋 This guide will walk you through everything you need to know to use the system — whether you're a wholesale customer placing an order, or the business owner managing everything behind the scenes.

Don't worry if you're not particularly tech-savvy. This manual is written in plain English, and every step is explained clearly. If something doesn't work the way you expect, check the [Troubleshooting](#6-troubleshooting) section at the bottom.

---

## Table of Contents

1. [What is this system?](#1-what-is-this-system)
2. [Before You Start](#2-before-you-start)
3. [Getting to the System](#3-getting-to-the-system)
4. [I'm a Customer — How do I use this?](#4-im-a-customer--how-do-i-use-this)
   - 4.1 [Creating Your Account](#41-creating-your-account)
   - 4.2 [Logging In](#42-logging-in)
   - 4.3 [Browsing the Products](#43-browsing-the-products)
   - 4.4 [Adding Items to Your Cart](#44-adding-items-to-your-cart)
   - 4.5 [Placing a Wholesale Order](#45-placing-a-wholesale-order)
   - 4.6 [Checking Your Order History](#46-checking-your-order-history)
   - 4.7 [Getting In Touch with the Business](#47-getting-in-touch-with-the-business)
5. [I'm the Admin — How do I manage things?](#5-im-the-admin--how-do-i-manage-things)
   - 5.1 [Logging into the Admin Panel](#51-logging-into-the-admin-panel)
   - 5.2 [Understanding the Dashboard](#52-understanding-the-dashboard)
   - 5.3 [Managing Your Products](#53-managing-your-products)
   - 5.4 [Handling Customer Orders](#54-handling-customer-orders)
   - 5.5 [Managing Customer Accounts](#55-managing-customer-accounts)
   - 5.6 [Using the Analytics & AI Forecast](#56-using-the-analytics--ai-forecast)
6. [Troubleshooting](#6-troubleshooting)
7. [Need Help?](#7-need-help)

---

## 1. What is this system?

This system was built to help small food production businesses run more smoothly. If the business makes products like desserts, beverages, or specialty foods and sells them in bulk to other businesses, this platform handles both sides of that relationship.

**Wholesale customers** get a straightforward online portal to browse what's available, put in their orders, and choose when they'd like delivery.

**The business owner** gets an admin panel to manage the whole operation — products, orders, customers — and importantly, an **AI-powered forecasting dashboard** that predicts future sales based on past orders. This means instead of guessing how much to produce next week, the data does the thinking for you.

---

## 2. Before You Start

You don't need to install anything to use this system — just a modern web browser (Google Chrome, Firefox, or Microsoft Edge) and an internet connection. That's it.

If you're setting up the system on a new computer for the first time, refer to the [README.md](./README.md) for the full technical setup guide.

---

## 3. Getting to the System

| Where do you want to go? | Address |
|--------------------------|---------|
| Main website (for customers) | `http://localhost:3000` |
| Admin panel (for business owner) | `http://localhost:3000/admin/login` |

> 💡 If the system is published online, your website address will look different — ask the developer or system administrator for the live URL.

---

## 4. I'm a Customer — How do I use this?

### 4.1 Creating Your Account

Before you can place any orders, you'll need to create a free account. It only takes a minute.

1. Go to the main website and click **"Register"** in the menu at the top of the page.
2. You'll see a simple form. Fill in:
   - **Username** — Pick something memorable. No spaces, please.
   - **Email address** — Use a real one, the system uses this to identify you.
   - **Password** — Make it at least 8 characters. Something you'll remember!
3. Hit the **"Register"** button.

If everything goes well, you'll see a little notification pop up saying your account was created, and you'll be taken to the login page.

> ⚠️ Already have an account with that email? You'll get an error. Just head to the login page instead.

---

### 4.2 Logging In

1. Click **"Login"** in the top menu, or go directly to `http://localhost:3000/login`.
2. Enter the **email address** and **password** you registered with.
3. Click **"Login"**.

You'll be brought back to the homepage, now logged in. You'll notice the menu changes slightly once you're in — you'll see links like "Cart" and "Dashboard" that weren't visible before.

> ⚠️ If your login fails, double-check that you're using your email address (not your username) and that your password is correct. Passwords are case-sensitive!

---

### 4.3 Browsing the Products

Click **"Products"** in the top menu to see everything the business has available.

Each product shows you:
- A photo of the product
- Its name and a short description
- The price per unit

Scroll through the page to see everything on offer. There's no pressure to buy — just have a look around!

> 💡 You need to be logged in before you can add things to your cart. If you try to add something while logged out, the system will send you to the login page first.

---

### 4.4 Adding Items to Your Cart

Found something you'd like to order? Great.

1. On the Products page, find the item you want.
2. Type in the **quantity** you'd like to order.
3. Click **"Add to Cart"**.

A small notification will pop up at the bottom of your screen confirming it's been added. You can keep browsing and adding more items — your cart builds up as you go.

To see what's in your cart, click **"Cart"** in the top menu. Here you can:
- See all the items you've added and the running total
- Remove anything you've changed your mind about by clicking the remove button next to it

---

### 4.5 Placing a Wholesale Order

Ready to finalise your order? Here's what to do:

1. Go to your Cart and make sure everything looks right.
2. Click **"Proceed to Checkout"**.
3. On the checkout page, review your items one more time.
4. Use the **date picker** to choose when you'd like your order delivered.
5. Check the final total, then click **"Place Order"**.

You'll get a confirmation notification and your cart will empty — that means the order went through successfully. The business can now see it and will begin preparing it.

> ✅ Can't remember if your order was placed? Check your Dashboard (see next section)!

---

### 4.6 Checking Your Order History

Want to see all your past orders? Click **"Dashboard"** in the top menu.

Your personal dashboard shows every order you've placed, along with:
- The order date and delivery date you chose
- A list of what was in the order and how much you ordered
- The total amount for each order

It's a handy reference if you want to re-order the same things or check when something was last delivered.

---

### 4.7 Getting In Touch with the Business

Have a question, a special request, or just want to say hello? Use the contact form.

1. Click **"Contact"** in the menu.
2. Fill in your name, email address, and your message.
3. Click **"Send Message"**.

Your message goes directly to the business owner's admin panel. They'll be able to read it and get back to you.

---

## 5. I'm the Admin — How do I manage things?

> ⚠️ This section is for the business owner and authorised staff only. Admin login is completely separate from customer accounts — you have different credentials and a different login page.

### 5.1 Logging into the Admin Panel

1. Go to `http://localhost:3000/admin/login` — **note this is different from the customer login page**.
2. Enter your **Admin Username** and **Password**.
3. Click **"Login"**.

You'll be taken straight to the Admin Dashboard.

> 💡 If you've forgotten your admin credentials, they need to be reset directly in the database. Contact the developer if this happens.

---

### 5.2 Understanding the Dashboard

When you first log in, you'll land on the Admin Dashboard. Think of it as your business at a glance.

You'll see summary cards showing things like:
- **Total Revenue** — How much money has come in from all orders
- **Total Orders** — How many orders have been placed
- **Total Customers** — How many people have registered on the platform

Below those cards, you'll see charts plotting your revenue and profit over time. It's a quick visual health-check for the business.

The left sidebar (or top menu, depending on your screen size) lets you navigate to all the different management sections.

---

### 5.3 Managing Your Products

This is where you control what customers can see and buy.

#### Viewing your current products
Click **"Products"** in the admin menu. You'll see a table of everything currently in the catalogue.

#### Adding a new product
1. Click **"Add Products"** in the menu.
2. Fill in the form:
   - **Product Name** — What customers will see
   - **Description** — A short blurb about the product
   - **Selling Price** — What you charge customers (in LKR)
   - **Cost Price** — What it actually costs you to produce it. This is used to calculate your profit.
   - **Image URL** — A web link to an image of the product
3. Click **"Add Product"**.

The product will appear in the customer catalogue straight away.

#### Editing an existing product
Go to **Products**, find the item you want to change, and click **"Edit"** next to it. Update whatever you need and save.

#### Removing a product
Click **"Delete"** next to a product to remove it. This is permanent, so only do it if you're sure.

---

### 5.4 Handling Customer Orders

Go to **"Orders"** in the admin menu.

You'll see every order placed by any customer, showing:
- Who placed the order and when
- What they ordered and in what quantities
- The delivery date they requested
- The total value of the order

Use this to coordinate your production and delivery schedule. The delivery dates are there to help you plan — if you see a big order due in three days, you know to start preparing.

> 💡 **Pro tip:** If you notice a cluster of orders all requesting delivery around the same date, that's a good signal to prepare a larger production run for that week.

---

### 5.5 Managing Customer Accounts

Go to **"Users"** in the admin menu to see everyone who has registered on the platform.

You can see each customer's username, email, and when they joined.

- To **edit** a customer's details, click **"Edit"** next to their name.
- To **delete** a customer's account, click **"Delete"**.

> ⚠️ Deleting an account removes the customer's ability to log in, but their order history will remain in the system for your records.

---

### 5.6 Using the Analytics & AI Forecast

This is the most powerful part of the admin panel. Go to **"Analytics"** in the menu.

#### Revenue & Profit Charts
The charts here show you how your business has performed over time:
- **Revenue** — The total money coming in from orders
- **Profit** — Revenue minus what it cost you to produce those products (this is why having accurate cost prices matters when adding products!)

These charts update automatically as new orders come in, so they always reflect the latest data.

#### The AI Sales Forecast
Scroll down on the Analytics page and you'll find the forecasting chart. This is where things get interesting.

The system feeds your historical order data into a machine learning model called **Facebook Prophet**, which was built specifically for predicting business trends over time. It analyses things like:
- Which products have been selling more recently
- Seasonal patterns — whether sales tend to spike at certain times of year
- Week-to-week and month-to-month trends

What you see on the chart is a prediction of future sales, with a shaded band around the line showing the range of possible outcomes.

**How to actually use this:**
- If the forecast shows a spike coming up in two weeks, start producing more of those products *now*
- If it predicts a quiet period, you might scale production back to reduce waste
- Use it as one tool alongside your own experience — the more order data the system has, the better the forecast gets

> 💡 The AI model works best when there's a good amount of historical data to learn from. If the system is brand new, the forecast will improve over time as more orders are placed.

---

## 6. Troubleshooting

Something's not working? Here are the most common issues and how to sort them out.

| What's happening | Why it might be happening | What to do |
|-----------------|--------------------------|------------|
| I can't log in | Wrong email or password | Double-check your credentials. Remember: customers use email to log in, admins use their username. |
| The products page is empty | The backend isn't running | Make sure `uvicorn` is running on port 8000 in the backend terminal |
| My cart isn't saving | You're not logged in | Log in first, then try adding items to your cart |
| The analytics page shows nothing | No orders exist yet | Place at least a couple of orders and then revisit the analytics page |
| The forecast chart isn't showing | Not enough data for the AI | The model needs a reasonable amount of historical orders to work. Keep using the system and it'll kick in. |
| Product images aren't loading | The image URL is broken | When adding a product, make sure the image link works by pasting it into your browser first |
| The whole page won't load | The frontend isn't running | Make sure `npm run dev` is still running in the frontend folder |
| Database connection errors | MySQL isn't running | Check that your MySQL service is started and the connection settings in `database.py` are correct |

---

## 7. Need Help?

If you run into something that this manual doesn't cover, or you'd like to report a bug or request a change, here's who to reach:

| | |
|--|--|
| **Developer** | H S Koralagamage |
| **Student Number** | 2521460 |
| **Academic Supervisor** | Ms. Nideshika Ellepola |
| **Institution** | University of Bedfordshire |

---

*Thanks for using the system — I hope it makes running the business a little bit easier.* 😊

*Smart Business Management & Sales Forecasting System — User Manual v1.0*
*University of Bedfordshire · BSc. (Hons) Software Engineering · Final Year Project 2026*
