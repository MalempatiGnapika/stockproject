import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async () => {
    try {

      const res = await axios.post(
        "http://localhost:3002/login",
        {
          email,
          password,
        }
      );

      alert("Login Successful");

      window.location.href = "http://localhost:3001";

    } catch (err) {

      alert("Invalid Email or Password");
      console.log(err);

    }
  };

  return (
    <div>

      <h1>Login</h1>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e)=>setEmail(e.target.value)}
      />

      <br /><br />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e)=>setPassword(e.target.value)}
      />

      <br /><br />

      <button onClick={handleLogin}>
        Login
      </button>

    </div>
  );
}

export default Login;