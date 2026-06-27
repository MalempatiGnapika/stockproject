import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Signup() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const handleSignup = async () => {
  try {
    const res = await axios.post("http://localhost:3002/signup", {
      email,
      username,
      password,
    });

    alert(res.data.message);
    window.location.href = "http://localhost:3001";
  }  catch (err) {
  console.log("Error:", err);
  console.log("Response:", err.response);
  console.log("Data:", err.response?.data);

  alert(JSON.stringify(err.response?.data));
}
};
//   const handleSignup = async () => {
//   try {
//     const res = await axios.post("http://localhost:3002/signup", {
//       email,
//       username,
//       password,
//     });

//     alert(res.data);
//     window.location.href = "http://localhost:3004";
//   } catch (err) {
//   console.log(err.response);
//   alert(JSON.stringify(err.response?.data));
// }
// };

  return (
    <div>
      <h1>Signup</h1>

      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <br /><br />

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <br /><br />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <br /><br />
        <button onClick={handleSignup}>Signup</button>

<button
  onClick={() => navigate("/login")}
  style={{ marginLeft: "10px" }}
>
  Login
</button>
    </div>
  );
}

export default Signup;