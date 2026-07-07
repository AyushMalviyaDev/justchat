import { Navigate, Routes, Route } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Register from '../pages/Register/Register';
import Login from '../pages/Login/Login';
import Chats from '../pages/Chats/Chats';
import ChatPage from '../pages/Chats/ChatPage';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen bg-[#09090B] text-white flex items-center justify-center">Loading...</div>;
  return user ? children : <Navigate to="/" replace />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/chats" element={<ProtectedRoute><Chats /></ProtectedRoute>} />
      <Route path="/chats/:chatId" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
    </Routes>
  );
}

export default AppRoutes;