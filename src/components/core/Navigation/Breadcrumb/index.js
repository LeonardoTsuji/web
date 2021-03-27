/* eslint-disable no-nested-ternary */
import React from "react";
import Link from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import { Route, MemoryRouter } from "react-router";
import { Link as RouterLink } from "react-router-dom";

const LinkRouter = (props) => <Link {...props} component={RouterLink} />;

export default function Breadcrumb() {
  return (
    <div style={{ padding: 15 }}>
      <Route>
        <div>
          <Route>
            {({ location }) => {
              const pathnames = location.pathname.split("/").filter((x) => x);

              return (
                <Breadcrumbs>
                  <LinkRouter color="inherit" to="/dashboard">
                    Home
                  </LinkRouter>
                  {pathnames.map((value, index) => {
                    const last = index === pathnames.length - 1;
                    const to = `/${pathnames.slice(0, index + 1).join("/")}`;

                    return last ? (
                      <Typography color="textPrimary" key={to}>
                        {value}
                      </Typography>
                    ) : (
                      <LinkRouter color="inherit" to={to} key={to}>
                        {value}
                      </LinkRouter>
                    );
                  })}
                </Breadcrumbs>
              );
            }}
          </Route>
        </div>
      </Route>
    </div>
  );
}
