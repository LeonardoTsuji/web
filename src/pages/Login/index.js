import React, { useState, useContext } from "react";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import LinearProgress from "@material-ui/core/LinearProgress";
import Dialog from "../../components/core/Feedback/Dialog";
import api from "../../services/api";
import facebookLoginUrl from "../../services/facebook";
import urlParams from "../../services/facebook-code";
import { useAuth } from "../../contexts/auth";
import wallpaper from "../../assets/images/logo.jpg";

import {
  Container,
  Page,
  LoginPanel,
  ContainerLogo,
  LoginHeader,
  LoginBody,
  ContainerTitle,
} from "./styles";

export default function Login({ history }) {
  const [modal, setModal] = useState({ open: false, text: "" });
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const { setAuthTokens, setRole, setId } = useAuth();

  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await api.post("/login", {
        email,
        password: senha,
      });

      if (response.status === 200) {
        const responserRole = await api.get(
          `/regra/${response.data.data.roleId}`
        );

        if (responserRole.status === 200) {
          setAuthTokens(response.data.metadata.token);
          setRole(responserRole.data.data.name);
          setId(responserRole.data.data.id);
          history.push("/dashboard");
        } else {
          setModal({
            open: true,
            text: "Erro ao efetuar o login",
          });
        }
      } else {
        setModal({
          open: true,
          text: "Erro ao efetuar o login",
        });
      }
    } catch (error) {
      setModal({
        open: true,
        text: error.response?.data?.message || "Erro ao efetuar o login",
      });
    }
  };

  const handleLoginFacebook = async () => {
    window.location.href = facebookLoginUrl;
  };

  return (
    <Container>
      <Page>
        <Grid container xs={12} spacing={0}>
          <Grid item xs={12} sm={12}>
            <ContainerLogo src={wallpaper} />
          </Grid>
          <Grid container xs={12} sm={12} style={{ background: "#fff" }}>
            <LoginBody>
              <ContainerTitle>
                <Typography component="h1" variant="h4">
                  Login
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
                    <TextField
                      name="senha"
                      required
                      label="Senha"
                      variant="outlined"
                      type="password"
                      value={senha}
                      onChange={(e) => setSenha(e.target.value)}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={12} lg={12}>
                    <Button variant="contained" color="primary" type="submit">
                      Entrar
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={12} md={12} lg={12}>
                    <Button
                      color="secondary"
                      onClick={() => history.push("/cadastrar-senha")}
                    >
                      Ainda não tem uma conta? Criar
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={12} md={12} lg={12}>
                    <Button
                      style={{
                        backgroundColor: "#1877f2",
                        color: "#fff",
                        fontWeight: "bold",
                      }}
                      onClick={() => handleLoginFacebook()}
                    >
                      Login com Facebook
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
      </Page>
    </Container>
  );
}
