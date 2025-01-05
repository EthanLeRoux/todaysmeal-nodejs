# Internal Code Documentation: Node.js Server

[Linked Table of Contents](#linked-table-of-contents)

## Linked Table of Contents

* [1. Overview](#1-overview)
* [2. Setup and Dependencies](#2-setup-and-dependencies)
* [3. Server Configuration](#3-server-configuration)
    * [3.1 CORS Configuration](#31-cors-configuration)
* [4. Routing](#4-routing)
* [5. Middleware](#5-middleware)
* [6. Server Start](#6-server-start)


## 1. Overview

This document details the architecture and functionality of the Node.js server application.  The server handles requests for user authentication, file uploads, post management, and likes using a RESTful API architecture.  It leverages Express.js for routing and request handling and uses Handlebars for templating (though templating logic is not shown in this snippet).


## 2. Setup and Dependencies

The server utilizes several key Node.js packages:

| Package          | Description                                      |
|-----------------|--------------------------------------------------|
| `express`        | Web application framework                           |
| `dotenv`         | Loads environment variables from a `.env` file      |
| `cors`           | Enables Cross-Origin Resource Sharing (CORS)         |
| `body-parser`    | Parses incoming request bodies                     |
| `userRoutes`     | Routes for user-related endpoints                  |
| `signupRoutes`   | Routes for user signup endpoints                    |
| `loginRoutes`    | Routes for user login endpoints                     |
| `homeRoutes`     | Routes for home page                             |
| `fileRoutes`     | Routes for file management endpoints                |
| `postRoutes`     | Routes for post management endpoints                 |
| `likeRoutes`     | Routes for like management endpoints                 |


These packages are installed using npm (Node Package Manager) and are listed in the `package.json` file (not included here).


## 3. Server Configuration

The server is configured using environment variables loaded from a `.env` file via the `dotenv` package.  The `dotenv.config()` function loads these variables into the `process.env` object.  Crucially, the server's port and CORS allowed origins are defined here.

### 3.1 CORS Configuration

The server uses the `cors` middleware to enable Cross-Origin Resource Sharing.  The configuration allows requests from the origin specified in the `process.env.CORS_ALLOWED_URL` environment variable, supporting GET, POST, PUT, and DELETE methods.  `credentials: true` allows sending cookies with requests.  This is important for authentication.  The configuration looks as follows:

```javascript
app.use(cors({
    origin: `${process.env.CORS_ALLOWED_URL}`,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));
```


## 4. Routing

The server uses Express.js routing to handle different API endpoints. Each route is handled by a separate module. The following table summarizes the routing:

| Route Prefix      | Module          | Description                               |
|-------------------|-----------------|-------------------------------------------|
| `/api/users/edit` | `userRoutes`     | Handles user update requests.             |
| `/api/users/signup`| `signupRoutes`   | Handles user signup requests.              |
| `/api/users/login` | `loginRoutes`    | Handles user login requests.               |
| `/api/files`      | `fileRoutes`     | Handles file upload and retrieval requests. |
| `/api/posts`      | `postRoutes`     | Handles post creation, retrieval, and updates. |
| `/api/likes`      | `likeRoutes`     | Handles like actions on posts.              |
| `/`               | `homeRoutes`     | Handles requests to the root URL.           |


## 5. Middleware

The server uses several middleware functions:

* `cors()`: Enables CORS as detailed above.
* `express.json()`: Parses JSON request bodies.
* `bodyParser.json()`:  Provides additional body parsing capabilities (redundant with `express.json()` in this case, one should likely be removed).


## 6. Server Start

The server listens on the port specified by the `PORT` environment variable or defaults to port 5000.  The `app.listen()` function starts the server and logs a message to the console indicating the port number.

```javascript
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
```
