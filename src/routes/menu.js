import React from "react";
import {
  Home,
  AccountBalanceWallet,
  DriveEta,
  CreateNewFolder,
  LocalOffer,
  ListAlt,
  Equalizer,
  Build,
  Event,
  Assignment,
  List,
  Person,
} from "@material-ui/icons";

export const menus = (role) => {
  const routes = [];

  if (role === "ADM") {
    routes.push([
      {
        label: "Dashboard",
        link: "/dashboard",
        icon: <Home color="primary" />,
      },
      {
        label: "Cadastrar operador",
        link: "/operador",
        icon: <Person color="primary" />,
      },
      {
        label: "Fabricante",
        link: "/fabricante",
        icon: <CreateNewFolder color="primary" />,
      },
      {
        label: "Categoria",
        link: "/categoria",
        icon: <LocalOffer color="primary" />,
      },
      {
        label: "Produto",
        link: "/produto",
        icon: <DriveEta color="primary" />,
      },
      {
        label: "Estatísticas",
        link: "/estatisticas",
        icon: <Equalizer color="primary" />,
      },
      {
        label: "Serviços mecânicos",
        link: "/servicos",
        icon: <Build color="primary" />,
      },
    ]);
  } else if (role === "OPERADOR") {
    routes.push([
      {
        label: "Dashboard",
        link: "/dashboard",
        icon: <Home color="primary" />,
      },
      {
        label: "Orçamento",
        link: "/orcamento",
        icon: <AccountBalanceWallet color="primary" />,
      },
      {
        label: "Listagem orçamento",
        link: "/orcamento/listagem",
        icon: <ListAlt color="primary" />,
      },
      {
        label: "Ordem de serviço",
        link: "/ordem-servico",
        icon: <Assignment color="primary" />,
      },
      {
        label: "Listagem ordem de serviço",
        link: "/ordem-servico/listagem",
        icon: <List color="primary" />,
      },
    ]);
  } else if (role === "USUARIO") {
    routes.push([
      {
        label: "Dashboard",
        link: "/dashboard",
        icon: <Home color="primary" />,
      },
      {
        label: "Orçamento",
        link: "/orcamento-usuario",
        icon: <AccountBalanceWallet color="primary" />,
      },
      {
        label: "Agendar orçamento",
        link: "/agendar-servico",
        icon: <Event color="primary" />,
      },
      {
        label: "Listagem agendamento",
        link: "/agendar-servico-usuario",
        icon: <ListAlt color="primary" />,
      },
    ]);
  } else {
    routes.push([
      {
        label: "Home",
        link: "/",
        icon: <Home color="primary" />,
      },
    ]);
  }

  return routes;
};
