import React from "react";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function CustomizedSnackbars(props) {
  const [open, setOpen] = React.useState(props.open);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };
  return (
    <div>
      <Snackbar
        key={props.key}
        open={open}
        autoHideDuration={2000}
        onClose={handleClose}
      >
        <Alert severity={props.severity}>{props.text}</Alert>
      </Snackbar>
    </div>
  );
}
