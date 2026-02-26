import { useState } from "react";
import { signup } from "../api/authService";
import { Link, useNavigate } from "react-router-dom";
import "../styles/auth.css";

const Signup = () => {
  const navigate = useNavigate(); // 👈 Add this

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    wardId: ""
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        wardId: Number(formData.wardId)
      };

      await signup(payload);

      // ✅ Redirect after 1.5 seconds (so user can see message)
      setTimeout(() => {
        navigate("/login");
      }, 1000);

    } catch (error) {
      const backendMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        (typeof error.response?.data === "string"
          ? error.response.data
          : "Signup failed");

      setMessage(backendMessage);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">

        {/* LEFT SIDE */}
        <div className="auth-left">
          <h1>SmartResolve</h1>
          <h3>Report. Track. Resolve.</h3>
        </div>

        {/* RIGHT SIDE */}
        <div className="auth-right">
          <h2>Create Account</h2>

          <form onSubmit={handleSignup}>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <select
              name="wardId"
              value={formData.wardId}
              onChange={handleChange}
              required
            >
              <option value="">Select Ward</option>
              {[1, 2, 3, 4, 5].map((num) => (
                <option key={num} value={num}>
                  Ward {num}
                </option>
              ))}
            </select>

            <button type="submit">Sign Up</button>
          </form>

          {message && <p>{message}</p>}

          <p>
            Already have an account?{" "}
            <Link to="/login">Login</Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default Signup;