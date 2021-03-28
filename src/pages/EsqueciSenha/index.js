import React, { useState, useEffect } from "react";
import Grid from "@material-ui/core/Grid";
import FormControl from "@material-ui/core/FormControl";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import InputLabel from "@material-ui/core/InputLabel";
import InputAdornment from "@material-ui/core/InputAdornment";
import FormHelperText from "@material-ui/core/FormHelperText";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import LinearProgress from "@material-ui/core/LinearProgress";
import Dialog from "../../components/core/Feedback/Dialog";
import { Visibility, VisibilityOff } from "@material-ui/icons";
import api from "../../services/api";
import {
  Container,
  Page,
  LoginPanel,
  ContainerLogo,
  LoginHeader,
  LoginBody,
  ContainerTitle,
} from "./styles";
import wallpaper from "../../assets/images/logo.jpg";

export default function EsqueciSenha({ history, location }) {
  const [state, setState] = useState({
    loading: false,
    success: false,
  });
  const [modal, setModal] = useState({
    open: false,
    text: "",
    success: false,
  });
  const [email, setEmail] = useState("");

  const onSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await api.post("/esqueci-senha", {
        email,
      });
      if (response.status === 200) {
        setModal({
          open: true,
          text: "Um e-mail foi enviado para a sua conta!",
          success: true,
        });
      }
    } catch (error) {
      setModal({
        open: true,
        text: error.response?.data?.message || "Erro ao enviar o e-mail",
        success: false,
      });
    }
  };

  if (state.loading) return <LinearProgress />;

  return (
    <>
      <Grid container xs={12} spacing={0}>
        <Grid item xs={12} sm={12}>
          <ContainerLogo src={wallpaper} />
        </Grid>
        <Grid container xs={12} sm={12} style={{ background: "#fff" }}>
          <LoginBody>
            <ContainerTitle>
              <Typography component="h1" variant="h4">
                Esqueci minha senha
              </Typography>
            </ContainerTitle>
            <form onSubmit={onSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={12} md={12} lg={12}>
                  <TextField
                    name="email"
                    required
                    label="E-mail"
                    type="email"
                    variant="outlined"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={12}>
                  <Button variant="contained" color="primary" type="submit">
                    Confirmar
                  </Button>
                </Grid>
              </Grid>
            </form>
          </LoginBody>
        </Grid>
      </Grid>
      <Dialog
        open={modal.open}
        title={modal.text}
        success={modal.success}
        handleClick={() => setModal({ ...modal, open: true })}
        handleClose={() => setModal({ ...modal, open: false })}
      />
    </>
  );
}
