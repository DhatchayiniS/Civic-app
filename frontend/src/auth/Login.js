import { useState, useContext } from "react";
import { login } from "../api/authService";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../styles/auth.css";

const Login = () => {
  const navigate = useNavigate();
  const { loginUser } = useContext(AuthContext);

  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userData = await login(form);
      loginUser(userData);
      if (userData.role === "ADMIN") {
        navigate("/admin-dashboard");
      } else {
        navigate("/user-dashboard");
      }
    } catch {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">

        {/* LEFT BRANDING SIDE */}
        <div className="auth-left">
          <h1>SmartResolve</h1>
          <h3>Report. Track. Resolve.</h3>
        </div>

        {/* RIGHT FORM SIDE */}
        <div className="auth-right">
          <h2>Welcome Back</h2>

          <form onSubmit={handleSubmit}>
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              onChange={handleChange}
              required
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              required
            />

            <button type="submit">Login</button>
          </form>

          <p>
            Don’t have an account?{" "}
            <Link to="/signup">Create Account</Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default Login;
