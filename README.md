
# TrackTonic Fitness Training

TrackTonic Fitness Training is a comprehensive platform that connects fitness trainers with clients, offering a range of features such as trainer profiles, booking, reviews, and a forum for discussions. The backend is built with Node.js, Express, MongoDB, and Stripe for payment processing.

## Table of Contents

- [Setup](#setup)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Technologies Used](#technologies-used)
- [License](#license)

## Setup

To set up the project locally, follow these steps:

1. **Clone the repository**:
    ```bash
    git clone https://github.com/yourusername/tracktonic-fitness-training.git
    cd tracktonic-fitness-training
    ```

2. **Install dependencies**:
    ```bash
    npm install
    ```

3. **Set up the environment variables**:
    Create a `.env` file in the root directory and add the following environment variables:
    ```plaintext
    PORT=7000
    DB_USER=your_mongodb_username
    DB_PASS=your_mongodb_password
    ACCESS_TOKEN_SECRET=your_jwt_secret
    STRIPE_SECRET_KEY=your_stripe_secret_key
    ```

4. **Start the server**:
    ```bash
    nodemon index.js
    ```

5. **Access the application**:
    Open your web browser and navigate to `http://localhost:7000` to access the application.

## Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/yourusername/tracktonic-fitness-training.git
    cd tracktonic-fitness-training
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Start the server:
    ```bash
    npm start
    ```

## Environment Variables

Create a `.env` file in the root directory and add the following environment variables:

```plaintext
PORT=7000
DB_USER=your_mongodb_username
DB_PASS=your_mongodb_password
ACCESS_TOKEN_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
```

## API Endpoints

### Authentication

- **Generate JWT Token**: `POST /jwt`
  - Body: `{ "email": "user@example.com", "password": "password" }`

### Reviews

- **Get All Reviews**: `GET /reviews`
- **Get Review by ID**: `GET /reviews/:id`
- **Create Review**: `POST /reviews`
  - Body: `{ "review": "Great trainer!", "rating": 5 }`

### Trainers

- **Get All Approved Trainers**: `GET /trainers`
- **Get All Trainers**: `GET /trainers/all`
- **Get Pending Trainers**: `GET /trainers/pending`
- **Get Trainer by ID**: `GET /trainers/:id`
- **Get Trainer by Email**: `GET /trainers/email/:email`
- **Get Rejected Trainers by Email**: `GET /rejectedTrainers/:email`
- **Get Pending Trainers by Email**: `GET /pendingTrainers/:email`
- **Create Trainer**: `POST /trainers`
  - Body: `{ "name": "John Doe", "email": "john@example.com", "status": "pending" }`
- **Approve Trainer**: `PATCH /approveTrainer/:id`
- **Reject Trainer**: `PATCH /rejectTrainer/:id`
  - Body: `{ "reason": "Does not meet criteria" }`
- **Update Trainer Role to 'trainer'**: `PATCH /trainers/approve/:email`
- **Update Trainer Role to 'member'**: `PATCH /trainers/delete/:email`
- **Delete Trainer**: `DELETE /trainers/remove/:id`

### Forum Posts

- **Get All Posts with Pagination**: `GET /posts?page=0&size=10`
- **Create Post**: `POST /posts`
  - Body: `{ "title": "New Post", "content": "This is a new post." }`
- **Get Post by ID**: `GET /posts/:id`
- **Upvote Post**: `PATCH /posts/upvote/:postId`
- **Downvote Post**: `PATCH /posts/downvote/:postId`
- **Get Post Count**: `GET /postsCount`

### Users

- **Get All Users**: `GET /users`
- **Create User**: `POST /users`
  - Body: `{ "name": "John Doe", "email": "john@example.com" }`
- **Check Admin Role**: `GET /users/admin/:email`
- **Check Trainer Role**: `GET /users/trainer/:email`

### Classes

- **Create Class**: `POST /classes` (Admin only)
  - Body: `{ "class_name": "Yoga", "description": "A relaxing yoga class" }`
- **Get All Classes with Pagination and Search**: `GET /classes?page=0&size=10&search=yoga`
- **Get Class Count**: `GET /classesCount`
- **Get Class by ID**: `GET /classes/:id`
- **Get Featured Classes**: `GET /featuredClasses`
- **Book Class**: `PATCH /bookClass/:id`

### Payments

- **Create Payment Intent**: `POST /create_payment_intent`
  - Body: `{ "price": 100 }`
- **Record Payment**: `POST /payments`
  - Body: `{ "amount": 100, "email": "user@example.com" }`
- **Get All Payments**: `GET /payments`
- **Get Payments by Email**: `GET /payments/:email`

## Technologies Used

- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT
- **Payment Processing**: Stripe
- **Environment Variables**: dotenv

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
```
