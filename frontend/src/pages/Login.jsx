import { useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import axios from "axios"
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../storage/authStorage";
import api from "../api/token";

import '../css/Login.css'

export default function Login(){

    const navigate = useNavigate();
    const {login} = useAuthStore();

    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async(e) => {
        e.preventDefault();
        console.log("FORM SUBMITTED");
        setError("");

        try {
            const res = await api.post("/login", { name, password }); 

            login(res.data.token);

            console.log("Login successful: ", res.data);
            navigate("/cameras");
        } catch (error) {
            setError(error.response?.data?.message || "Error");
        }

    }

    return(
        <div className="form">
            <Box
                className="login-form"
                component="form"
                noValidate
                autoComplete="off"
                onSubmit={handleSubmit}>

                    <h3>Login</h3>

                    {error && <p style={{color: "red"}}>{error}</p>}

                    <TextField
                    className="form-field"
                    required
                    id="outlined-required"
                    label="Name"
                    name = "name"
                    value = {name}
                    onChange = {(e) => setName(e.target.value)}
                    />
                    <TextField
                    required
                    className="form-field"
                    id="outlined-password-input"
                    label="Password"
                    type="password"
                    autoComplete="current-password"
                    value = {password}
                    onChange = {(e) => setPassword(e.target.value)}
                    />
                    <Button type="submit" variant="contained" sx={{background: '#ff6b17'}}>Log in</Button>

             </Box>
        </div>
    )

}