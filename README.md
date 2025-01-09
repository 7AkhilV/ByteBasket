# ByteBasket

ByteBasket is an e-commerce application built with Node.js and TypeScript. It includes role-based user and admin functionality, a robust product and order management system, and a full-text search feature for seamless user experiences. The project leverages modern tools like Prisma, Zod, and Express.

---

## Features

### Role-Based Access Control (RBAC)
- **User Roles:**
  - Regular User: Can browse products, place orders, and manage their account.
  - Admin: Has full control over product and order management.

### User Management
- User registration and login functionality with bcrypt for password hashing.
- JWT-based authentication for secure API access.

### Product Management
- Add, update, delete, and list products.
- Support for searching products using full-text search.

### Order Management
- Users can place, view, and cancel orders.
- Admins can change the status of orders.
- Automatic tracking of order events for auditing purposes.

### Full-Text Search
- Users can search for products by name, description, or tags using Prisma filters.

---

## Tech Stack

### Backend
- **Node.js**: Server-side runtime environment.
- **Express**: Web framework for building RESTful APIs.
- **Prisma**: ORM for database access.
- **TypeScript**: Type-safe programming language.

### Database
- **MYSQL**: Relational database for data storage.

### Dependencies
- **bcrypt**: Secure password hashing.
- **jsonwebtoken**: Token-based authentication.
- **dotenv**: Environment variable management.
- **zod**: Schema validation for API inputs.

---

## Installation and Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/7AkhilV/ByteBasket.git
   cd ByteBasket
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   Create a `.env` file in the root directory with the following:
   ```env
   DATABASE_URL=your_database_url
   JWT_SECRET=your_jwt_secret
   PORT=portnumber
   ```

4. Run database migrations:
   ```bash
   npx prisma migrate dev
   ```



### Scripts
- **`npm start`**: Start the server.
- **`npx prisma studio`**: Launch Prisma Studio for database management.

---

## Contributing
Contributions are welcome! Feel free to submit a pull request or open an issue for any bug fixes or new features.

---

## License
This project is licensed under the [MIT License](LICENSE).

