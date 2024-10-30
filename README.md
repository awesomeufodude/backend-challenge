# Backend Test Documentation

## Table of Contents
1. [Requirements](#requirements)
2. [Installation and Setup](#installation-and-setup)
3. [API Endpoints](#api-endpoints)
4. [Database Structure](#database-structure)
5. [Environment Variables](#environment-variables)
6. [Postman and cURL Examples](#postman-and-curl-examples)
7. [Deployment](#deployment)
8. [Version Recap](#version-recap)

## Requirements
- **Node.js Version:** 14.x or higher
- **NPM Version:** 6.x or higher
- **PostgreSQL Version:** 14.x or compatible
- **NestJS Version:** 10.0
- **Docker (Optional for Containerization) 27.0**

## Installation and Setup

Follow these steps to install and setup the project:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/awesomeufodude/backend-challenge
   ```
2. **Navigate to the project directory:**
   ```bash
   cd backend-challenge
   ```
3. **Install dependencies using NPM:**
   ```bash
   npm install
   ```
4. **Copy `.env.example` to `.env` and configure your environment variables:**
   ```bash
   cp .env.example .env
   ```
5. **Run the database migrations:**
   ```bash
   npm run migrate
   ```
6. **Start the server:**
   ```bash
   npm run start
   ```
7. **Test the server:**
   ```bash
   npm run test
   ```   

This setup will get your application running on your local machine for development and testing purposes.

## API Endpoints

### General API
| Method | Endpoint | Description               |
|--------|----------|---------------------------|
| GET    | `/api`   | Root endpoint             |

### Survivors
| Method | Endpoint                    | Description                            |
|--------|-----------------------------|----------------------------------------|
| GET    | `/api/survivors`            | List all survivors                     |
| POST   | `/api/survivors`            | Create a new survivor                  |
| GET    | `/api/survivors/:id`        | Retrieve details of a specific survivor|
| PUT    | `/api/survivors/:id`        | Update details of a specific survivor  |
| DELETE | `/api/survivors/:id`        | Delete a specific survivor             |

### Items
| Method | Endpoint                | Description                             |
|--------|-------------------------|-----------------------------------------|
| GET    | `/api/items`            | List all items                          |
| POST   | `/api/items`            | Create a new item                       |
| GET    | `/api/items/:id`        | Retrieve details of a specific item     |
| PATCH  | `/api/items/:id`        | Update details of a specific item       |
| DELETE | `/api/items/:id`        | Delete a specific item                  |

### Inventory
| Method | Endpoint                             | Description                                        |
|--------|--------------------------------------|----------------------------------------------------|
| POST   | `/api/inventory`                    | Add an item to the inventory                       |
| GET    | `/api/inventory/:survivorId`        | List inventory for a specific survivor             |
| GET    | `/api/inventory/:survivorId/items/:itemId` | Get details of a specific item in a survivor's inventory |
| PATCH  | `/api/inventory/:id`                | Update inventory details                           |
| DELETE | `/api/inventory/:id`                | Remove an item from inventory                      |

### Trade
| Method | Endpoint             | Description                       |
|--------|----------------------|-----------------------------------|
| POST   | `/api/trade`         | Perform a trade between survivors |

### Reports
| Method | Endpoint                | Description                         |
|--------|-------------------------|-------------------------------------|
| GET    | `/api/reports`          | Retrieve various system-wide reports|

### Authentication
| Method | Endpoint               | Description                          |
|--------|------------------------|--------------------------------------|
| POST   | `/api/auth/login`      | Authenticate a user and return a token |
| POST   | `/api/auth/register`   | Register a new user                   |

## Database Structure


### User Table
| Column     | Data Type | Attributes                               | Description                           |
|------------|-----------|------------------------------------------|---------------------------------------|
| `id`       | Integer   | Primary Key, Auto Increment              | Unique identifier for the user        |
| `username` | String    | Unique                                   | Username for the user                 |
| `password` | String    |                                          | Hashed password for the user          |
| `email`    | String    | Unique                                   | Email address for the user            |
| `createdAt`| DateTime  | Default: Current Timestamp               | Record creation time                  |
| `updatedAt`| DateTime  | Auto Updated at each update              | Record last update time               |

### Survivor Table
| Column         | Data Type | Attributes                               | Description                            |
|----------------|-----------|------------------------------------------|----------------------------------------|
| `id`           | Integer   | Primary Key, Auto Increment              | Unique identifier for the survivor     |
| `name`         | String    |                                          | Name of the survivor                   |
| `age`          | Integer   |                                          | Age of the survivor                    |
| `gender`       | String    | Nullable                                 | Gender of the survivor                 |
| `lastLatitude` | Float     |                                          | Last known latitude of the survivor    |
| `lastLongitude`| Float     |                                          | Last known longitude of the survivor   |
| `infected`     | Boolean   | Default: false                           | Infection status of the survivor       |
| `createdAt`    | DateTime  | Default: Current Timestamp               | Record creation time                   |
| `updatedAt`    | DateTime  | Auto Updated at each update              | Record last update time                |

### Item Table
| Column       | Data Type | Attributes                               | Description                            |
|--------------|-----------|------------------------------------------|----------------------------------------|
| `id`         | Integer   | Primary Key, Auto Increment              | Unique identifier for the item         |
| `name`       | String    | Unique                                   | Name of the item                       |
| `description`| String    | Nullable                                 | Description of the item                |

### Inventory Table
| Column       | Data Type | Attributes                                  | Description                                |
|--------------|-----------|---------------------------------------------|--------------------------------------------|
| `id`         | Integer   | Primary Key, Auto Increment                 | Unique identifier for the inventory record |
| `survivorId` | Integer   | Foreign Key, References `id` in Survivor    | Linked survivor                            |
| `itemId`     | Integer   | Foreign Key, References `id` in Item        | Linked item                                |
| `quantity`   | Integer   |                                             | Quantity of the item in inventory          |

### Trade Table
| Column       | Data Type | Attributes                                  | Description                                |
|--------------|-----------|---------------------------------------------|--------------------------------------------|
| `id`         | Integer   | Primary Key, Auto Increment                 | Unique identifier for the trade            |
| `survivorId1`| Integer   | Foreign Key, References `id` in Survivor    | First survivor involved in the trade       |
| `survivorId2`| Integer   | Foreign Key, References `id` in Survivor    | Second survivor involved in the trade      |
| `itemId1`    | Integer   | Foreign Key, References `id` in Item        | First item being traded                    |
| `itemId2`    | Integer   | Foreign Key, References `id` in Item        | Second item being traded                   |
| `quantity1`  | Integer   |                                             | Quantity of the first item being traded    |
| `quantity2`  | Integer   |                                             | Quantity of the second item being traded   |
| `tradeDate`  | DateTime  | Default: Current Timestamp                  | Date when the trade occurred               |


## Environment Variables

### Database Connection

- **DATABASE_URL**: This variable contains the entire connection string needed to connect to your PostgreSQL database. It includes the username, password, host, port, and database name. The format of the connection string is as follows:
  ```plaintext
  DATABASE_URL="postgres://[username]:[password]@[host]:[port]/[database]"
  ```
  **Example for your setup**:
  ```plaintext
  DATABASE_URL=""
  ```

### Authentication Key

- **JWT_SECRET**: This key is used to sign and verify the JSON Web Tokens (JWT) used in the authentication processes within your application. It should be a long, random string to ensure security.
  ```plaintext
  JWT_SECRET="your_secret_key_here"
  ```
  **Example for your setup**:
  ```plaintext
  JWT_SECRET="gdkjqwksdqkdbjqgvdjbqnwkdgqjxnksxdqk"
  ```

## Postman and cURL Examples 

## Authentication API

This section provides examples of how to use cURL and Postman to interact with the authentication system of our application using deployed API https://thebackend-b69c0bd29fff.herokuapp.com.

### 1. User Login

#### cURL Example for Login
```bash
curl --location --request POST 'https://thebackend-b69c0bd29fff.herokuapp.com/api/auth/login' \
--header 'Content-Type: application/json' \
--data-raw '{
    "email": "john@example.com",
    "password": "your_password"
}'
```

#### Postman Request for Login
- **Method**: POST
- **URL**: `https://thebackend-b69c0bd29fff.herokuapp.com/api/auth/login`
- **Headers**:
  - Content-Type: application/json
- **Body (JSON)**:
```json
{
    "email": "john@example.com",
    "password": "your_password"
}
```
This example shows how to send a login request using both cURL and Postman, where users can authenticate by providing their email and password.

### 2. User Registration

#### cURL Example for Registration
```bash
curl --location --request POST 'https://thebackend-b69c0bd29fff.herokuapp.com/api/auth/register' \
--header 'Content-Type: application/json' \
--data-raw '{
    "username": "johndoe",
    "email": "john@example.com",
    "password": "your_secure_password"
}'
```

#### Postman Request for Registration
- **Method**: POST
- **URL**: `https://thebackend-b69c0bd29fff.herokuapp.com/api/auth/register`
- **Headers**:
  - Content-Type: application/json
- **Body (JSON)**:
```json
{
    "username": "johndoe",
    "email": "john@example.com",
    "password": "your_secure_password"
}
```

Here are the cURL examples for the `inventory` endpoints in your application, using the specified URL `https://thebackend-b69c0bd29fff.herokuapp.com/api`. These examples demonstrate how to interact with inventory items, including creating, updating, and deleting inventory records, and retrieving inventory details.

### Add to Inventory

#### cURL Example
```bash
curl --location --request POST 'https://thebackend-b69c0bd29fff.herokuapp.com/api/inventory' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer <your_token>' \
--data-raw '{
    "survivorId": 1,
    "itemId": 2,
    "quantity": 10
}'
```
This command adds items to a survivor's inventory, specifying the survivor ID, item ID, and quantity.

### Get All Inventory Items for a Survivor

#### cURL Example
```bash
curl --location --request GET 'https://thebackend-b69c0bd29fff.herokuapp.com/api/inventory/1' \
--header 'Authorization: Bearer <your_token>'
```
This command retrieves all inventory items for a specific survivor by their ID.

### Get Specific Inventory Item for a Survivor

#### cURL Example
```bash
curl --location --request GET 'https://thebackend-b69c0bd29fff.herokuapp.com/api/inventory/1/items/2' \
--header 'Authorization: Bearer <your_token>'
```
This command retrieves details of a specific item in the inventory of a survivor.

### Update Inventory Item

#### cURL Example
```bash
curl --location --request PATCH 'https://thebackend-b69c0bd29fff.herokuapp.com/api/inventory/123' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer <your_token>' \
--data-raw '{
    "quantity": 15
}'
```
This command updates the quantity of an existing inventory item by its ID.

### Delete Inventory Item

#### cURL Example
```bash
curl --location --request DELETE 'https://thebackend-b69c0bd29fff.herokuapp.com/api/inventory/123' \
--header 'Authorization: Bearer <your_token>'
```
This command deletes an inventory item by its ID.

### Notes
- **Authorization**: Ensure that you replace `<your_token>` with a valid JWT obtained from your authentication system to make authorized requests.


### Create an Item

#### cURL Example
```bash
curl --location --request POST 'https://thebackend-b69c0bd29fff.herokuapp.com/api/items' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer <your_token>' \
--data-raw '{
    "name": "Water Bottle",
    "description": "A plastic bottle containing 500ml of water."
}'
```
This command creates a new item with the name and description provided.

### Get All Items

#### cURL Example
```bash
curl --location --request GET 'https://thebackend-b69c0bd29fff.herokuapp.com/api/items' \
--header 'Authorization: Bearer <your_token>'
```
This command retrieves all items from the database.

### Get a Specific Item

#### cURL Example
```bash
curl --location --request GET 'https://thebackend-b69c0bd29fff.herokuapp.com/api/items/1' \
--header 'Authorization: Bearer <your_token>'
```
This command retrieves details of an item specified by its ID.

### Update an Item

#### cURL Example
```bash
curl --location --request PATCH 'https://thebackend-b69c0bd29fff.herokuapp.com/api/items/1' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer <your_token>' \
--data-raw '{
    "name": "Emergency Water",
    "description": "A plastic bottle containing 750ml of emergency water."
}'
```
This command updates the name and description of an existing item by its ID.

### Delete an Item

#### cURL Example
```bash
curl --location --request DELETE 'https://thebackend-b69c0bd29fff.herokuapp.com/api/items/1' \
--header 'Authorization: Bearer <your_token>'
```

### Get Reports

#### cURL Example
```bash
curl --location --request GET 'https://thebackend-b69c0bd29fff.herokuapp.com/api/reports' \
--header 'Authorization: Bearer <your_token>'
```

This command retrieves the comprehensive report about the survivors, including details such as the total number of infected and non-infected survivors, percentages of infected and non-infected survivors, change in these percentages, and average resources per survivor.


### Create a Survivor

#### cURL Example
```bash
curl --location --request POST 'https://thebackend-b69c0bd29fff.herokuapp.com/api/survivors' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer <your_token>' \
--data-raw '{
    "name": "John Doe",
    "age": 34,
    "gender": "Male",
    "lastLatitude": 36.778259,
    "lastLongitude": -119.417931,
    "infected": false
}'
```
This command creates a new survivor with specified details including their location coordinates.

### Get All Survivors

#### cURL Example
```bash
curl --location --request GET 'https://thebackend-b69c0bd29fff.herokuapp.com/api/survivors' \
--header 'Authorization: Bearer <your_token>'
```
This command retrieves a list of all survivors.

### Get a Specific Survivor

#### cURL Example
```bash
curl --location --request GET 'https://thebackend-b69c0bd29fff.herokuapp.com/api/survivors/1' \
--header 'Authorization: Bearer <your_token>'
```
This command retrieves details of a survivor specified by their ID.

### Update a Survivor

#### cURL Example
```bash
curl --location --request PUT 'https://thebackend-b69c0bd29fff.herokuapp.com/api/survivors/1' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer <your_token>' \
--data-raw '{
    "name": "Jane Doe",
    "age": 35,
    "gender": "Female",
    "lastLatitude": 37.774929,
    "lastLongitude": -122.419416,
    "infected": true
}'
```
This command updates the information of a survivor, including their infection status and location.

### Delete a Survivor

#### cURL Example
```bash
curl --location --request DELETE 'https://thebackend-b69c0bd29fff.herokuapp.com/api/survivors/1' \
--header 'Authorization: Bearer <your_token>'
```
This command deletes a survivor specified by their ID.


### Execute a Trade

#### cURL Example
```bash
curl --location --request POST 'https://thebackend-b69c0bd29fff.herokuapp.com/api/trade' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer <your_token>' \
--data-raw '{
    "survivorId1": 1,
    "survivorId2": 2,
    "itemId1": 3,
    "itemId2": 4,
    "quantity1": 5,
    "quantity2": 6
}'
```

This command sends a POST request to the `trade` endpoint, executing a trade between two survivors based on the details provided in the body of the request.

### Details of the `CreateTradeDto`:
- **survivorId1**: ID of the first survivor participating in the trade.
- **survivorId2**: ID of the second survivor participating in the trade.
- **itemId1**: ID of the item that the first survivor is trading.
- **itemId2**: ID of the item that the second survivor is trading.
- **quantity1**: Quantity of the item that the first survivor is trading.
- **quantity2**: Quantity of the item that the second survivor is trading.

## Deployment


### Steps to Containerize and Run

1. **Build and Run Using Docker Compose**:
    - Ensure Docker and Docker Compose are installed on your machine.
    - Navigate to your project directory where `docker-compose.yml` and `Dockerfile` are located.
    - Run the following command to build and start your services:

      ```bash
      docker-compose up --build
      ```

      This command builds the images if they don't exist and starts the containers as defined. Use `docker-compose up -d --build` to run in detached mode.

2. **Accessing the Application**:
    - For development, access your application at `http://localhost:3000` and connect to the debugger at port `9229`.
    - Production will also be accessible at `http://localhost:3000` but without debug support.

3. **Stopping and Removing Containers**:
    - To stop the containers, you can run:

      ```bash
      docker-compose down
      ```

      This command stops and removes the containers and networks created by `docker-compose up`.

This setup ensures that your application is ready for both development and production environments using Docker, with configurations allowing for easy testing, debugging, and deployment.

- **Heroku:** Apis are available at `https://thebackend-b69c0bd29fff.herokuapp.com`

## Version Recap

- **Node.js Version:** 14.x or higher
- **NPM Version:** 6.x or higher
- **PostgreSQL Version:** 14.x or compatible
- **NestJS Version:** 10.0
- **Docker (Optional for Containerization) 27.0**
