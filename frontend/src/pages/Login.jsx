import { useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import '../css/Login.css'

export default function Login() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Nastal problém, skúste to znova.");
        return;
      }

      // uloženie tokenu
      const token = data.token;
      localStorage.setItem("token", token);

      console.log("Login successful:", data);

      navigate("/cameras"); // presmerovanie po úspešnom login
    } catch (err) {
      console.log(err);
      setError("Nastal problém, skúste to znova.");
    }
  };

  return (
    <div className="form">
      <Box
        className="login-form"
        component="form"
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit}
      >
        <h3>Login</h3>
        {error && <p style={{ color: "red" }}>{error}</p>}

        <TextField
          className="form-field"
          required
          id="outlined-required"
          label="Name"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          required
          className="form-field"
          id="outlined-password-input"
          label="Password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="submit" variant="contained" sx={{ background: '#ff6b17' }}>Log in</Button>
      </Box>
    </div>
  );
}
