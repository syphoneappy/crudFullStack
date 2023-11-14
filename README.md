# CRUD APPLICATION

## Introduction

Welcome to the **CRUD APPLICATION**. This API provides user management and task tracking functionality, allowing you to seamlessly integrate these features into application. this project is build on the django rest framework and react.


## Installation guide 

Brief description or introduction of your project.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Endpoint](#Endpoint)

## Prerequisites

- Docker installed on your machine.

## Installation

1. **Clone the Repository:**
   ```bash
  [ git clone https://github.com/your-username/your-project.git](https://github.com/syphoneappy/crudFullStack.git)
  
   cd crudFullStack

   docker-compose up --build

## localinstallation 

1. **Clone the Repository:**
   ```bash
  [ git clone https://github.com/your-username/your-project.git](https://github.com/syphoneappy/crudFullStack.git)

- cd crudFullStack
- pipenv shell
- pipenv run pip install -r requirements.txt
- gunicorn 'backendproj.wsgi' --bind=0.0.0.0:8000


## Endpoints

### 1. Create User

- **URL:** `/create_user`
- **Method:** `POST`
- **Description:** Create a new user.
- **Parameters:**
  - `username` (string): User's username.
  - `first name` (string) : User's first name
  - `last name` (string) : User's last name
  - `email` (string): User's email.
  - `password` (string): User's password.

### 2. Check Email Availability

- **URL:** `/check_get_email`
- **Method:** `GET`
- **Description:** Check if the provided email is available.
- **Parameters:**
  - `email` (string): Email to check.

### 3. Check User Availability

- **URL:** `/check_get_user`
- **Method:** `GET`
- **Description:** Check if the provided username is available.
- **Parameters:**
  - `user` (string): Username to check.

### 4. User Login

- **URL:** `/login_user`
- **Methods:** `POST`
- **Description:** Log in a user and provide an access token.
- **Parameters:**
  - `username` (string): User's username or email.
  - `password` (string): User's password.

### 5. Create Task

- **URL:** `/create_task`
- **Method:** `POST`
- **Description:** Create a new task for the authenticated user.
- **Parameters:**
  - `name` (string): Task name.
  - `description` (string): Task description.

### 6. Get User Tasks

- **URL:** `/get_tasks`
- **Method:** `GET`
- **Description:** Retrieve tasks for the authenticated user.

### 7. Delete Task

- **URL:** `/delete_task/<int:pk>`
- **Method:** `DELETE`
- **Description:** Delete a task with the specified ID.
- **Parameters:**
  - `pk` (integer): Task ID.

### 8. Update Task

- **URL:** `/update_task/<int:pk>`
- **Method:** `PUT`
- **Description:** Update a task with the specified ID.
- **Parameters:**
  - `pk` (integer): Task ID.
  - `name` (string): Updated task name.
  - `description` (string): Updated task description.

### 9. Check Token Validity

- **URL:** `/check_token_validity`
- **Method:** `GET`
- **Description:** Check if the user's access token is valid.

### 10. Refresh Access Token

- **URL:** `/refresh_access_token`
- **Method:** `POST`
- **Description:** Refresh the user's access token using the expired access token.
- **Parameters:**
  - `expired_access_token` (string): Expired access token.

### 11. Search User Tasks

- **URL:** `/get_tasks_search`
- **Method:** `GET`
- **Description:** Search tasks for the authenticated user based on a query.
- **Parameters:**
  - `search` (string): Search query for task names.

