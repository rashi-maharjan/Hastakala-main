import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import EventAdmin from "./pages/EventAdmin";
import Events from "./pages/Events";
import Home from "./pages/Home";
import Feed from "./pages/Feed";
import Community from "./pages/Community";
import AdminDashboard from "./pages/AdminDashboard";
import ArtistDashboard from "./pages/ArtistDashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Protected Routes */}
        <Route element={<ProtectedRoute role="admin" />}>
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/admin-dashboard/events" element={<EventAdmin />} />
        </Route>

        <Route element={<ProtectedRoute role="artist" />}>
          <Route path="/artist-dashboard" element={<ArtistDashboard />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route path="/feed" element={<Feed />} />
          <Route path="/events" element={<Events />} />
          <Route path="/community" element={<Community />} /> {/* New Route for Individual Post */}
        </Route>

        <Route path="/" element={<Home />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
