import React, { Fragment } from "react";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Collapse from "@material-ui/core/Collapse";
import { ExpandLess, ExpandMore } from "@material-ui/icons";
import { Link } from "react-router-dom";

export default function Menu({ menus }) {
  const [open, setOpen] = React.useState(true);

  const handleClick = () => {
    setOpen(!open);
  };

  if (menus) {
    const itens = (itens) => {
      return (
        itens &&
        itens.map((item) => (
          <Fragment key={item.label}>
            <ListItem component={Link} to={item.link} button>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItem>
            <Divider />
          </Fragment>
        ))
      );
    };

    return (
      menus &&
      menus.map((item) => (
        <Fragment key={item.label}>
          <List>{itens(item)}</List>
        </Fragment>
      ))
    );
  }

  return null;
}
