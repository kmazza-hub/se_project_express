# 📄 WTWR (What to Wear?) — Back End

This is the back-end server for the [WTWR (What to Wear?)] application.  
The project implements a secure RESTful API to manage user authentication, clothing items, and real-time weather-based recommendations.

---

## 🚀 Features

- 🔐 User authentication (signup, login) with secure JWT tokens  
- 🧥 Full CRUD operations for clothing items  
- 🛡️ Secure password storage with hashing (bcrypt)  
- 🧹 Centralized error handling and request validation  
- 🌦️ Integrated OpenWeather API for live weather data  
- 🗄️ MongoDB database for persistent storage  
- 🔁 Deployed using PM2 for crash recovery  
- 🌐 HTTPS with valid SSL certificate via NGINX + Certbot  
- 🧪 Crash-test route for validation during review

---

## 🛠️ Technologies Used

- **Node.js** — JavaScript runtime environment  
- **Express.js** — Fast and minimalist web framework  
- **MongoDB + Mongoose** — NoSQL database and schema modeling  
- **JWT** — JSON Web Token for authentication  
- **bcryptjs** — Password hashing library  
- **Celebrate & Joi** — Input validation  
- **dotenv** — Secure environment variable management  
- **CORS** — Cross-Origin Resource Sharing  
- **Winston & express-winston** — Server-side logging  
- **ESLint & Prettier** — Linting and formatting  

---

## ⚙️ Setup and Installation

### 1. Clone the repository

```bash
git clone https://github.com/kmazza-hub/se_project_express.git
cd se_project_express
2. Install dependencies
bash
Copy
Edit
npm install
3. Create a .env file in the root directory
env
Copy
Edit
PORT=3001
MONGO_URL=mongodb://localhost:27017/wtwr
JWT_SECRET=your-strong-secret-key-here
NODE_ENV=development
OPEN_WEATHER_API_KEY=your_real_openweathermap_api_key_here
📦 Start the Server
In development mode (with nodemon):
bash
Copy
Edit
npm run dev
In production:
bash
Copy
Edit
npm start
The server runs at: http://localhost:3001

🌐 Deployed Domains

Purpose	URL
API Backend	https://api.keithswtwr.myserver.dns.com.crabdance.com
Frontend	https://keithswtwr.myserver.dns.com.crabdance.com
🧪 API Endpoints

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
GET	/crash-test	Intentionally crash the server (PM2 test)
📁 Project Structure
bash
Copy
Edit
se_project_express/
│
├── controllers/        # Route handlers
├── models/             # Mongoose models (User, ClothingItem)
├── routes/             # Express routes
├── middlewares/        # Validation, logging, auth, error handling
├── utils/              # Constants and error classes
├── app.js              # Main server entry point
├── .env                # Environment variables
├── .eslintrc.json      # Linting rules
└── package.json        # Project metadata and dependencies
🛡️ Security Practices
Passwords hashed with bcrypt before DB storage

Environment variables used for all sensitive values

JWT tokens used with expiration and secure signing

Input validation using Celebrate + Joi

Logging of all server requests and errors via Winston

🚀 Deployment Notes
Deployed on a Google Cloud VM

PM2 used to manage and auto-restart app on crash

SSL/TLS certificates via Certbot + NGINX

NGINX reverse proxy routes requests to Node.js app

Static frontend hosted in /var/www/frontend

🎯 Crash Test Instructions
The /crash-test route is used to simulate a crash and test PM2 restart:

bash
Copy
Edit
curl http://localhost:3001/crash-test
✅ The app should crash and restart automatically under PM2.

🎓 Acknowledgments
This project was developed as part of a rigorous Software Engineering program, emphasizing scalable architecture, security, deployment, and clean code practices.

Let’s build something great — one commit at a time 🚀
