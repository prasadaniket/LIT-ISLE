# LIT ISLE Digital Library API Documentation

## Overview
The LIT ISLE Digital Library API provides comprehensive functionality for managing books, users, reviews, reading progress, highlights, and more.

## Base URL
```
http://localhost:4000/api
```

## Authentication
Most endpoints require authentication via JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## API Endpoints

### 1. User Management (`/api/users`)

#### Register User
- **POST** `/api/users/register`
- **Body:**
```json
{
  "username": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "user" // optional: "user", "author", "admin"
}
```

#### Login User
- **POST** `/api/users/login`
- **Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get User Profile
- **GET** `/api/users/profile`
- **Headers:** Authorization required

#### Update User Profile
- **PUT** `/api/users/profile`
- **Headers:** Authorization required
- **Body:**
```json
{
  "name": "John Doe",
  "bio": "Book lover",
  "website": "https://johndoe.com",
  "socialMedia": {
    "twitter": "@johndoe",
    "instagram": "@johndoe"
  },
  "genres": ["Fiction", "Mystery"]
}
```

### 2. Book Management (`/api/books`)

#### Get All Books
- **GET** `/api/books`
- **Query Parameters:**
  - `page` (optional): Page number (default: 1)
  - `limit` (optional): Items per page (default: 10)
  - `genre` (optional): Filter by genre
  - `author` (optional): Filter by author
  - `search` (optional): Search in title, author, description
  - `sortBy` (optional): Sort field (default: createdAt)
  - `sortOrder` (optional): asc/desc (default: desc)

#### Get Book by ID
- **GET** `/api/books/:id`

#### Create Book
- **POST** `/api/books/create`
- **Headers:** Authorization required
- **Content-Type:** multipart/form-data
- **Body:**
  - `title`: Book title
  - `author`: Author name
  - `genre`: Book genre
  - `publishedYear`: Publication year
  - `description`: Book description
  - `isbn` (optional): ISBN number
  - `language` (optional): Language (default: English)
  - `pages` (optional): Number of pages
  - `fileType` (optional): pdf/epub/mobi/txt (default: pdf)
  - `image`: Cover image file
  - `bookFile`: Book file (PDF, EPUB, MOBI, TXT)

#### Update Book
- **PUT** `/api/books/:id`
- **Headers:** Authorization required

#### Delete Book
- **DELETE** `/api/books/:id`
- **Headers:** Authorization required

### 3. Reading Features (`/api/reading`)

#### Add Highlight/Bookmark
- **POST** `/api/reading/highlight`
- **Headers:** Authorization required
- **Body:**
```json
{
  "bookId": "book_id_here",
  "highlightedText": "Text to highlight",
  "noteText": "Personal note (optional)",
  "pageNumber": 15,
  "chapterNumber": 2,
  "position": {
    "start": 100,
    "end": 150
  },
  "color": "yellow",
  "tags": ["important", "quote"],
  "isBookmark": false
}
```

#### Get Book Highlights
- **GET** `/api/reading/book/:bookId/highlights`
- **Headers:** Authorization required
- **Query Parameters:**
  - `page` (optional): Page number
  - `limit` (optional): Items per page
  - `type` (optional): all/highlights/bookmarks

#### Update Highlight
- **PUT** `/api/reading/highlight/:highlightId`
- **Headers:** Authorization required
- **Body:**
```json
{
  "noteText": "Updated note",
  "color": "blue",
  "tags": ["updated"],
  "isPublic": true
}
```

#### Delete Highlight
- **DELETE** `/api/reading/highlight/:highlightId`
- **Headers:** Authorization required

#### Add to Favorites
- **POST** `/api/reading/favorites`
- **Headers:** Authorization required
- **Body:**
```json
{
  "bookId": "book_id_here"
}
```

#### Download Book
- **GET** `/api/reading/download/:bookId`
- **Headers:** Authorization required
- **Response:** File download

