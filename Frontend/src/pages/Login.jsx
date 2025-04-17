import React, { useState } from "react";
import logo from "../assets/images/logo.png";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

// Helper to get a user-specific cart key
const getCartKey = (userId) => {
  return `cartItems_${userId || 'guest'}`;
};

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3001/api/auth/login", { email, password });
      const { token, user } = response.data;
  
      // Clear any existing guest cart or previous user's cart
      const guestCartKey = getCartKey('guest');
      localStorage.removeItem(guestCartKey);
      
      // Store token and role as before
      localStorage.setItem("token", token);
      localStorage.setItem("role", user.role);
      
      // IMPORTANT: Also store the complete user object
      localStorage.setItem("user", JSON.stringify(user));
      
      console.log("User data saved to localStorage:", user);
      
      // Create a user-specific cart if it doesn't exist
      const userCartKey = getCartKey(user.id || user._id);
      if (!localStorage.getItem(userCartKey)) {
        localStorage.setItem(userCartKey, JSON.stringify([]));
      }
      
      // Notify components that cart data may have changed
      window.dispatchEvent(new Event('cartUpdated'));
  
      // Continue with navigation based on role
      switch (user.role) {
        case "admin":
          navigate("/admin-dashboard");
          break;
        case "artist":
          navigate("/feed");
          break;
        default:
          navigate("/feed");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <section
      className="backdrop-blur-3xl h-screen overflow-hidden flex justify-center py-20 relative before:absolute before:left-[50%] before:top-[20%] 2xl:before:top-[30%]
     before:bg-primary/80 before:rounded-full before:w-[15%] before:h-[15%] 2xl:before:w-[15%] 2xl:before:h-[15%] before:-z-[1] before:blur-[105px] after:absolute after:right-[50%] after:top-[70%] 2xl:after:top-[60%] after:bg-red-600 after:rounded-full after:w-[15%] after:h-[15%] 2xl:after:w-[15%] 2xl:after:h-[15%] after:-z-[1] after:blur-[105px]"
    >
      <div className="container flex justify-center items-center z-[10] relative before:absolute before:right-[55%] before:top-[30%] 2xl:before:top-[35%] before:bg-green-500 before:rounded-full before:w-[15%] before:h-[15%] 2xl:before:w-[15%] 2xl:before:h-[15%] before:-z-[1] before:blur-[105px]">
        <div className="place-self-center">
          <img
            src={logo}
            alt="Hastakala Logo"
            width={158}
            height={38}
            loading="lazy"
            className="place-self-center mb-12 -z-[2]"
          />
          <form onSubmit={handleLogin}>
            <div className="relative bg-white/20 max-sm:w-[300px] w-[470px] px-9 py-12 border-2 border-white rounded-xl">
              {error && <p className="text-red-500 mb-4">{error}</p>}
              <div>
                <label htmlFor="Email" className="font-inter text-base">
                  Email
                </label>
                <br />
                <input
                  className="w-full border border-black rounded-3xl py-2 px-5 mt-4 outline-none"
                  type="email"
                  id="Email"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="mt-6">
                <label htmlFor="password" className="font-inter text-base">
                  Password
                </label>
                <br />
                <div className="relative">
                  <input
                    className="w-full border border-black rounded-3xl py-2 px-5 mt-4 outline-none"
                    type={showPassword ? "text" : "password"}
                    id="password"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute right-4 top-1/2 mt-2 transform -translate-y-1/2 text-gray-600 text-sm"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>
              <div className="mt-14 place-self-center text-center">
                <button
                  type="submit"
                  className="bg-primary/90 px-5 py-3 w-64 mb-4 block text-center text-white rounded-3xl hover:bg-primary transition-all duration-200 ease-in-out"
                >
                  Log In
                </button>
                <span>
                  Don't have account access?{" "}
                  <Link
                    to="/register"
                    className="text-primary whitespace-nowrap hover:underline"
                  >
                    Register
                  </Link>
                </span>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Login;