# ✈️ Jet Share

**A Shared Private Jet Booking Platform**

Jet Share is a web-based platform designed to make private jet travel more accessible by allowing multiple travelers heading to the same destination to coordinate trips and share the total travel cost.

The platform connects travelers, manages shared trip plans, and helps staff coordinate group bookings through a centralized system.

> 🚧 **Project Status: In Development**

## 📌 Project Overview

Private jet travel is often expensive for individuals. Jet Share aims to solve this problem by allowing people traveling to similar destinations to join a shared trip and split the overall cost.

Users can explore available trips, express interest, join groups, and coordinate bookings. Staff members can create and manage trip plans, while administrators supervise the overall platform.

## 🎯 Project Goals

- Make private jet travel more accessible through shared costs.
- Connect travelers with similar destinations.
- Simplify group trip coordination.
- Provide role-based dashboards and management tools.
- Create a secure and user-friendly booking experience.

## 👥 User Roles

### 1. User
- Browse available trips.
- Search trips by destination.
- View trip details.
- Show interest in a trip.
- Join shared trip groups.
- Manage personal bookings.
- Manage profile information.

### 2. Staff
- Create new trip plans.
- Manage available trips.
- View interested travelers.
- Coordinate group bookings.
- Manage trip-related information.

### 3. Admin
- Manage users.
- Manage staff members.
- Monitor trips and bookings.
- Manage platform activities.
- Oversee the entire system.

## 🛠️ Technology Stack

### Frontend
- React.js
- Vite
- TypeScript
- Tailwind CSS v4
- HeroUI
- React Router v7
- Redux Toolkit
- Axios
- React Icons

### Backend
- Node.js
- Express.js 5
- TypeScript

### Database
- MongoDB
- Mongoose

### Authentication
- Better Auth

### Development Tools
- Git & GitHub
- VS Code
- npm

## 🏗️ Project Architecture

The project follows a separate frontend and backend architecture.

```text
jet-share/
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   ├── shared/
│   │   │   └── ui/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── data/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── store/
│   │   ├── types/
│   │   ├── utils/
│   │   ├── lib/
│   │   ├── config/
│   │   ├── App.tsx
│   │   └── main.tsx
│   └── package.json
│
└── backend/
    ├── src/
    └── package.json
```

## 🔐 Authentication & Authorization

Better Auth will handle authentication and session management.

The platform will support three roles:

- `user`
- `staff`
- `admin`

Role-based authorization will ensure that users can only access the resources and operations permitted for their roles.

Backend authorization will enforce actual security for protected API endpoints.

## 📊 Application State Management

Redux Toolkit will manage application-level state, including:

- Trips
- Bookings
- Notifications
- Search filters

Authentication and session information will be managed by Better Auth rather than duplicated in Redux.

## 🚀 Development Roadmap

- [x] Project concept and requirements planning
- [x] Technology stack selection
- [x] Frontend project initialization
- [x] Tailwind CSS v4 setup
- [x] Component library selection
- [x] Routing architecture planning
- [ ] Frontend folder structure setup
- [ ] Reusable UI components
- [ ] Public pages and layouts
- [ ] User dashboard
- [ ] Staff dashboard
- [ ] Admin dashboard
- [ ] Backend initialization
- [ ] Database integration
- [ ] Authentication integration
- [ ] API development
- [ ] Frontend and backend integration
- [ ] Testing and deployment

## 💡 Future Improvements

- Advanced trip search and filtering.
- Real-time booking updates.
- Group travel coordination.
- Secure payment integration.
- Booking notifications.
- Trip status tracking.
- Responsive dashboard experience.

## 📌 Current Development Focus

The project is currently in its **frontend development and architecture setup phase**.

The initial focus is on building reusable components, defining the routing structure, creating responsive layouts, and implementing the three role-based dashboards.

Backend development and API integration will follow after the initial frontend structure is ready.

---

**Jet Share — Making Private Jet Travel More Accessible Through Shared Journeys.**