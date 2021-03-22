import React from "react";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";

export function CircularIndeterminate() {
  const [open, setOpen] = React.useState(true);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Backdrop open={open} onClick={handleClose}>
      <CircularProgress color="primary" />
    </Backdrop>
  );
}
