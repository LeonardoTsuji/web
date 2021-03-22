import React from "react";
import CadastrarSenha from "../../components/CadastrarSenha";

export default function CadastrarOperador({ history, location }) {
  return (
    <div>
      <CadastrarSenha location={location} role="OPERADOR" />
    </div>
  );
}
