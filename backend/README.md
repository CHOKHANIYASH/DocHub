# API Documentation

## Table of Contents

- [User API](#user-api)
  - [Sign Up User](#sign-up-user)
  - [Update User](#update-user)
  - [Delete User](#delete-user)
- [Document API](#document-api)
  - [Get Documents by User ID](#get-documents-by-user-id)
  - [Create Document](#create-document)
  - [Get Document by ID](#get-document-by-id)
  - [Update Document](#update-document)
  - [Update Document Access List](#update-document-access-list)
  - [Delete Document](#delete-document)
- [Image API](#image-api)
  - [Upload Image](#upload-image)

---

## User API

### Base URL: `/api/user`

### Endpoints

#### 1. Sign Up User

- **URL:** `/signup`
- **Method:** `POST`
- **Description:** Registers a new user.
- **Request Body:**
  ```json
  {
    "username": "string",
    "email": "string",
    "firstName": "string",
    "lastName": "string",
    "avatar": "string",
    "userId": "string"
  }
  ```
- **Response:**
  - **Status Code:** 201 (Created) or relevant status based on response.
  - **Body:** Response message with user details or error.

#### 2. Update User

- **URL:** `/update/:userId`
- **Method:** `POST`
- **Description:** Updates user information.
- **Request Body:**
  ```json
  {
    "user": {
      "username": "string",
      "email": "string",
      "firstName": "string",
      "lastName": "string",
      "avatar": "string"
    }
  }
  ```
- **Response:**
  - **Status Code:** 200 (Success) or relevant status based on response.
  - **Body:** Response with updated user details or error.

#### 3. Delete User

- **URL:** `/delete/:userId`
- **Method:** `POST`
- **Description:** Deletes a user.
- **Response:**
  - **Status Code:** 200 (Success) or relevant status based on response.
  - **Body:** Response confirming deletion or error.

---

## Document API

### Base URL: `/api/document`

### Endpoints

#### 1. Get Documents by User ID

- **URL:** `/user/:userId`
- **Method:** `GET`
- **Description:** Retrieves all documents created by a specific user.
- **Response:**
  - **Status Code:** 200 (Success)
  - **Body:** List of documents or error.

#### 2. Create Document

- **URL:** `/user/:userId/create`
- **Method:** `POST`
- **Description:** Creates a new document for a user.
- **Response:**
  - **Status Code:** 201 (Created) or relevant status based on response.
  - **Body:** Response with document details or error.

#### 3. Get Document by ID

- **URL:** `/:docId`
- **Method:** `GET`
- **Description:** Retrieves a document by its ID.
- **Headers:**
  - `Authorization`: Bearer `<access_token>`
- **Response:**
  - **Status Code:** 200 (Success)
  - **Body:** Document details or error.

#### 4. Update Document

- **URL:** `/:docId/update`
- **Method:** `POST`
- **Description:** Updates the content of a document.
- **Request Body:**
  ```json
  {
    "document": {
      "content": "string",
      "title": "string",
      "description": "string"
    }
  }
  ```
- **Headers:**
  - `Authorization`: Bearer `<access_token>`
- **Response:**
  - **Status Code:** 200 (Success)
  - **Body:** Updated document or error.

#### 5. Update Document Access List

- **URL:** `/:docId/update/accesslist`
- **Method:** `POST`
- **Description:** Updates the access list for a document.
- **Request Body:**
  ```json
  {
    "accessType": "string",
    "allowedUsers": ["userId1", "userId2"]
  }
  ```
- **Headers:**
  - `Authorization`: Bearer `<access_token>`
- **Response:**
  - **Status Code:** 200 (Success)
  - **Body:** Updated access list or error.

#### 6. Delete Document

- **URL:** `/:docId/delete`
- **Method:** `POST`
- **Description:** Deletes a document.
- **Request Body:**
  ```json
  {
    "userId": "string"
  }
  ```
- **Headers:**
  - `Authorization`: Bearer `<access_token>`
- **Response:**
  - **Status Code:** 200 (Success)
  - **Body:** Document deleted confirmation or error.

---

## Image API

### Base URL: `/api/image`

### Endpoints

#### 1. Upload Image

- **URL:** `/upload`
- **Method:** `POST`
- **Description:** Uploads one or more images to the server and stores them in S3.
- **Request Files:**
  - **Key:** `images` - Array of images to upload
- **Response:**
  - **Status Code:** 200 (Success)
  - **Body:** List of image URLs or error.

---

**Note:** For routes that require an access token, it must be provided in the `Authorization` header in the format `Bearer <access_token>`.
