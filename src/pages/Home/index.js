import React, { useState, useEffect } from "react";
import Grid from "@material-ui/core/Grid";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";
import Card from "../../components/core/Surfaces/Card";
import Typography from "@material-ui/core/Typography";
import { Build } from "@material-ui/icons";
import api from "../../services/api";
import {
  Container,
  Wallpaper,
  ContainerTitle,
  ContainerSubtitle,
  CardHeader,
} from "./styles";
import wallpaper from "../../assets/images/car.jpg";

export default function Home({ history }) {
  const [servicos, setServicos] = useState([]);
  useEffect(() => {
    const init = async () => {
      try {
        const response = await api.get("/servico-mecanico");
        setServicos(response.data.data);
      } catch (err) {}
    };
    init();
  }, []);

  return (
    <>
      <AppBar
        color="inherit"
        position="static"
        style={{ backgroundColor: "#111" }}
      >
        <Toolbar style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            style={{ color: "#f1f1f1" }}
            onClick={() => history.push("/login")}
          >
            Login
          </Button>
        </Toolbar>
      </AppBar>
      <Grid container>
        <Wallpaper src={wallpaper}>
          <ContainerTitle>
            <Typography
              style={{ color: "#fff", fontSize: "4rem" }}
              variant="h1"
            >
              Premium Car
            </Typography>
          </ContainerTitle>
        </Wallpaper>
      </Grid>
      <Grid container justify="center" alignItems="center">
        <ContainerSubtitle>
          <Typography variant="h4" style={{ fontWeight: 700 }}>
            SERVIÇOS
          </Typography>
        </ContainerSubtitle>
        <Container>
          <Grid container>
            {servicos &&
              servicos.map((servico) => (
                <Grid item xs={12} sm={12} md={4} lg={4}>
                  <Card
                    title={
                      <CardHeader>
                        <Build style={{ paddingBottom: 15, paddingTop: 15 }} />
                        {servico.name}
                      </CardHeader>
                    }
                    text={servico.description}
                  />
                </Grid>
              ))}
          </Grid>
        </Container>
      </Grid>
      <Grid
        container
        justify="center"
        direction="column"
        alignContent="center"
        alignItems="center"
        style={{ padding: "15px", backgroundColor: "#111" }}
      >
        <Typography variant="h6" style={{ color: "#fff" }}>
          Nossa Localização
        </Typography>
        <Typography variant="body2" style={{ color: "#fff" }}>
          Rua Campos Salles, 3039 - Vila Falcão Bauru, SP - CEP: 17050-000
        </Typography>
        <br />{" "}
        <Typography variant="h6" style={{ color: "#fff" }}>
          Entre em contato conosco
        </Typography>
        <Typography variant="body2" style={{ color: "#fff" }}>
          (14) 3214-1841 (14) 3021-8805
        </Typography>
      </Grid>
    </>
  );
}