#### Get Reading Progress
- **GET** `/api/reading/progress/:bookId`
- **Headers:** Authorization required

#### Update Reading Progress
- **PUT** `/api/reading/progress`
- **Headers:** Authorization required
- **Body:**
```json
{
  "bookId": "book_id_here",
  "currentPage": 50,
  "totalPages": 200,
  "percentage": 25
}
```

### 4. Reviews (`/api/reviews`)

#### Add Review
- **POST** `/api/reviews`
- **Headers:** Authorization required
- **Body:**
```json
{
  "bookId": "book_id_here",
  "rating": 5,
  "reviewText": "Great book!"
}
```

#### Get Book Reviews
- **GET** `/api/reviews/book/:bookId`
- **Query Parameters:**
  - `page` (optional): Page number
  - `limit` (optional): Items per page

#### Get User Reviews
- **GET** `/api/reviews/user`
- **Headers:** Authorization required

#### Update Review
- **PUT** `/api/reviews/:reviewId`
- **Headers:** Authorization required

#### Delete Review
- **DELETE** `/api/reviews/:reviewId`
- **Headers:** Authorization required

### 5. Shelf Management (`/api/shelf`)

#### Add to Shelf
- **POST** `/api/shelf/add`
- **Headers:** Authorization required
- **Body:**
```json
{
  "bookId": "book_id_here",
  "shelfType": "saved" // saved, reading, finished, wishlist
}
```

#### Remove from Shelf
- **DELETE** `/api/shelf/remove/:bookId`
- **Headers:** Authorization required

#### Get User Shelf
- **GET** `/api/shelf`
- **Headers:** Authorization required
- **Query Parameters:**
  - `shelfType` (optional): Filter by shelf type
  - `page` (optional): Page number
  - `limit` (optional): Items per page

#### Track Progress
- **PUT** `/api/shelf/progress`
- **Headers:** Authorization required
- **Body:**
```json
{
  "bookId": "book_id_here",
  "progress": 75,
  "currentPage": 150,
  "totalPages": 200
}
```

#### Create Playlist
- **POST** `/api/shelf/playlist`
- **Headers:** Authorization required
- **Body:**
```json
{
  "name": "My Reading List",
  "description": "Books I want to read",
  "bookIds": ["book1", "book2", "book3"]
}
```

#### Get Playlists
- **GET** `/api/shelf/playlists`
- **Headers:** Authorization required

### 6. Author Features (`/api/authors`)

#### Get Author Dashboard
- **GET** `/api/authors/dashboard`
- **Headers:** Authorization required (Author role)

#### Upload Book
- **POST** `/api/authors/upload`
- **Headers:** Authorization required (Author role)
- **Content-Type:** multipart/form-data

#### Get Author Books
- **GET** `/api/authors/books`
- **Headers:** Authorization required (Author role)

#### Get Book Analytics
- **GET** `/api/authors/analytics/:bookId`
- **Headers:** Authorization required (Author role)

## Response Format

All API responses follow this format:

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description"
}
```

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## File Upload Limits

- **Cover Images:** 5MB maximum
- **Book Files:** 50MB maximum
- **Supported Book Formats:** PDF, EPUB, MOBI, TXT
- **Supported Image Formats:** JPG, PNG, GIF, WebP

## Rate Limiting

- **General API:** 100 requests per 15 minutes per IP
- **File Uploads:** 10 requests per hour per user
- **Download:** 20 downloads per hour per user

## Error Handling

The API uses centralized error handling with detailed error messages and appropriate HTTP status codes. All errors are logged for debugging purposes.

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Input validation and sanitization
- File type validation
- Rate limiting
- CORS protection
- SQL injection prevention (MongoDB)

## Getting Started

1. **Register a user account**
2. **Login to get authentication token**
3. **Use the token in Authorization header for protected endpoints**
4. **Start exploring books and building your digital library!**

## Support

For API support or questions, contact the development team or check the project documentation.
