# 🛒 MarketPlace

Web application for an online marketplace where users can publish, browse, and manage product listings.

---

## 📋 Overview

MarketPlace is an educational project developed for **SoftUni**. It demonstrates a complete **client–server architecture** with authentication, CRUD operations, and deployment-ready configuration.

Users can:

* Browse product listings
* Create, edit, and delete their own listings
* Add listings to favorites
* Comment on listings
* Manage authentication and profile 

---

## 🏗️ Architecture

The project is split into two independent applications:

### 🔹 Client (Frontend)

* React 18 + Vite
* Handles UI, routing, state, and API communication
* Deployed on **Netlify**

### 🔹 Server (Backend)

* Node.js + Express
* REST API
* JSON files used as lightweight storage
* Docker-ready
* Deployed on **Render**

---

## 📁 Project Structure

```
MarketPlace/
├── client/                         # Frontend (React + Vite)
│   ├── .env.development            # Development environment variables
│   ├── .env.production             # Production environment variables
│   ├── README.md                   # Client documentation
│   ├── components.json             # UI components configuration
│   ├── eslint.config.js
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   ├── postcss.config.js
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   ├── tsconfig.app.json
│   ├── tsconfig.node.json
│   ├── vite.config.ts
│   │
│   ├── public/                     # Static assets
│   │   ├── favicon.ico
│   │   ├── placeholder.svg
│   │   └── robots.txt
│   │
│   └── src/
│       ├── main.jsx                # Application entry point
│       ├── App.jsx                 # Root React component
│       ├── App.css
│       ├── index.css
│       │
│       ├── components/             # Reusable UI components
│       │   ├── DeleteDialog.jsx
│       │   ├── ErrorBoundary.jsx
│       │   ├── Footer.jsx
│       │   ├── Layout.jsx
│       │   ├── ListingImage.jsx
│       │   ├── LoadingSpinner.jsx
│       │   └── Toast.jsx
│       │
│       ├── pages/                  # Application pages (routes)
│       │   ├── Home.jsx
│       │   ├── Catalog.jsx
│       │   ├── ProductDetails.jsx
│       │   ├── CreatePost.jsx
│       │   ├── MyListings.jsx
│       │   ├── Favorites.jsx
│       │   ├── Profile.jsx
│       │   ├── Login.jsx
│       │   └── NotFound.jsx
│       │
│       ├── contexts/               # React Context API
│       │   └── AuthContext.jsx
│       │
│       ├── hooks/                  # Custom React hooks
│       │   ├── constants.js
│       │   ├── index.js
│       │   ├── useComments.js
│       │   ├── useDeleteDialog.js
│       │   ├── useImageUpload.js
│       │   ├── useListings.js
│       │   ├── useToast.js
│       │   └── useUser.js
│       │
│       ├── constants/
│       │   └── index.js
│       │
│       ├── utils/
│       │   ├── favorites.js
│       │   └── validation.js
│       │
│       ├── css/
│       │   ├── Profile.css
│       │   └── footer.css
│       │
│       └── lib/
│           └── utils.ts
│
└── server/                         # Backend (Node.js + Express)
    ├── Dockerfile                  # Docker configuration
    ├── package.json                # Server dependencies
    ├── package-lock.json
    ├── server.js                   # Main server entry point
    │
    └── data/                       # JSON data storage
        ├── users.json              # Users data
        ├── listings.json           # Listings data
        └── comments.json           # Comments data
```

---

## 🚀 Installation & Local Setup

### 1️⃣ Clone the repository

```bash
git clone https://github.com/Martin-Atanasov123/MarketPlace.git
cd MarketPlace
```

---

### 2️⃣ Start the Server

```bash
cd server
npm install
node server.js
```

Server runs at:

```
http://localhost:3030
```

---

### 3️⃣ Start the Client

Open a new terminal:

```bash
cd client
npm install
npm run dev
```

Client runs at:

```
http://localhost:5173
```

---

## 🔐 Authentication

* Token-based authentication
* Token stored in `localStorage`
* Sent with every request via:

```
X-Authorization: <accessToken>
```

### Test Users

| Email                                 | Password | Role  |
| ------------------------------------- | -------- | ----- |
| [peter@abv.bg](mailto:peter@abv.bg)   | 123456   | User  |
| [george@abv.bg](mailto:george@abv.bg) | 123456   | User  |
| [admin@abv.bg](mailto:admin@abv.bg)   | admin    | Admin |

---

## 🗄️ Data Storage

The backend uses JSON files located in `server/data/`:

* `users.json`
* `listings.json`
* `comments.json`

⚠️ This storage method is **for educational purposes only**.

---

## 🛠️ Technologies

### Frontend

* React 18
* Vite
* React Router
* Tailwind CSS
* Context API

### Backend

* Node.js
* Express
* File System (JSON storage)

---

## 📝 Notes

* Project created for **SoftUni defense**
* No real database is used
* Favorites are stored in `localStorage`
* Not intended for production use

---

## 👤 Author

Martin Atanasov


---

## 📄 License

Educational use only.
