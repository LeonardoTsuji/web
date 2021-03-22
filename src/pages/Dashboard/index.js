import React, { useState, useEffect } from "react";

export default function Home() {
  const [usuario, setUsuario] = useState("");

  useEffect(() => {
    setUsuario(localStorage.getItem("role"));
  }, []);
  return <div>Olá</div>;
}
