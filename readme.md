<div align="center">

# PCShop

Basic e-commerce web app for browsing PC hardware, managing carts, and fulfilling orders.

</div>

## About

PCShop is a full-stack demo storefront targeting desktop parts and accessories. It provides the usual customer experience (catalog browsing, product detail, cart checkout) plus a lightweight admin back office for inventory and order management. The stack is intentionally familiar—Spring Boot on the backend and React + Vite + Tailwind CSS on the frontend—so that the project can serve as a learning or hiring sample.

## Features

- Product catalog with brand/category filtering, image galleries, and rich descriptions
- Customer authentication, comment threads, and localized status labels
- Shopping cart, checkout from cart, and order tracking with pagination
- Admin dashboard for updating order status, editing shipping info, and reviewing history
- Shared API layer that wraps responses in a consistent `ApiResponse` envelope

## Tech Stack

| Layer    | Tech                                                                 |
|----------|----------------------------------------------------------------------|
| Backend  | Java Spring Boot (Corretto 24.0.2), Spring Security, Spring Data JPA |
| Database | MySQL                                                                |
| Frontend | React 18, Vite, Tailwind CSS, shadcn/ui, Sonner toast                |
| Tooling  | Maven, npm                                                           |

## Prerequisites

- JDK 24+ (Amazon Corretto 24.0.2 recommended)
- Maven 3.9+
- MySQL 8.x with a database named `pcshop`
- Node.js 18+ and npm

## Backend Setup

1. Create a MySQL database (default name `pcshop`).
2. Copy `pcshopbackend/pcshop/src/main/resources/application.yml.example` to `application.yml` (or edit the existing file) and set your credentials:

	```yml
	spring.datasource.url=jdbc:mysql://localhost:3306/pcshop
	spring.datasource.username=<your-user>
	spring.datasource.password=<your-password>
	spring.jpa.hibernate.ddl-auto=update
	api.prefix=main-api
	```

3. (Optional) Load the sample data: `mysql -u <user> -p pcshop < sample_database.sql`.
4. From the backend root, run the API (pick one):

	```bash
	# Using Maven
	cd pcshopbackend/pcshop
	mvn spring-boot:run

	# Or from IntelliJ IDEA: open the project and run PcshopApplication.
	```

The service listens on `http://localhost:8080/main-api` by default.

## Frontend Setup

1. Install dependencies:

	```bash
	cd pcshopfrontend
	npm install
	```

2. Provide environment settings if needed (`src/config/env.js`). The default points to `http://localhost:8080/main-api`.
3. Start the dev server:

	```bash
	npm run dev
	```

4. Visit the Vite dev URL (usually `http://localhost:5173`).

## Project Structure

```
PCShop/
├── pcshopbackend/        # Spring Boot service
│   └── src/main/java/... # Controllers, services, entities, DTOs
├── pcshopfrontend/       # React + Vite app
│   ├── src/pages         # Pages (home, product, orders, admin, etc.)
│   ├── src/components    # UI building blocks and dialogs
│   └── src/services      # API wrappers sharing a common request helper
├── addsampledata.sql     # Optional seed data
└── readme.md             # This file
```

## Development Notes

- API responses are wrapped in `ApiResponse`, so frontend services unwrap via `responseObject` / `response_object` helpers.
- Authentication relies on JWTs stored in localStorage; `apiRequest` automatically forwards the token.
- When adding new endpoints, prefer updating the shared service wrapper under `pcshopfrontend/src/services/api.js` so headers/prefixes stay consistent.

## License & Contributions

This project is intended as a learning/reference implementation. Feel free to fork and adapt it; contributions are welcome via pull requests.
