import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import SendIcon from "@material-ui/icons/Send";
import CancelIcon from "@material-ui/icons/Cancel";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import WarningIcon from "@material-ui/icons/Warning";
import { ContainerTitle } from "./styles";

export default function AlertDialog(props) {
  return (
    <div>
      <Dialog open={props.open}>
        <ContainerTitle>
          <DialogTitle>
            {props.success ? (
              <CheckCircleIcon color="primary" style={{ marginRight: 15 }} />
            ) : (
              <WarningIcon color="error" style={{ marginRight: 15 }} />
            )}
            {props.title}
          </DialogTitle>
        </ContainerTitle>
        <DialogContent>
          <DialogContentText>{props.text}</DialogContentText>
          {props.children}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={props.handleClose}
            color="primary"
            variant="contained"
            startIcon={<CancelIcon />}
          >
            Fechar
          </Button>
          <Button
            onClick={props.handleClick}
            color="secondary"
            variant="contained"
            autoFocus
            startIcon={<SendIcon />}
          >
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
