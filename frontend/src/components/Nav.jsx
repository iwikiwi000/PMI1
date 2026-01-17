import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from "@mui/icons-material/Close";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItemText from "@mui/material/ListItemText";
import { Link, useNavigate } from 'react-router-dom';
import ListItemButton from "@mui/material/ListItemButton";
import { useState, useEffect } from 'react';
import { useAuthStore } from '../storage/authStorage';
import '../css/nav.css';

export default function Nav() {
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const { isAuthenticated, checkAuth, logout } = useAuthStore();
  const [authChecked, setAuthChecked] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
  // ✅ DEBUG LOGS
  console.log('🔴 LOGOUT START - isAuthenticated:', isAuthenticated);
  
  // ✅ 1. VYČIŤ VŠETKO IHNEĎ
  sessionStorage.clear();  // ✅ sessionStorage.clear() namiesto removeItem
  localStorage.clear();    // ✅ Pre istotu
  
  // ✅ 2. Force zustand update
  logout();
  
  // ✅ 3. DELAY kvôli zustand re-render
  setTimeout(() => {
    console.log('🟢 LOGOUT DONE - navigate to /');
    navigate("/", { replace: true });
  }, 300);  // ✅ 300ms čakanie
};


  useEffect(() => {
    checkAuth();
    setAuthChecked(true);
  }, []);

  if (!authChecked) {
    return (
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static" sx={{ backgroundColor: '#ff6b17' }}>
          <Toolbar>
            <Typography 
              variant="h6" 
              sx={{ flexGrow: 1, textAlign: 'center' }}
            >
              FEIT Security
            </Typography>
          </Toolbar>
        </AppBar>
      </Box>
    );
  }

  return (
    <div>
      {isAuthenticated && (
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
            <ListItemButton 
              component={Link} 
              to="/cameras" 
              onClick={() => setIsSidebarVisible(false)}
            >
              <ListItemText primary="Kamery" />
            </ListItemButton>

            <ListItemButton 
              component={Link} 
              to="/footage" 
              onClick={() => setIsSidebarVisible(false)}
            >
              <ListItemText primary="Záznam" />
            </ListItemButton>

            <ListItemButton 
              component={Link} 
              to="https://cloudsso.hikvision.com/login?service=https://www.hikvision.com/sso/login-redirect" 
              onClick={() => setIsSidebarVisible(false)}
            >
              <ListItemText primary="Nastavenia" />
            </ListItemButton>
          </List>
        </Drawer>
      )}

      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static" sx={{ backgroundColor: '#ff6b17' }}>
          <Toolbar>
            {isAuthenticated && (
              <MenuIcon
                size="large"
                edge="start"
                color="inherit"
                sx={{ mr: 2 }}
                onClick={() => setIsSidebarVisible(!isSidebarVisible)}
              />
            )}
            
            <Typography 
              variant="h6" 
              sx={{ 
                flexGrow: 1, 
                textAlign: 'center',
                mx: 'auto'
              }}
            >
              FEIT Security
            </Typography>
            
            {isAuthenticated && (
              <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>
            )}
          </Toolbar>
        </AppBar>
      </Box>
    </div>
  );
}
