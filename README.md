# 🚀 TaskLoading – Civic Issue Reporting Platform

[![Made with MERN](https://img.shields.io/badge/Made%20with-MERN-blue)]()
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)]()
[![Cloudinary](https://img.shields.io/badge/Image%20Storage-Cloudinary-orange)]()
[![Redux Toolkit](https://img.shields.io/badge/State%20Management-Redux%20Toolkit-purple)]()

**TaskLoading** is a full-stack MERN application that empowers citizens to report local civic issues such as potholes, garbage dumps, and broken infrastructure directly from their location. Users can submit reports with images, live geolocation, or manual addresses.

---

## 📌 Problem Statement

Many cities still handle civic complaints manually through paperwork or phone calls. This leads to:

- 🏢 Citizens facing delays in reporting issues  
- ⏳ Slow response time due to lack of centralized tracking  
- 📊 No real-time visibility for administrators  

**Goal:** Build a platform that centralizes issue reporting, automates image & location handling, and provides real-time dashboards for users and admins.

---

## 🏗️ Tech Stack

**Frontend:**  
- React  
- Redux Toolkit + RTK Query  
- Tailwind CSS + ShadCN UI  
- Geolocation API  

**Backend:**  
- Node.js + Express.js  
- MongoDB + Mongoose  
- JWT Authentication + HTTP-only cookies  
- Multer (file uploads) + Cloudinary (image storage)  

---


## 📂 Project Structure

```text
taskloading/
├── server/
│   ├── controllers/    # Issue & User controllers
│   ├── models/         # MongoDB models (User, Issue)
│   ├── routes/         # API routes
│   ├── middleware/     # JWT auth, Multer config
│   └── config/         # DB + Cloudinary setup
│
├── client/
│   ├── src/
│   │   ├── components/ # Reusable UI components
│   │   ├── features/   # Redux slices
│   │   ├── pages/      # Dashboard, Report, Auth
│   │   └── utils/      # API helpers
│
├── package.json
└── README.md


---
```

## ⚡ Key Features

- 📍 Submit civic issues with **images + live location**  
- 🗂️ Category-based classification: *Road, Garbage, Water, Electricity*  
- 🔐 Secure JWT authentication with role-based access (User/Admin)  
- 🖼️ Image uploads via **Multer + Cloudinary**  
- 📊 Admin dashboard to verify and update issue statuses  
- 🔎 Real-time search & filtering for faster issue lookup  
- 🎨 Modern responsive UI with Tailwind CSS + ShadCN UI  

---
