import React from "react";
import Modal from "@material-ui/core/Modal";

export default function ModalComponent(props) {
  return (
    <>
      <Modal open={props.open}>{props.children}</Modal>
    </>
  );
}
