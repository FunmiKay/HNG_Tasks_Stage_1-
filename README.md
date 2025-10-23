# HNG_Tasks_Stage_1-

# String Analyzer Service

A RESTful API service that analyzes strings and stores their computed properties. Built for HNG Task 1 - Backend Wizards Stage 1.

## Features

- _String Analysis_: Computes length, palindrome status, unique characters, word count, SHA-256 hash, and character frequency
- _RESTful API_: Full CRUD operations with proper HTTP status codes
- _Advanced Filtering_: Query strings with multiple filter options
- _Natural Language Processing_: Filter strings using natural language queries
- _In-Memory Storage_: Fast, lightweight storage for development and testing

## API Endpoints

### 1. Create/Analyze String

POST /strings
Content-Type: application/json

Request Body:
{
"value": "string to analyze"
}

_Success Response (201 Created):_
json
{
"id": "sha256_hash_value",
"value": "string to analyze",
"properties": {
"length": 17,
"is_palindrome": false,
"unique_characters": 12,
"word_count": 3,
"sha256_hash": "abc123...",
"character_frequency_map": {
"s": 2,
"t": 3,
"r": 2
}
},
"created_at": "2025-01-27T10:00:00Z"
}

_Error Responses:_

- 409 Conflict: String already exists
- 400 Bad Request: Missing or invalid "value" field
- 422 Unprocessable Entity: Invalid data type for "value"

### 2. Get Specific String

GET /strings/{string_value}

_Success Response (200 OK):_
json
{
"id": "sha256_hash_value",
"value": "requested string",
"properties": { /_ same as above _/ },
"created_at": "2025-01-27T10:00:00Z"
}

_Error Response:_

- 404 Not Found: String does not exist

### 3. Get All Strings with Filtering

GET /strings?is_palindrome=true&min_length=5&max_length=20&word_count=2&contains_character=a

_Query Parameters:_

- is_palindrome: boolean (true/false)
- min_length: integer (minimum string length)
- max_length: integer (maximum string length)
- word_count: integer (exact word count)
- contains_character: string (single character to search for)

_Success Response (200 OK):_
json
{
"data": [
{
"id": "hash1",
"value": "string1",
"properties": { /* ... */ },
"created_at": "2025-01-27T10:00:00Z"
}
],
"count": 15,
"filters_applied": {
"is_palindrome": true,
"min_length": 5,
"max_length": 20,
"word_count": 2,
"contains_character": "a"
}
}

### 4. Natural Language Filtering

GET /strings/filter-by-natural-language?query=all%20single%20word%20palindromic%20strings

_Supported Natural Language Queries:_

- "all single word palindromic strings" → word_count=1, is_palindrome=true
- "strings longer than 10 characters" → min_length=11
- "palindromic strings that contain the first vowel" → is_palindrome=true, contains_character=a
- "strings containing the letter z" → contains_character=z

_Success Response (200 OK):_
json
{
"data": [ /* array of matching strings */ ],
"count": 3,
"interpreted_query": {
"original": "all single word palindromic strings",
"parsed_filters": {
"word_count": 1,
"is_palindrome": true
}
}
}

### 5. Delete String

DELETE /strings/{string_value}

_Success Response (204 No Content):_ Empty response body

_Error Response:_

- 404 Not Found: String does not exist

## Setup Instructions

### Prerequisites

- Node.js (version 18.0.0 or higher)
- npm (comes with Node.js)
- MongoDB (version 4.4 or higher) - Local installation or MongoDB Atlas account

### Installation

1. _Clone the repository:_
   bash
   git clone <repository-url>
   cd hng-task-1

2. _Install dependencies:_
   bash
   npm install

3. _Set up environment variables:_
   bash
   cp env.example .env

   Edit .env file with your MongoDB connection string:

   MONGODB_URI=mongodb://localhost:27017/string-analyzer
   PORT=3000

4. _Start MongoDB:_

   - _Local MongoDB:_ Ensure MongoDB is running on your system
   - _MongoDB Atlas:_ Use your Atlas connection string in the .env file

5. _Start the development server:_
   bash
   npm run dev

6. _Start the production server:_
   bash
   npm start

### Environment Variables

Required environment variables:

- MONGODB_URI: MongoDB connection string (default: mongodb://localhost:27017/string-analyzer)
- PORT: Server port (default: 3000)

Example .env file:

MONGODB_URI=mongodb://localhost:27017/string-analyzer
PORT=3000

For MongoDB Atlas (cloud):

MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/string-analyzer
PORT=3000

## Dependencies

### Production Dependencies

- _express_: Web framework for Node.js
- _cors_: Cross-Origin Resource Sharing middleware
- _helmet_: Security middleware
- _morgan_: HTTP request logger
- _crypto_: Node.js built-in crypto module for SHA-256 hashing
- _mongoose_: MongoDB object modeling for Node.js
- _dotenv_: Environment variable loader

### Development Dependencies

- _nodemon_: Development server with auto-restart
- _jest_: Testing framework
- _supertest_: HTTP assertion library for testing
- _mongodb-memory-server_: In-memory MongoDB for testing

### Base URL

- Local: http://localhost:3000
- Production: https://your-domain.com

### Response Format

All responses follow a consistent format:

_Success Responses:_

- 200 OK: Successful GET requests
- 201 Created: Successful POST requests
- 204 No Content: Successful DELETE requests

_Error Responses:_
json
{
"error": "Error Type",
"message": "Human-readable error message"
}
