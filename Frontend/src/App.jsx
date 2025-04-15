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
import AddArtwork from "./components/AddArtwork";
import ArtworkDetail from "./pages/ArtworkDetail";
import ManageArtwork from "./pages/ManageArtwork";
import Cart from "./pages/Cart";
import EsewaSuccess from "./pages/EsewaSuccess";
import EsewaFailure from "./pages/EsewaFailure";
import NotificationPage from "./pages/NotificationPage";
import UserManagement from "./pages/UserManagement";
import OrderConfirmation from "./pages/OrderConfirmation";
import ChangePassword from "./components/ChangePassword";
import Profile from "./pages/Profile";
import SearchResults from "./pages/SearchResults"; function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Admin Protected Routes */}
        <Route element={<ProtectedRoute role="admin" />}>
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/admin-dashboard/events" element={<EventAdmin />} />
          <Route path="/admin-dashboard/users" element={<UserManagement />} />
        </Route>

        {/* Artist Protected Routes - Only specific artist functionality */}
        <Route element={<ProtectedRoute role="artist" />}>
          <Route path="/artist-dashboard" element={<ArtistDashboard />} />
          <Route path="/add-artwork" element={<AddArtwork />} />
          <Route path="/manage-artwork" element={<ManageArtwork />} />
        </Route>

        {/* General Protected Routes - Available to all logged-in users */}
        <Route element={<ProtectedRoute />}>
          <Route path="/feed" element={<Feed />} />
          <Route path="/artwork/:id" element={<ArtworkDetail />} />
          <Route path="/events" element={<Events />} />
          <Route path="/community" element={<Community />} />
          <Route path="/notifications" element={<NotificationPage />} />
          <Route path="/order-confirmation" element={<OrderConfirmation />} />
          <Route path="/search-results" element={<SearchResults />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/change-password" element={<ChangePassword />} />
        </Route>

        {/* Payment Routes */}
        <Route path="/payment/success" element={<EsewaSuccess />} />
        <Route path="/payment/failure" element={<EsewaFailure />} />

        {/* Public Routes */}
        <Route path="/cart" element={<Cart />} />
        <Route path="/" element={<Home />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;