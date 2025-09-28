import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";

export default function Nav() {

    const navigate = useNavigate();

    const handleLogout = async (e) => {

        try{
            const res = await axios.post(
            
                "http://localhost:5000/logout",
                {},
                {withCredentials: true}
            );
            navigate("/login");
        }catch(error){
            console.log("Logout failed: ", error);  
        }
    }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ backgroundColor: '#ff6b17' }}>
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            FEIT Security
          </Typography>
          <Button color="inherit" onClick={handleLogout}>
            Logout
            </Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
