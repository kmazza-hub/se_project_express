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

### 1. Clone the repository:

```bash
git clone https://github.com/kmazza-hub/se_project_express.git
cd se_project_express
