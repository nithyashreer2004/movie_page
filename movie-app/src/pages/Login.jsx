import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = () => {
    if (email && password) {
      localStorage.setItem("user", email);
      navigate("/favorites");
    }
  };

  return (
    <div className="login">
      <div className="login-card">
        <h1>NETFLIX</h1>

        <h2>Sign In</h2>

        <input
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={login}>Sign In</button>
      </div>
    </div>
  );
}

export default Login;