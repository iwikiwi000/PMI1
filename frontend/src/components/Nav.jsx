import { useState } from "react";
import {
  AppBar, Box, Toolbar, Typography,
  Button, IconButton, Drawer,
  List, ListItemButton, ListItemText
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../storage/authStorage";

export default function Nav() {
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  return (
    <>
      {isAuthenticated && (
        <Drawer
          anchor="left"
          open={isSidebarVisible}
          onClose={() => setIsSidebarVisible(false)}
          PaperProps={{ sx: { width: 250 } }}
        >
          <IconButton onClick={() => setIsSidebarVisible(false)}>
            <CloseIcon />
          </IconButton>

          <List>
            <ListItemButton component={Link} to="/cameras">
              <ListItemText primary="Kamery" />
            </ListItemButton>
            <ListItemButton component={Link} to="/footage">
              <ListItemText primary="Záznam" />
            </ListItemButton>
            <ListItemButton component={Link} to="/admin">
              <ListItemText primary="Správa" />
            </ListItemButton>
          </List>
        </Drawer>
      )}

      <AppBar position="static" sx={{ backgroundColor: "#ff6b17" }}>
        <Toolbar>
          {isAuthenticated && (
            <IconButton onClick={() => setIsSidebarVisible(true)}>
              <MenuIcon />
            </IconButton>
          )}

          <Typography sx={{ flexGrow: 1, textAlign: "center" }}>
            FEIT Security
          </Typography>

          {isAuthenticated && (
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          )}
        </Toolbar>
      </AppBar>
    </>
  );
}
