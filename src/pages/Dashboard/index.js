import React, { useState, useEffect } from "react";
import Estatisticas from "../../components/Estatisticas";

export default function Dashboard() {
  const [usuario, setUsuario] = useState("");

  useEffect(() => {
    setUsuario(localStorage.getItem("role"));
  }, []);

  if (usuario === "ADM") return <Estatisticas />;

  return <></>;
}
