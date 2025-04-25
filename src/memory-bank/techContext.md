# Technical Context: API Veille Informationnelle

## Core Technologies
- **Backend Framework:** Node.js with Express.js (`express`)
- **Database:** MySQL (`mysql2`) - *Inferred from dependency, needs confirmation by checking `config/db.js`.*
- **Authentication:** JSON Web Tokens (JWT) (`jsonwebtoken`) with password hashing (`bcrypt`)
- **RSS Parsing:** `rss-parser` library
- **API Documentation:** Swagger (`swagger-jsdoc`, `swagger-ui-express`)
- **Environment Variables:** `dotenv` for configuration management
- **CORS:** `cors` middleware for handling Cross-Origin Resource Sharing

## Project Structure
- **`server.js`:** Main application entry point.
- **`config/`:** Configuration files (database connection `db.js`, Swagger setup `swagger.js`).
- **`controllers/`:** Request handling logic, interacts with services and models.
- **`models/`:** Database schema definitions/interactions (e.g., `users.model.js`, `articles.model.js`).
- **`routes/`:** API endpoint definitions, mapping URLs to controllers.
- **`services/`:** Business logic, potentially interacting with external services or complex operations (e.g., `rssFeeds.service.js`).
- **`middleware/`:** Functions executed before controllers (e.g., token validation `verifyTokenValidity.js`).

## Development Setup (Assumed)
- Requires Node.js and npm installed.
- Run `npm install` in `src/app` to install dependencies.
- Requires a MySQL database instance.
- Environment variables likely configured in a `.env` file in `src/app` (based on `dotenv` usage).

## Dependencies
*(See `src/app/package.json` for a full list)*
- `bcrypt`: Password hashing.
- `cors`: Enable CORS.
- `dotenv`: Load environment variables.
- `express`: Web framework.
- `jsonwebtoken`: JWT implementation.
- `mysql2`: MySQL database driver.
- `rss-parser`: Parse RSS/Atom feeds.
- `swagger-jsdoc`: Generate Swagger spec from JSDoc.
- `swagger-ui-express`: Serve Swagger UI.

## Potential Technical Constraints/Considerations
- Scalability of RSS fetching (frequency, number of feeds).
- Database performance with potentially large numbers of articles.
- Security implications of handling external feed data.
- Rate limiting for API endpoints.
