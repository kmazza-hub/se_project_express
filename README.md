📄 WTWR (What to Wear?) — Back End
This is the back-end server for the [WTWR (What to Wear?)] application.
The project implements a secure RESTful API to manage user authentication, clothing items, and real-time weather-based recommendations.

🚀 Features
🔐 User authentication (signup, login) with secure JWT tokens

🧥 Full CRUD operations for clothing items

🛡️ Secure password storage with hashing (bcrypt)

🧹 Centralized error handling and request validation

🌦️ Integrated OpenWeather API for live weather data

🗄️ MongoDB database for persistent storage

🛠️ Technologies Used
Node.js — JavaScript runtime environment

Express.js — Fast and minimalist web framework

MongoDB with Mongoose — Database and schema modeling

JWT — JSON Web Token for secure authentication

bcryptjs — Password hashing library

Celebrate & Joi — Validation middleware for incoming requests

dotenv — Manage environment variables securely

CORS — Enable Cross-Origin Resource Sharing

Winston & express-winston — Server-side logging

ESLint & Prettier — Code linting and formatting standards

⚙️ Setup and Installation
Clone the repository:

bash
Copy
Edit
git clone https://github.com/kmazza-hub/se_project_express.git
cd se_project_express
Install the dependencies:

bash
Copy
Edit
npm install
Create a .env file in the root directory and add the following environment variables:

ini
Copy
Edit
JWT_SECRET=your-strong-secret-key
MONGO_URI=mongodb://localhost:27017/wtwr
OPEN_WEATHER_API_KEY=your-openweather-api-key
Start the server in development mode:

bash
Copy
Edit
npm run dev
Or start the server normally:

bash
Copy
Edit
npm start
The server will run on http://localhost:3001 by default.

📚 API Endpoints

Method	Endpoint	Description
POST	/signup	Register a new user
POST	/signin	Authenticate and receive JWT token
GET	/users/me	Retrieve current user profile
PATCH	/users/me	Update user profile
GET	/items	Get all clothing items
POST	/items	Add a new clothing item
DELETE	/items/:itemId	Delete a clothing item (if owner)
PUT	/items/:itemId/likes	Like a clothing item
DELETE	/items/:itemId/likes	Remove like from a clothing item
GET	/weather	Get current weather for location
📦 Project Structure
bash
Copy
Edit
├── controllers/        # Route handlers
├── models/             # Mongoose models (User, ClothingItem)
├── routes/             # Express routes
├── middlewares/        # Validation, error handling, authentication
├── utils/              # Constants, error classes
├── app.js              # Main server entry point
├── .env                # Environment variables
├── .eslintrc.json      # Linting rules
└── package.json        # Project metadata and dependencies
🛡️ Security Practices
Environment variables used for sensitive configuration

Passwords hashed with bcrypt before database storage

JWT tokens with expiration time and strong signing secret

Data validation on every request to prevent malformed data

Centralized logging of all server activity and errors

🖥️ Deployment
The project is designed to be easily deployable on cloud providers such as:

Google Cloud Platform (GCP)

AWS EC2

Digital Ocean

Render, Heroku, etc.

✨ Acknowledgments
This project was built as part of a comprehensive Software Engineering course, with a focus on security, scalability, and best practices.

🎯 Let's build something great!
