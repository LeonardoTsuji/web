import React, { useState } from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import Switch from "@material-ui/core/Switch";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormGroup from "@material-ui/core/FormGroup";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import Menu from "../../Navigation/Menu";
import { ExitToApp } from "@material-ui/icons";
import { useAuth } from "../../../../contexts/auth";
import { useStyles } from "./styles";

export default function MenuAppBar({ menus, title, page, props }) {
  const classes = useStyles();
  const [auth, setAuth] = React.useState(true);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [state, setState] = useState(false);
  const { logout } = useAuth();

  const toggleDrawer = (open) => {
    setState(open);
  };

  const handleChange = (event) => {
    setAuth(event.target.checked);
  };

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="menu"
            onClick={() => toggleDrawer(true)}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            {title}
          </Typography>
          <IconButton
            edge="end"
            aria-label="account of current user"
            aria-haspopup="true"
            onClick={logout}
            color="inherit"
            label="Sair"
          >
            <ExitToApp />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer anchor={"left"} open={state} onClose={() => toggleDrawer(false)}>
        <List>
          <Menu menus={menus} />
        </List>
      </Drawer>
      {React.createElement(page, props)}
    </div>
  );
}
