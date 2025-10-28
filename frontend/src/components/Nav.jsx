import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from "axios";

import './css/nav.css';

export default function Nav() {

  const[isSidebarVisible, setIsSidebarVisible] = useState(false);

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
    <div>
            <Drawer
        anchor="left"
        open={isSidebarVisible}
        onClose={() => setIsSidebarVisible(false)}
        PaperProps={{
          sx: { width: 250, backgroundColor: "#f5f5f5", paddingTop: 2 },
        }}
      >
        <div style={{ display: "flex", justifyContent: "flex-end", paddingRight: 10 }}>
          <IconButton onClick={() => setIsSidebarVisible(false)}>
            <CloseIcon />
          </IconButton>
        </div>

        <List>
          <ListItem button component={Link} to="/" onClick={() => setIsSidebarVisible(false)}>
            <ListItemText primary="Home" />
          </ListItem>

          <ListItem button component={Link} to="/profile" onClick={() => setIsSidebarVisible(false)}>
            <ListItemText primary="Profile" />
          </ListItem>

          <ListItem button component={Link} to="/settings" onClick={() => setIsSidebarVisible(false)}>
            <ListItemText primary="Settings" />
          </ListItem>

          <ListItem button component={Link} to="/help" onClick={() => setIsSidebarVisible(false)}>
            <ListItemText primary="Help" />
          </ListItem>
        </List>
      </Drawer>

      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static" sx={{ backgroundColor: '#ff6b17' }}>
          <Toolbar>
            <MenuIcon
            size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
              onClick={() => setIsSidebarVisible(!isSidebarVisible)}
            ></MenuIcon>
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
    </div>
    
  );
}
