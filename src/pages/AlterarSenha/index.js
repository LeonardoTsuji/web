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

export default function AlterarSenha({ history, location }) {
  const [state, setState] = useState({
    loading: false,
    success: false,
  });
  const [modal, setModal] = useState({
    open: false,
    text: "",
    success: false,
  });
  const [token, setToken] = useState("");
  const [senha, setSenha] = useState({
    valor: "",
    mostraSenha: false,
    erro: false,
  });
  const [confirmaSenha, setConfirmaSenha] = useState({
    valor: "",
    mostraSenha: false,
    erro: false,
  });

  const onSubmit = async (event) => {
    event.preventDefault();
    if (senha.valor !== confirmaSenha.valor) {
      setSenha({ ...senha, erro: true });
      setConfirmaSenha({ ...confirmaSenha, erro: true });
    } else {
      try {
        localStorage.setItem("tokens", token);
        const response = await api.post("/alterar-senha", {
          password: senha.valor,
        });
        if (response.status === 200) {
          setModal({
            open: true,
            text: "Senha alterada com sucesso!",
            success: true,
          });
        }
      } catch (error) {
        setModal({
          open: true,
          text: error.response?.data?.message || "Erro ao alterar a senha",
          success: false,
        });
      }
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
            <Typography component="h1" variant="h4">
              Alterar senha
            </Typography>

            <form onSubmit={onSubmit}>
              <Grid container justify="flex-start" spacing={2}>
                <Grid item xs={12} sm={12} md={12} lg={12}>
                  <ContainerTitle>
                    <Typography component="body2">
                      Informe o token que foi enviado no seu e-mail
                    </Typography>
                  </ContainerTitle>
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={12} md={12} lg={12}>
                  <TextField
                    name="token"
                    required
                    label="Token"
                    type="text"
                    variant="outlined"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={12}>
                  <FormControl variant="outlined" fullWidth error={senha.erro}>
                    <InputLabel htmlFor="senha">Senha</InputLabel>
                    <OutlinedInput
                      id="senha"
                      type={senha.mostraSenha ? "text" : "password"}
                      value={senha.valor}
                      onChange={(e) =>
                        setSenha({
                          ...senha,
                          valor: e.target.value,
                        })
                      }
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            onClick={(e) =>
                              setSenha({
                                ...senha,
                                mostraSenha: !senha.mostraSenha,
                              })
                            }
                            onMouseDown={(e) => e.preventDefault()}
                            edge="end"
                          >
                            {senha.mostraSenha ? (
                              <Visibility />
                            ) : (
                              <VisibilityOff />
                            )}
                          </IconButton>
                        </InputAdornment>
                      }
                      labelWidth={70}
                    />
                    {senha.erro ? (
                      <FormHelperText>
                        É necessário digitar a mesma senha
                      </FormHelperText>
                    ) : null}
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={12}>
                  <FormControl
                    variant="outlined"
                    fullWidth
                    error={confirmaSenha.erro}
                  >
                    <InputLabel htmlFor="senha">Confirmar senha</InputLabel>
                    <OutlinedInput
                      id="senha"
                      type={confirmaSenha.mostraSenha ? "text" : "password"}
                      value={confirmaSenha.valor}
                      onChange={(e) =>
                        setConfirmaSenha({
                          ...confirmaSenha,
                          valor: e.target.value,
                        })
                      }
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={() =>
                              setConfirmaSenha({
                                ...confirmaSenha,
                                mostraSenha: !confirmaSenha.mostraSenha,
                              })
                            }
                            onMouseDown={(e) => e.preventDefault()}
                            edge="end"
                          >
                            {confirmaSenha.mostraSenha ? (
                              <Visibility />
                            ) : (
                              <VisibilityOff />
                            )}
                          </IconButton>
                        </InputAdornment>
                      }
                      labelWidth={70}
                    />
                    {confirmaSenha.erro ? (
                      <FormHelperText>
                        É necessário digitar a mesma senha
                      </FormHelperText>
                    ) : null}
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={12}>
                  <Button variant="contained" color="primary" type="submit">
                    Alterar
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
