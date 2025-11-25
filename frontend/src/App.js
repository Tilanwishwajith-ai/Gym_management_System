import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AddMember from './components/AddMember';
import AllMembers from './components/AllMembers';
import MemberProfile from './components/MemberProfile';
import Login from './components/Login'; // Login එක ගෙන්නා ගත්තා
import './App.css';

// මේක තමයි ආරක්ෂකයා (Protected Route Component)
// කෙනෙක් Login වෙලා නැත්නම්, එයාව එළියට දානවා
const ProtectedRoute = ({ children }) => {
  const isAdmin = localStorage.getItem("isAdmin");
  if (!isAdmin) {
    return <Navigate to="/login" />;
  }
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <div className="App">
         {/* Navbar එක Login Page එකේදී පෙන්නන්න ඕන නෑ, ඒ නිසා අපි ඒක ඇතුලට දානවා */}
         
         <Routes>
            {/* 1. Login Page (Public) */}
            <Route path="/login" element={<Login />} />

            {/* 2. Home Page (Protected) */}
            <Route path="/" element={
              <ProtectedRoute>
                 <div className="navbar"><h1>💪 Fitness Gym Manager</h1></div>
                 <AllMembers />
              </ProtectedRoute>
            } />

            {/* 3. Add Page (Protected) */}
            <Route path="/add" element={
              <ProtectedRoute>
                 <div className="navbar"><h1>💪 Fitness Gym Manager</h1></div>
                 <AddMember />
              </ProtectedRoute>
            } />

            {/* 4. Profile Page (Protected) */}
            <Route path="/profile/:id" element={
              <ProtectedRoute>
                 <div className="navbar"><h1>💪 Fitness Gym Manager</h1></div>
                 <MemberProfile />
              </ProtectedRoute>
            } />
         </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;