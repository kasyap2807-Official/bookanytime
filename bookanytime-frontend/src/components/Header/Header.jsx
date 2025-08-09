import React, { useState } from "react";
import { Link } from "react-router-dom";
import { AppBar, Toolbar, Button, Avatar, Box, IconButton, Drawer, List, ListItem, Menu, MenuItem } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import FavoriteIcon from "@mui/icons-material/Favorite";
import "bootstrap/dist/css/bootstrap.min.css";
import { getUserRole } from "../utils/auth"
import { useNavigate } from "react-router-dom";
import { AccountCircle, ExitToApp, Feedback, HelpOutline, AdminPanelSettings } from '@mui/icons-material';
import Background from "../../assets/background3_lightened.png"
// import Logo from "../../../public/lg.png"
const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const userRole = getUserRole(); // Get user role
  const navigate = useNavigate();


  console.log("user roleeeee", userRole.email)
  // Toggle mobile menu
  const toggleDrawer = () => {
    setMobileOpen(!mobileOpen);
  };

  // Handle Profile Dropdown
  const handleProfileClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("token"); // Clear token
    localStorage.removeItem("user"); // Clear user data
    navigate("/"); // Redirect to login page
    window.location.reload(); // Force reload to clear state
  };

  const isLoggedIn = !!localStorage.getItem("token");

  return (
    <AppBar
      position="fixed"
      sx={{
        // background: "linear-gradient(90deg, #6a11cb, #2575fc)",
        backgroundImage: `url(${Background})`,
        width: "100vw",
        zIndex: 1000,
        boxShadow: "none", // removes default shadow
fontSize:"12px",
fontFamily: `system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif !important`,

      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        {/* Logo */}
         {/* <Link to="/">
        <img src={Logo} alt="" style={{height:"50px", width:"50px"}}/>
        </Link>  */}

        <Link to="/" style={{ textDecoration: 'none', color: 'inherit'}}>
          <h3 className="text-white m-0">BookAnytime</h3>
        </Link>

        {/* Desktop Menu */}
        <Box
          sx={{
            display: { xs: "none", md: "flex" },
            alignItems: "center",
            gap: 2,
            flexWrap: "nowrap",
          }}
        >
          <Button color="inherit" component={Link} to="/search" sx={{ color: "white !important" }}>
            Search
          </Button>
          <Button color="inherit" component={Link} to="/list-your-property" sx={{ color: "white !important" }}>
            List Your Property
          </Button>
          <Button color="inherit" component={Link} to="/wishlist" startIcon={<FavoriteIcon />} sx={{ color: "white !important" }}>
            Wishlist
          </Button>

          {/* Profile Avatar with Dropdown */}
          <IconButton onClick={handleProfileClick}>
            <Avatar alt="Profile" src="/profile.jpg" sx={{ width: 40, height: 40 }} />
          </IconButton>

          {/* Dropdown Menu */}
          <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
  <MenuItem component={Link} to="/signup" onClick={handleClose}>
    <AccountCircle style={{ marginRight: 8 }} />
    Signup
  </MenuItem>

  {/* Show Login ONLY if NOT logged in */}
  {!isLoggedIn && (
    <MenuItem component={Link} to="/login" onClick={handleClose}>
      <ExitToApp style={{ marginRight: 8 }} />
      Login
    </MenuItem>
  )}

  <MenuItem
    component={Link}
    to="/admin"
    onClick={handleClose}
    style={{ display: getUserRole() === "admin" ? "block" : "none" }} // ✅ Hide if not admin
  >
    <AdminPanelSettings style={{ marginRight: 8 }} />
    Admin Panel
  </MenuItem>

  <MenuItem
    component={Link}
    to="/feedback"
    onClick={handleClose}
    style={{ display: localStorage.getItem("token") ? "block" : "none" }}
  >
    <Feedback style={{ marginRight: 8 }} />
    Feedback
  </MenuItem>

  <MenuItem
    component={Link}
    to="/help-center"
    onClick={handleClose}
    style={{ display: localStorage.getItem("token") ? "block" : "none" }}
  >
    <HelpOutline style={{ marginRight: 8 }} />
    Help Center
  </MenuItem>

  {isLoggedIn && (
    <MenuItem onClick={handleLogout}>
      <ExitToApp style={{ marginRight: 8 }} />
      Logout
    </MenuItem>
  )}
</Menu>
        </Box>

        {/* Mobile Menu Button */}
       {/* Mobile Menu + Avatar (Mobile Only) */}
<Box sx={{ display: { xs: "flex", md: "none" }, alignItems: "center", gap: 1 }}>
<IconButton onClick={handleProfileClick}>
    <Avatar alt="Profile" src="/profile.jpg" sx={{ width: 30, height: 30 }} />
  </IconButton>
  <IconButton sx={{ color: "white" }} onClick={toggleDrawer}>
    <MenuIcon />
  </IconButton>
 
</Box>


        {/* Mobile Drawer */}
        <Drawer anchor="right" open={mobileOpen} onClose={toggleDrawer}>
          <List sx={{ width: 250 }}>
            <ListItem button component={Link} to="/search" onClick={toggleDrawer}>
              Search
            </ListItem>
            <ListItem button component={Link} to="/list-your-property" onClick={toggleDrawer}>
              List Your Property
            </ListItem>
            <ListItem button component={Link} to="/wishlist" onClick={toggleDrawer}>
              <FavoriteIcon sx={{ mr: 1 }} /> Wishlist
            </ListItem>

            {/* Profile Avatar in Mobile Menu */}
            {/* <ListItem button onClick={handleProfileClick}>
              <Avatar alt="Profile" src="/profile.jpg" sx={{ width: 40, height: 40 }} />
            </ListItem> */}
          </List>
        </Drawer>
      </Toolbar>
    </AppBar>
  );
};

export default Header;