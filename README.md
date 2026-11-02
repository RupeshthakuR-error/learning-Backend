# Backend Tutorial: Node.js, Express & MongoDB REST API

[![Node.js Version](https://img.shields.io/badge/Node.js-v24.x-green.svg)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-4.21.x-blue.svg)](https://expressjs.com/)
[![MongoDB Atlas](https://img.shields.io/badge/MongoDB-Atlas-brightgreen.svg)](https://www.mongodb.com/cloud/atlas)
[![Mongoose](https://img.shields.io/badge/Mongoose-8.9.x-red.svg)](https://mongoosejs.com/)
[![License: ISC](https://img.shields.io/badge/License-ISC-yellow.svg)](https://opensource.org/licenses/ISC)

> Complete step-by-step backend project demonstrating RESTful API development, CRUD operations, MVC/MRC design pattern, MongoDB Atlas database integration, environment configuration, and Postman API testing. Built for the **3rd College Evaluation (B.Tech Computer Science & Engineering)**.

---

## 📋 Table of Contents
- [1. Project Overview](#1-project-overview)
- [2. Technologies Used](#2-technologies-used)
- [3. Project Architecture & Directory Structure](#3-project-architecture--directory-structure)
- [4. MongoDB Atlas Setup Guide](#4-mongodb-atlas-setup-guide)
- [5. Installation & Setup](#5-installation--setup)
- [6. Environment Variables (.env)](#6-environment-variables-env)
- [7. Running the Application](#7-running-the-application)
- [8. API Endpoints Reference](#8-api-endpoints-reference)
- [9. Example Requests & Responses](#9-example-requests--responses)
- [10. Postman Testing Guide](#10-postman-testing-guide)
- [11. Viva / Evaluation Q&A](#11-viva--evaluation-qa)

---

## 1. Project Overview

This project implements a production-ready RESTful CRUD API service for managing **Items** in an online inventory/catalog system. It adheres to clean code standards and follows the **Model-Route-Controller (MRC)** architectural pattern.

### Key Features:
- **CREATE**: Add new items with schema validation and automatic timestamps.
- **READ (All)**: Fetch all items with support for search filters, category filtering, and sorting.
- **READ (Single)**: Fetch item details by 24-character hexadecimal MongoDB ObjectId.
- **UPDATE**: Modify existing items with real-time validation.
- **DELETE**: Remove items from the database with immediate confirmation.
- **Robust Error Handling**: Standardized JSON responses for 400 Bad Request, 404 Not Found, and 500 Server Errors.
- **Secure Configuration**: Database connection strings and sensitive keys are managed via `.env` and kept out of version control.

---

## 2. Technologies Used

| Technology | Purpose |
| :--- | :--- |
| **Node.js** (v24.x) | JavaScript asynchronous runtime environment |
| **Express.js** (v4.21.x) | Fast, minimalist backend web framework |
| **MongoDB Atlas** | Fully-managed cloud NoSQL database service |
| **Mongoose** (v8.9.x) | Object Data Modeling (ODM) library for MongoDB |
| **dotenv** | Loads environment variables from `.env` file |
| **cors** | Enables Cross-Origin Resource Sharing |
| **Nodemon** | Hot-reloading development server tool |
| **Postman** | API development and automated testing platform |

---

## 3. Project Architecture & Directory Structure

```text
backend-project/
│
├── config/
│   └── db.js                 # MongoDB Atlas connection logic via Mongoose
│
├── controllers/
│   └── itemController.js     # Business logic & request handlers for CRUD APIs
│
├── models/
│   └── Item.js               # Mongoose schema and model definition with validation
│
├── routes/
│   └── itemRoutes.js         # Express route endpoints mapped to controllers
│
├── tests/
│   └── testApi.js            # Automated verification test script
│
├── .env                      # Local secret environment variables (Git-ignored)
├── .env.example              # Template showing required environment variables
├── .gitignore                # Specifies intentionally untracked files
├── package.json              # Project manifest, dependencies, and npm scripts
├── postman_collection.json   # Ready-to-import Postman test collection
├── server.js                 # Express server entry point & middleware configuration
└── README.md                 # Complete project documentation
```

---

## 4. MongoDB Atlas Setup Guide

To connect the application to MongoDB Atlas, follow these simple steps:

1. **Create an Atlas Account**:
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and register for a free account.
2. **Create a Free Shared Cluster**:
   - Select **M0 Free Tier** (Cloud Provider: AWS / Google Cloud, nearest Region).
   - Click **Create Cluster**.
3. **Create Database User Credentials**:
   - Go to **Database Access** under Security.
   - Click **Add New Database User**.
   - Choose **Password** authentication.
   - Enter a username (e.g., `adminUser`) and a secure password (avoid special characters like `@` or `:` in password, or URL-encode them).
   - Set privileges to **Read and write to any database**.
   - Click **Add User**.
4. **Configure Network Access (IP Whitelist)**:
   - Go to **Network Access** under Security.
   - Click **Add IP Address**.
   - Select **Allow Access From Anywhere** (`0.0.0.0/0`) for development.
   - Click **Confirm**.
5. **Get Connection String**:
   - Go to **Database** -> Click **Connect** on your cluster.
   - Choose **Drivers** (Node.js).
   - Copy the connection string format:
     ```text
     mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/backendTutorialDB?retryWrites=true&w=majority
     ```
   - Replace `<username>` and `<password>` with your database user credentials.
   - Specify your database name (e.g. `backendTutorialDB`) before the `?`.

---

## 5. Installation & Setup

### Prerequisites
- Node.js (v18 or higher recommended)
- Git installed on your system
- Postman (for manual API testing)

### Clone & Install
```bash
# Clone the repository
git clone <YOUR_PUBLIC_GITHUB_REPO_URL>

# Navigate into project directory
cd backend-project

# Install all dependencies
npm install
```

---

## 6. Environment Variables (.env)

Create a file named `.env` in the root of the project by copying `.env.example`:

```bash
cp .env.example .env
```

Add your specific configuration:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://yourUsername:yourPassword@cluster0.xyz.mongodb.net/backendTutorialDB?retryWrites=true&w=majority
```

> ⚠️ **IMPORTANT**: Never commit your `.env` file to Git. The `.gitignore` file is already configured to keep your secrets private.

---

## 7. Running the Application

### Development Mode (with hot-reload)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

### Run Automated API Tests
```bash
npm test
```

When started, you will see:
```text
========================================
 Server is running on port 5000
 Environment: development
 Health Check: http://localhost:5000/
 Items API:    http://localhost:5000/api/items
========================================
========================================
 MongoDB Connected Successfully!
 Host: cluster0-shard-00-00.xyz.mongodb.net
 Database: backendTutorialDB
========================================
```

---

## 8. API Endpoints Reference

| HTTP Method | Endpoint | Description | Status Code |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | Health check & API documentation overview | `200 OK` |
| `POST` | `/api/items` | Create a new item | `201 Created` |
| `GET` | `/api/items` | Get all items (supports search, category, sort) | `200 OK` |
| `GET` | `/api/items/:id` | Get single item by MongoDB ObjectId | `200 OK` / `404` |
| `PUT` | `/api/items/:id` | Update existing item fields by ID | `200 OK` / `404` |
| `DELETE` | `/api/items/:id` | Delete item permanently by ID | `200 OK` / `404` |

---

## 9. Example Requests & Responses

### 1. Create Item (`POST /api/items`)
**Request Body (JSON):**
```json
{
  "name": "Dell XPS 15 Laptop",
  "description": "15.6 inch OLED, Intel i9, 32GB RAM, 1TB SSD",
  "price": 1499.99,
  "category": "Electronics",
  "inStock": true
}
```
**Response (201 Created):**
```json
{
  "success": true,
  "message": "Item created successfully",
  "data": {
    "_id": "65cb7fa2e4138e937d1109a1",
    "name": "Dell XPS 15 Laptop",
    "description": "15.6 inch OLED, Intel i9, 32GB RAM, 1TB SSD",
    "price": 1499.99,
    "category": "Electronics",
    "inStock": true,
    "createdAt": "2026-11-02T16:15:00.000Z",
    "updatedAt": "2026-11-02T16:15:00.000Z",
    "__v": 0
  }
}
```

### 2. Get All Items (`GET /api/items`)
**Query Parameters:**
- Search: `GET /api/items?search=laptop`
- Category: `GET /api/items?category=Electronics`
- Sort: `GET /api/items?sortBy=price_asc`

**Response (200 OK):**
```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "_id": "65cb7fa2e4138e937d1109a1",
      "name": "Dell XPS 15 Laptop",
      "description": "15.6 inch OLED, Intel i9, 32GB RAM, 1TB SSD",
      "price": 1499.99,
      "category": "Electronics",
      "inStock": true,
      "createdAt": "2026-11-02T16:15:00.000Z",
      "updatedAt": "2026-11-02T16:15:00.000Z"
    }
  ]
}
```

### 3. Update Item (`PUT /api/items/65cb7fa2e4138e937d1109a1`)
**Request Body (JSON):**
```json
{
  "price": 1399.99,
  "inStock": false
}
```
**Response (200 OK):**
```json
{
  "success": true,
  "message": "Item updated successfully",
  "data": {
    "_id": "65cb7fa2e4138e937d1109a1",
    "name": "Dell XPS 15 Laptop",
    "description": "15.6 inch OLED, Intel i9, 32GB RAM, 1TB SSD",
    "price": 1399.99,
    "category": "Electronics",
    "inStock": false,
    "updatedAt": "2026-11-02T16:20:00.000Z"
  }
}
```

### 4. Delete Item (`DELETE /api/items/65cb7fa2e4138e937d1109a1`)
**Response (200 OK):**
```json
{
  "success": true,
  "message": "Item deleted successfully",
  "data": {
    "id": "65cb7fa2e4138e937d1109a1",
    "name": "Dell XPS 15 Laptop"
  }
}
```

### 5. Error Responses
- **Missing Required Fields (400 Bad Request):**
  ```json
  {
    "success": false,
    "message": "Please provide all required fields: name, description, and price."
  }
  ```
- **Invalid ID Format (400 Bad Request):**
  ```json
  {
    "success": false,
    "message": "Invalid ID format: '123'. Must be a 24-character hexadecimal string."
  }
  ```
- **Item Not Found (404 Not Found):**
  ```json
  {
    "success": false,
    "message": "Item with ID '65cb7fa2e4138e937d1109a1' not found"
  }
  ```

---

## 10. Postman Testing Guide

1. Open **Postman**.
2. Click **Import** (top left).
3. Select the file `postman_collection.json` located inside this repository.
4. The collection **"Backend Tutorial - Items CRUD API"** will be imported with all requests pre-configured.
5. Make sure your local server is running (`npm run dev`).
6. Execute requests in order:
   - **0. Health Check** (Returns 200 OK)
   - **1. CREATE - Add New Item** (Automatically stores `_id` into the `itemId` variable)
   - **2. CREATE - Add Second Item**
   - **3. CREATE - Error Test (400)**
   - **4. READ ALL - Get All Items**
   - **5. READ ALL - Search by Keyword**
   - **6. READ ALL - Filter by Category**
   - **7. READ BY ID - Get Single Item**
   - **8. READ BY ID - Invalid ID Format Test (400)**
   - **9. READ BY ID - Not Found Test (404)**
   - **10. UPDATE - Update Item by ID**
   - **11. DELETE - Delete Item by ID**
   - **12. DELETE - Confirm Deletion (404)**

---

## 11. Viva / Evaluation Q&A

**Q1: What is Express middleware?**
> *Answer:* Middleware functions are functions that have access to the request (`req`), response (`res`), and the `next` function in the application's request-response cycle. They can execute code, modify request/response objects, end the cycle, or call `next()`. Examples used here: `express.json()` for parsing JSON bodies, and `cors()`.

**Q2: What is Mongoose?**
> *Answer:* Mongoose is an Object Data Modeling (ODM) library for MongoDB and Node.js. It manages relationships between data, provides schema validation, and translates between objects in code and the representation of those objects in MongoDB.

**Q3: What is the purpose of `.env`?**
> *Answer:* `.env` keeps sensitive configuration details (like MongoDB Atlas connection strings with passwords and API keys) out of source code. It is excluded from Git via `.gitignore` to prevent credential leaks.

**Q4: What is the difference between `PUT` and `PATCH`?**
> *Answer:* `PUT` is used to replace or update the entire entity with the provided representation, whereas `PATCH` is used to apply partial modifications to a resource.

**Q5: What are HTTP status codes 200, 201, 400, 404, 500?**
> *Answer:*
> - `200 OK`: Request succeeded.
> - `201 Created`: Request succeeded and a new resource was created.
> - `400 Bad Request`: Server could not understand the request due to invalid client syntax/validation error.
> - `404 Not Found`: Server cannot find the requested resource.
> - `500 Internal Server Error`: Server encountered an unexpected condition.
