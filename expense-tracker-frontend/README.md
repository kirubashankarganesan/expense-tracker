# Expense Tracker

A full-stack expense tracking application for managing daily expenses, categories, monthly budgets, recurring expenses, reports, and user profiles. The project is split into a React frontend, a Spring Boot REST API backend, and a MySQL database script.

## Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Core Features](#core-features)
- [Project Architecture](#project-architecture)
- [Folder Structure](#folder-structure)
- [Database Design](#database-design)
- [Backend Details](#backend-details)
- [Frontend Details](#frontend-details)
- [API Endpoints](#api-endpoints)
- [Setup and Installation](#setup-and-installation)
- [Available Scripts](#available-scripts)
- [Configuration](#configuration)
- [Testing](#testing)

## Project Overview

Expense Tracker helps users record and analyze their personal spending. Users can register, log in, create categories, add expenses, set monthly budgets, manage recurring expenses, view dashboard charts, and export reports as PDF or Excel files.

The application uses JWT-based authentication. After login, the frontend stores the token and attaches it to protected API requests through a shared Axios client.

## Tech Stack

### Frontend

- React 19
- Vite
- React Router DOM
- Axios
- Bootstrap
- Recharts
- React Icons
- React Toastify
- React Datepicker
- date-fns
- jsPDF and jsPDF AutoTable
- xlsx
- file-saver

### Backend

- Java 21
- Spring Boot 3.5
- Spring Web
- Spring Security
- Spring Data JPA
- Hibernate
- MySQL Connector/J
- JWT using JJWT
- Lombok
- ModelMapper
- Spring Validation
- Spring Mail
- Apache PDFBox
- Apache POI
- Springdoc OpenAPI / Swagger UI

### Database

- MySQL

### Build Tools

- Maven Wrapper for backend
- npm for frontend

## Core Features

- User registration and login
- JWT authentication and protected routes
- Dashboard summary for expenses
- Category-wise expense analytics
- Monthly expense analytics
- Expense CRUD operations
- Expense pagination, sorting, search, and filters
- Category CRUD operations
- Monthly budget CRUD operations
- Recurring expense management
- Toggle recurring expenses active/inactive
- User profile view and update
- PDF report export
- Excel report export
- Budget alert and recurring expense scheduler support
- Swagger API documentation

## Project Architecture

```text
Expense Tracker
|
|-- expense-tracker-frontend
|   |-- React UI
|   |-- Pages and reusable components
|   |-- Protected routes
|   |-- Auth context
|   |-- Axios API client
|
|-- expense-tracker-backend
|   |-- Spring Boot REST API
|   |-- Controllers
|   |-- Services and service implementations
|   |-- Repositories
|   |-- JPA entities
|   |-- DTOs
|   |-- JWT security
|   |-- Schedulers
|   |-- Report generation utilities
|
|-- expense-tracker-database
|   |-- MySQL database creation script
```

### Request Flow

```text
User
  -> React page/component
  -> Axios client with JWT token
  -> Spring Boot controller
  -> Service layer
  -> Repository layer
  -> MySQL database
  -> Response DTO
  -> React UI
```

### Backend Layer Responsibilities

- `controller`: Exposes REST API endpoints.
- `service`: Defines business service contracts.
- `service/impl`: Implements business logic.
- `repository`: Handles database access through Spring Data JPA.
- `entity`: Defines database models.
- `dto`: Defines request and response objects.
- `security`: Handles JWT authentication and user details.
- `config`: Contains Spring Security, CORS, and Swagger configuration.
- `scheduler`: Runs scheduled budget and recurring expense jobs.
- `util`: Contains helper classes for JWT, dates, PDF, and Excel generation.
- `exception`: Contains custom exceptions and global exception handling.

### Frontend Layer Responsibilities

- `pages`: Main route-level screens such as Dashboard, Expenses, Categories, Budgets, Reports, Profile, Settings, Login, and Register.
- `components`: Reusable UI pieces such as Navbar, Sidebar, forms, charts, and route protection.
- `context`: Authentication context and shared auth state.
- `routes`: Application route definitions.
- `services`: Shared Axios API client.
- `styles`: CSS files for app screens and components.
- `utils`: Utility helpers such as theme handling.

## Folder Structure

```text
Expense Tracker/
|
|-- README.md
|-- expense-tracker-backend/
|   |-- pom.xml
|   |-- mvnw
|   |-- mvnw.cmd
|   |-- src/
|       |-- main/
|       |   |-- java/com/expensetracker/
|       |   |   |-- config/
|       |   |   |-- controller/
|       |   |   |-- dto/
|       |   |   |-- entity/
|       |   |   |-- enums/
|       |   |   |-- exception/
|       |   |   |-- mail/
|       |   |   |-- repository/
|       |   |   |-- scheduler/
|       |   |   |-- security/
|       |   |   |-- service/
|       |   |   |-- util/
|       |   |   |-- ExpenseTrackerApplication.java
|       |   |-- resources/
|       |       |-- application.properties
|       |-- test/
|
|-- expense-tracker-frontend/
|   |-- package.json
|   |-- vite.config.js
|   |-- index.html
|   |-- public/
|   |-- src/
|       |-- components/
|       |-- context/
|       |-- pages/
|       |-- routes/
|       |-- services/
|       |-- styles/
|       |-- utils/
|       |-- App.jsx
|       |-- main.jsx
|       |-- index.css
|
|-- expense-tracker-database/
|   |-- expense_tracker.sql
```

## Database Design

The application uses a MySQL database named `expense_tracker`.

Main entities:

- `users`: Stores registered users, email, encrypted password, and role.
- `categories`: Stores user-specific expense categories.
- `expenses`: Stores expense amount, description, date, recurring flag, user, and category.
- `budgets`: Stores monthly category budget limits for each user.
- `recurring_expenses`: Stores recurring expense details, frequency, next due date, status, user, and category.

The database script is available at:

```text
expense-tracker-database/expense_tracker.sql
```

Current script:

```sql
CREATE DATABASE expense_tracker;

USE expense_tracker;
```

Tables are generated/updated by Hibernate because the backend uses:

```properties
spring.jpa.hibernate.ddl-auto=update
```

## Backend Details

Backend base URL:

```text
http://localhost:8080
```

API base URL:

```text
http://localhost:8080/api
```

Swagger UI:

```text
http://localhost:8080/swagger-ui.html
```

Security behavior:

- `/api/auth/**` is public.
- Swagger endpoints are public.
- All other endpoints require a valid JWT token.
- Passwords are encoded using BCrypt.
- The backend is stateless and uses JWT for authentication.

## Frontend Details

Frontend development URL:

```text
http://localhost:5173
```

The Axios client is configured in:

```text
expense-tracker-frontend/src/services/api.js
```

It uses this API base URL:

```text
http://localhost:8080/api
```

Protected frontend routes:

- `/`
- `/expenses`
- `/categories`
- `/budgets`
- `/reports`
- `/recurring`
- `/profile`
- `/settings`

Public frontend routes:

- `/login`
- `/register`

## API Endpoints

### Authentication

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and receive JWT token |

### Dashboard

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/api/dashboard` | Get dashboard summary |
| GET | `/api/dashboard/category` | Get category-wise expense summary |
| GET | `/api/dashboard/monthly` | Get monthly expense summary |

### Expenses

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/api/expenses` | Add expense |
| GET | `/api/expenses` | Get paginated and sorted expenses |
| GET | `/api/expenses/all` | Get all expenses |
| GET | `/api/expenses/search?keyword=value` | Search expenses |
| GET | `/api/expenses/category/{categoryId}` | Filter expenses by category |
| GET | `/api/expenses/date?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD` | Filter expenses by date range |
| PUT | `/api/expenses/{id}` | Update expense |
| DELETE | `/api/expenses/{id}` | Delete expense |

Pagination parameters supported by selected expense endpoints:

```text
page=0
size=10
sortBy=expenseDate
direction=desc
```

### Categories

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/api/categories` | Create category |
| GET | `/api/categories` | Get categories |
| PUT | `/api/categories/{id}` | Update category |
| DELETE | `/api/categories/{id}` | Delete category |

### Budgets

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/api/budgets` | Create monthly budget |
| GET | `/api/budgets` | Get budgets |
| PUT | `/api/budgets/{id}` | Update budget |
| DELETE | `/api/budgets/{id}` | Delete budget |

### Recurring Expenses

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/api/recurring-expenses` | Create recurring expense |
| GET | `/api/recurring-expenses` | Get recurring expenses |
| PUT | `/api/recurring-expenses/{id}` | Update recurring expense |
| PATCH | `/api/recurring-expenses/{id}/toggle` | Toggle active/inactive status |
| DELETE | `/api/recurring-expenses/{id}` | Delete recurring expense |

### User Profile

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/api/users/profile` | Get logged-in user profile |
| PUT | `/api/users/profile` | Update logged-in user profile |

### Reports

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/api/reports/pdf` | Download expense report as PDF |
| GET | `/api/reports/excel` | Download expense report as Excel |

## Setup and Installation

### Prerequisites

Install these before running the project:

- Java 21
- Maven or Maven Wrapper
- Node.js and npm
- MySQL Server

### 1. Clone or Open the Project

```bash
cd "C:\projects\Expense Tracker"
```

### 2. Create the Database

Open MySQL and run:

```sql
CREATE DATABASE expense_tracker;
```

Or run the script:

```text
expense-tracker-database/expense_tracker.sql
```

### 3. Configure Backend Database

Update this file if your MySQL username or password is different:

```text
expense-tracker-backend/src/main/resources/application.properties
```

Example:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/expense_tracker
spring.datasource.username=root
spring.datasource.password=your_mysql_password
```

### 4. Configure Mail

The backend includes mail support. Configure your own SMTP credentials in:

```text
expense-tracker-backend/src/main/resources/application.properties
```

Example:

```properties
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=your_email@gmail.com
spring.mail.password=your_app_password
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
```

For Gmail, use an app password instead of your normal account password.

### 5. Run the Backend

From the backend folder:

```bash
cd expense-tracker-backend
./mvnw spring-boot:run
```

On Windows PowerShell:

```powershell
cd expense-tracker-backend
.\mvnw.cmd spring-boot:run
```

Backend runs on:

```text
http://localhost:8080
```

### 6. Run the Frontend

Open another terminal:

```bash
cd expense-tracker-frontend
npm install
npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

## Available Scripts

### Frontend

Run from `expense-tracker-frontend`:

| Command | Description |
| --- | --- |
| `npm install` | Install frontend dependencies |
| `npm run dev` | Start Vite development server |
| `npm run build` | Build frontend for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |

### Backend

Run from `expense-tracker-backend`:

| Command | Description |
| --- | --- |
| `.\mvnw.cmd spring-boot:run` | Start backend on Windows |
| `./mvnw spring-boot:run` | Start backend on Linux/macOS |
| `.\mvnw.cmd test` | Run backend tests on Windows |
| `./mvnw test` | Run backend tests on Linux/macOS |
| `.\mvnw.cmd clean package` | Build backend JAR on Windows |
| `./mvnw clean package` | Build backend JAR on Linux/macOS |

## Configuration

Important backend configuration values:

| Property | Purpose |
| --- | --- |
| `spring.datasource.url` | MySQL database URL |
| `spring.datasource.username` | MySQL username |
| `spring.datasource.password` | MySQL password |
| `spring.jpa.hibernate.ddl-auto` | Controls schema generation/update |
| `server.port` | Backend server port |
| `spring.mail.*` | SMTP mail configuration |

Important frontend configuration:

| File | Purpose |
| --- | --- |
| `src/services/api.js` | Backend API base URL and JWT request interceptor |
| `src/routes/AppRoutes.jsx` | Public and protected route mapping |
| `src/context/AuthContext.jsx` | Authentication state management |

## Testing

### Backend Tests

```powershell
cd expense-tracker-backend
.\mvnw.cmd test
```

### Frontend Lint

```powershell
cd expense-tracker-frontend
npm run lint
```

## Notes for Developers

- Start MySQL before running the backend.
- Start the backend before using frontend features that call the API.
- Register or log in first to access protected pages.
- Keep mail credentials and database passwords private.
- Do not commit real passwords, app passwords, or tokens to version control.
- Use Swagger UI to inspect and test backend endpoints during development.
