# Task Management Application

A modern task management application built with React, TypeScript, and Node.js. Features include user authentication, drag-and-drop task organisation, weather integration, and real-time updates.

## Features

### Authentication
- Firebase Authentication integration
- Register with email/password
- Login with existing account
- Secure logout functionality

### Task Management
- Create, edit, and delete tasks
- Mark tasks as complete/incomplete
- Drag-and-drop task reordering
- Automatic weather display for tasks with city names
- Task categorisation with tags
- Due date assignment
- Task notes and descriptions
- Search functionality

### UI/UX
- Modern, responsive design using Tailwind CSS
- Snackbar notifications for user feedback
- Loading states and error handling
- Mobile-friendly interface

## Tech Stack

### Frontend
- React (with TypeScript)
- Tailwind CSS for styling
- React Beautiful DND for drag-and-drop
- Firebase Authentication
- React Router for navigation
- Axios for API requests

### Backend
- Node.js with Express
- MongoDB with Mongoose
- Jest for testing
- CORS enabled
- Environment variable configuration

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB instance
- Firebase project credentials
- Weather API key

### Installation

1. Clone the repository
```bash
git clone [repository-url]
```

2. Install Frontend Dependencies
```bash
cd frontend
yarn install
```

3. Install Backend Dependencies
```bash
cd backend
npm install
```

4. Configure Environment Variables
- Create `.env` file in the backend directory (sent separately)
- Contains MongoDB URI, JWT secret, and other sensitive data

### Running the Application

1. Start Backend Server

```bash
cd backend
yarn run dev
```

2. Start Frontend Development Server

```bash
cd frontend
yarn start
```

The application will be available at `http://localhost:3000`

## Testing

Run backend tests:

```bash
cd backend
yarn test
```

## Deployment

The application is deployed using Firebase Hosting for the frontend and can be accessed at [deployment-url].

## Environment Variables

Backend `.env` file structure (sent separately):
```
PORT=
MONGODB_URI=
WEATHER_API_KEY=
```

## License

This project is licensed under the MIT License - see the LICENSE file for details