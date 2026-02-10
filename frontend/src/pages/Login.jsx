import { useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../storage/authStorage";
import api from "../api/token";

import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import '../css/Login.css'

export default function Login(){

    const navigate = useNavigate();
    const login = useAuthStore((s) => s.login);

    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [type, setType] = useState('password');

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
            setError(error.response?.data?.message || "Login failed");
        }

    }
    
    const handleToggleEye = () =>{
        if(type === 'password'){
            setIcon(eye);
            setType('text');
        }else{
            setIcon(eyeOff);
            setType('password');
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

                    <h3>Prihlásenie</h3>

                    {error && <p style={{color: "red"}}>{error}</p>}

                    <TextField
                    className="form-field"
                    required
                    id="outlined-required"
                    label="Meno"
                    name = "name"
                    value = {name}
                    onChange = {(e) => setName(e.target.value)}
                    />
                    <TextField
                    required
                    className="form-field"
                    label="Heslo"
                    type={type}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    InputProps={{
                        endAdornment: (
                        <InputAdornment position="end">
                            <IconButton onClick={() => setType(type === "password" ? "text" : "password")}>
                            {type === "password" ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                        </InputAdornment>
                        ),
                    }}
                    />
                    <Button type="submit" variant="contained" sx={{background: '#ff6b17'}}>Log in</Button>

             </Box>
        </div>
    )

}