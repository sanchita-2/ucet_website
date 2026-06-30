## Important EndPoints (wrt controllers)

## Auth Controller

| Method   | Endpoint                 | Description               | Request Body                     |
| -------- | ------------------------ | ------------------------- | -------------------------------- |
| **POST** | `/auth/register`         | Register a new student    | `name`, `email`, `password`, ... |
| **POST** | `/auth/login`            | Login user                | `email`, `password`              |
| **POST** | `/auth/logout`           | Logout user               | None (uses refresh token cookie) |
| **POST** | `/auth/forgot-password`  | Send password reset OTP   | `email`                          |
| **POST** | `/auth/verify-reset-otp` | Verify password reset OTP | `email`, `otp`                   |
| **POST** | `/auth/reset-password`   | Reset password            | `email`, `password`              |

endpoints are:

| Method | URL                                           |
| ------ | --------------------------------------------- |
| POST   | `http://localhost:5000/auth/register`         |
| POST   | `http://localhost:5000/auth/login`            |
| POST   | `http://localhost:5000/auth/logout`           |
| POST   | `http://localhost:5000/auth/forgot-password`  |
| POST   | `http://localhost:5000/auth/verify-reset-otp` |
| POST   | `http://localhost:5000/auth/reset-password`   |

### Example Register Request

**POST**

```http
http://localhost:5000/auth/register
```

**Body (JSON)**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Password@123"
}
```

### Example Login Request

**POST**

```http
http://localhost:5000/auth/login
```

```json
{
  "email": "john@example.com",
  "password": "Password@123"
}
```

### Example Forgot Password

**POST**

```http
http://localhost:5000/auth/forgot-password
```

```json
{
  "email": "john@example.com"
}
```

### Example Verify OTP

**POST**

```http
http://localhost:5000/auth/verify-reset-otp
```

```json
{
  "email": "john@example.com",
  "otp": "123456"
}
```

### Example Reset Password

**POST**

```http
http://localhost:5000/auth/reset-password
```

```json
{
  "email": "john@example.com",
  "password": "NewPassword@123"
}
```

### Example Logout

**POST**

```http
http://localhost:5000/auth/logout
```

Since your logout controller uses:

```ts
const refreshToken = req.cookies.refreshToken;
```

the request must include the `refreshToken` cookie.