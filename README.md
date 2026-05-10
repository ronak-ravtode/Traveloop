# Traveloop – Personalized Travel Planning Made Easy

Traveloop is a full-stack travel planning web application that helps users create, manage, and share personalized multi-city trip itineraries. Users can plan trips, add destinations, assign activities, estimate budgets, manage packing checklists, write travel notes, and share public itineraries.

This project was built as a hackathon project with the goal of creating a smooth, user-friendly, and practical travel planning experience.

---

## 🚀 Features

### 1. Authentication
- User signup and login
- Firebase Authentication
- Protected routes
- User-based trip management

### 2. Dashboard
- Overview of user trips
- Quick access to recent trips
- Recommended destinations
- Budget highlights and stats

### 3. Create Trip
- Add trip name, description, dates, budget, and cover image
- Validate trip details
- Save trip data to backend

### 4. My Trips
- View all created trips
- Search and filter trips
- View, edit, and delete trip cards

### 5. Itinerary Builder
- Add multiple city stops
- Assign arrival and departure dates
- Add activities to each stop
- Reorder and manage stops

### 6. Itinerary View
- View full trip plan
- Day-wise and city-wise itinerary layout
- Activity details with cost, duration, and category

### 7. City Search
- Browse travel destinations
- Search and filter cities
- View destination details such as country, region, cost level, and popularity

### 8. Activity Search
- Browse activities by city and category
- Filter by cost, duration, and type
- Add activities to trip stops

### 9. Budget Breakdown
- Estimate trip cost
- Category-wise budget breakdown
- Transport, stay, meals, activities, and miscellaneous expenses
- Budget summary with charts

### 10. Packing Checklist
- Add packing items
- Mark items as packed/unpacked
- Categorize checklist items
- Track packing progress

### 11. Public Itinerary Sharing
- Generate public trip link
- Share read-only itinerary
- Copy public trip plan

### 12. Profile / Settings
- View and update user profile
- Manage preferences
- Save destinations
- Privacy settings

### 13. Trip Notes / Journal
- Add notes for trip or city stops
- Edit and delete notes
- Store reminders, hotel info, contacts, and travel details

### 14. Admin Analytics Dashboard
- Admin-only dashboard
- User statistics
- Trip analytics
- Popular cities and activities
- Budget and usage insights

---

## 🛠️ Tech Stack

### Frontend
- React.js
- Vite
- Tailwind CSS
- React Router DOM
- Firebase Authentication
- Axios
- Lucide React Icons
- Recharts

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- CORS
- dotenv
- Morgan
- Nanoid

### Database
- MongoDB Atlas / Local MongoDB

---

## 📁 Project Structure

```txt
traveloop/
  client/
    src/
      assets/
      components/
        layout/
        ui/
        trip/
        itinerary/
        budget/
        admin/
      pages/
      services/
      firebase/
      context/
      data/
      routes/
      utils/
      App.jsx
      main.jsx
    .env
    package.json

  server/
    src/
      config/
        db.js
      models/
        User.js
        Trip.js
        City.js
        Activity.js
      routes/
        userRoutes.js
        tripRoutes.js
        cityRoutes.js
        activityRoutes.js
        budgetRoutes.js
        checklistRoutes.js
        noteRoutes.js
        publicRoutes.js
        adminRoutes.js
      controllers/
        userController.js
        tripController.js
        cityController.js
        activityController.js
        budgetController.js
        checklistController.js
        noteController.js
        publicController.js
        adminController.js
      middleware/
        mockAuthMiddleware.js
        adminMiddleware.js
        errorMiddleware.js
      seed/
        seed.js
      utils/
      app.js
      server.js
    .env
    package.json
