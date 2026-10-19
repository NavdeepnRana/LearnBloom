import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import NewChild from './pages/NewChild';
import ChildShow from './pages/ChildShow';
import AssessmentQuiz from './pages/AssessmentQuiz';
import AssessmentResults from './pages/AssessmentResults';
import Profile from './pages/Profile';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/children/new"
        element={
          <ProtectedRoute>
            <NewChild />
          </ProtectedRoute>
        }
      />
      <Route
        path="/children/create"
        element={
          <ProtectedRoute>
            <NewChild />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/children/:id"
        element={
          <ProtectedRoute>
            <ChildShow />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/assessments/:id"
        element={
          <ProtectedRoute>
            <AssessmentQuiz />
          </ProtectedRoute>
        }
      />
      <Route
        path="/assessments/:id/take"
        element={
          <ProtectedRoute>
            <AssessmentQuiz />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/assessments/:id/results"
        element={
          <ProtectedRoute>
            <AssessmentResults />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
