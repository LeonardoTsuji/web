import React, { useEffect } from "react";
import { useAuth } from "../../contexts/auth";
import urlParams from "../../services/facebook-code";
import api from "../../services/api";

export default function LoginFacebook({ history }) {
  const { setAuthTokens, setRole, setId } = useAuth();

  useEffect(() => {
    const init = async () => {
      try {
        const responseFacebook = await api.post("/facebook", {
          code: urlParams.code,
        });

        const responseRole = await api.get(
          `/regra/${responseFacebook.data.data.roleId}`
        );

        localStorage.clear();

        setAuthTokens(responseFacebook.data.metadata.token);
        setRole(responseRole.data.data.name);
        setId(responseFacebook.data.data.id);
        history.push("/dashboard");
      } catch (error) {
        history.push("/cadastrar-senha", {
          nome: error.response?.data?.data?.name,
          email: error.response?.data?.data?.email,
        });
      }
    };

    init();
  }, []);

  return <div></div>;
}
