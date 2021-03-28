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
import CadastrarSenha from "../../components/CadastrarSenha";
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

export default function CadastrarSenhaPage({ history, location }) {
  const [state, setState] = useState({
    loading: false,
    success: false,
  });
  const [modal, setModal] = useState({ open: false, text: "" });
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [celular, setCelular] = useState("");
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

  useEffect(() => {
    if (location.state) {
      setNome(location.state.nome);
      setEmail(location.state.email);
    }
  }, []);

  const onSubmit = async (event) => {
    event.preventDefault();
    if (senha.valor !== confirmaSenha.valor) {
      setSenha({ ...senha, erro: true });
      setConfirmaSenha({ ...confirmaSenha, erro: true });
    } else {
      try {
        const responseRole = await api.get("/regra", {
          params: {
            name: "USUARIO",
          },
        });

        if (responseRole.status === 200) {
          const response = await api.post("/usuario", {
            email,
            password: senha.valor,
            name: nome,
            phone: celular,
            roleId: responseRole.data.data.id,
          });
          if (response.status === 201) {
            setModal({ open: true, text: "Sucesso ao cadastrar a senha!" });
          }
        } else {
          setModal({ open: true, text: "Erro ao cadastrar a senha" });
        }
      } catch (error) {
        setModal({ open: true, text: "Erro ao cadastrar a senha" });
      }
    }
  };

  if (state.loading) return <LinearProgress />;

  return (
    <Container>
      <Page>
        <CadastrarSenha location={location} />
      </Page>
    </Container>
  );
}
