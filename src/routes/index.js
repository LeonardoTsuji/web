import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
} from "react-router-dom";
import { pages } from "./pages";
import { menus } from "./menu";
import Layout from "../components/core/Navigation/Drawer";
import { useAuth } from "../contexts/auth";

export default function Routes() {
  const { authTokens, role } = useAuth();

  const PrivateRoute = ({ component: Component, roles, ...rest }) => (
    <Route
      {...rest}
      render={(props) => {
        if (roles.includes(role) && authTokens) {
          return (
            <Layout
              page={Component}
              menus={menus(role)}
              title={""}
              {...props}
            />
          );
        } else if (props.location.pathname === "/") {
          return <Redirect to="/" />;
        }

        return <Redirect to="/login" />;
      }}
    />
  );

  return (
    <Router>
      <Switch>
        <Route path="/login" component={pages.Login} />
        <Route path="/auth/facebook" component={pages.LoginFacebook} />
        <Route path="/cadastrar-senha" component={pages.CadastrarSenha} />
        <Route
          exact
          path="/"
          component={pages.Home}
          roles={["OPERADOR", "ADM", "USUARIO"]}
        />
        <PrivateRoute
          exact
          path="/dashboard"
          component={pages.Dashboard}
          roles={["OPERADOR", "ADM", "USUARIO"]}
        />
        {/* USUARIO */}

        <PrivateRoute
          exact
          path="/orcamento-usuario"
          component={pages.OrcamentoUsuario}
          roles={["USUARIO"]}
        />
        <PrivateRoute
          exact
          path="/orcamento-usuario/listagem"
          component={pages.ListagemOrcamentoUsuario}
          roles={["USUARIO"]}
        />
        <PrivateRoute
          exact
          path="/agendar-servico"
          component={pages.AgendarServico}
          roles={["USUARIO"]}
        />
        <PrivateRoute
          exact
          path="/agendar-servico-usuario"
          component={pages.AgendarServicoUsuario}
          roles={["USUARIO"]}
        />
        <PrivateRoute
          exact
          path="/ordem-servico-usuario"
          component={pages.ListagemOrdemServicoUsuario}
          roles={["USUARIO"]}
        />
        {/* OPERADOR/ADM */}
        <PrivateRoute
          exact
          path="/agenda/listagem"
          component={pages.ListagemAgendamento}
          roles={["OPERADOR", "ADM"]}
        />
        <PrivateRoute
          exact
          path="/orcamento"
          component={pages.Orcamento}
          roles={["OPERADOR", "ADM"]}
        />
        <PrivateRoute
          exact
          path="/orcamento/listagem"
          component={pages.ListagemOrcamento}
          roles={["OPERADOR", "ADM"]}
        />
        <PrivateRoute
          exact
          path="/ordem-servico"
          component={pages.OrdemServico}
          roles={["OPERADOR", "ADM"]}
        />
        <PrivateRoute
          exact
          path="/ordem-servico/listagem"
          component={pages.ListagemOrdemServico}
          roles={["OPERADOR", "ADM"]}
        />
        {/* ADM */}
        <PrivateRoute
          exact
          path="/servicos"
          component={pages.ServicosMecanicos}
          roles={["ADM"]}
        />
        <PrivateRoute
          path="/fabricante"
          component={pages.Fabricante}
          roles={["ADM"]}
        />
        <PrivateRoute
          path="/categoria"
          component={pages.Categoria}
          roles={["ADM"]}
        />
        <PrivateRoute
          path="/produto"
          component={pages.Produto}
          roles={["ADM"]}
        />
        <PrivateRoute
          exact
          path="/estatisticas"
          component={pages.Estatistica}
          roles={["ADM"]}
        />
        <PrivateRoute
          exact
          path="/permissoes"
          component={pages.Permissoes}
          roles={["ADM"]}
        />
        <PrivateRoute
          exact
          path="/operador"
          component={pages.CadastrarOperador}
          roles={["ADM"]}
        />
        <Route
          component={pages.Page404}
          roles={["OPERADOR", "ADM", "USUARIO"]}
        />
      </Switch>
    </Router>
  );
}
