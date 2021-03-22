import React from "react";
import AppBar from "../../Surfaces/AppBar";

export default function TemporaryDrawer(props) {
  const { menus, title, page } = props;

  return (
    <div>
      <AppBar menus={menus} title={title} page={page} props={props} />
    </div>
  );
}
