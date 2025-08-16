# 🎓 UniWise - Scholarship Application Portal

🌐 **Live Website**: [https://explore-email-password-a-22a93.web.app]

UniWise is a modern full-stack web application that allows students to explore and apply for global scholarships seamlessly. It offers a secure, intuitive interface for users to browse scholarships, apply through Stripe payment, submit reviews, and track their applications.

---

## 🚀 Features

- 🏫 **Scholarship Management**
  - View all scholarships with sorting, filtering, and detailed pages.
  - Add, edit, and delete scholarships (moderator access only).

- 👥 **User System**
  - Email/password & Google login (via Firebase Auth).
  - Role-based access: User, Moderator, Admin.

- 💳 **Application & Payment**
  - Apply for scholarships through a Stripe-powered form.
  - Application data (SSC, HSC, gender, gap, etc.).
  - Upload photo via imgbb API.

- 📝 **Review System**
  - Add, edit, delete reviews after application approval.
  - View all reviews, latest reviews, and per-scholarship reviews.

- 📊 **Admin Dashboard**
  - Manage users with role control and deletion.
  - View analytics: applications by status, category, degree, subject.
  - Manage all applied data and scholarship stats.

---

## 🛠️ Tech Stack

### Client (Frontend)
- **React**
- **React Router DOM**
- **Tailwind CSS & DaisyUI**
- **Axios & TanStack Query**
- **Stripe React**
- **Firebase Auth**
- **React Hook Form**
- **React Icons**
- **Imgbb API**

### Server (Backend)
- **Node.js + Express.js**
- **MongoDB + MongoDB Atlas**
- **Stripe Payment Integration**
- **Firebase Admin SDK (for token verification)**

---

## 📂 Project Structure

```bash
uniwise-client/
├── src/
│   ├── Components/
│   ├── Pages/
│   ├── Hooks/
│   ├── Provider/
│   ├── Layout/
│   └── main.jsx
└── .env
