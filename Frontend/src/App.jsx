import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Protected Routes */}
        <Route element={<ProtectedRoute role="admin" />}>
          <Route path="/admin-dashboard" element={<h1>Hello This is Admin Dashboard</h1>} />
        </Route>

        <Route element={<ProtectedRoute role="artist" />}>
          <Route path="/artist-dashboard" element={<h1>Hello This is Artist Dashboard</h1>} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<h1>Hello This is User Dashboard</h1>} />
        </Route>

        <Route path="/unauthorized" element={<h2>Access Denied</h2>} />
      </Routes>
    </Router>
  );
}

export default App;
