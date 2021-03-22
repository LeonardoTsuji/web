import React, { useState, useEffect } from "react";
import Typography from "@material-ui/core/Typography";
import Charts from "../../components/core/Charts";
import api from "../../services/api";

export default function Estatistica() {
  const [agendamento, setAgendamento] = useState([]);
  const [orcamento, setOrcamento] = useState([]);
  const [ordemServico, setOrdemServico] = useState([]);

  useEffect(() => {
    const init = async () => {
      const responseAgendamentosFinalizado = await api.get(
        "/agenda/0/estatistica",
        {
          params: {
            status: "FINALIZADO",
          },
        }
      );
      const responseAgendamentosAtivos = await api.get(
        "/agenda/0/estatistica",
        {
          params: {
            status: "ATIVO",
          },
        }
      );
      const responseAgendamentosCancelados = await api.get(
        "/agenda/0/estatistica",
        {
          params: {
            status: "CANCELADO",
          },
        }
      );
      const responseOrcamentoAprovado = await api.get(
        "/orcamento/0/estatistica",
        {
          params: {
            status: "APROVADO",
          },
        }
      );
      const responseOrcamentoPendente = await api.get(
        "/orcamento/0/estatistica",
        {
          params: {
            status: "PENDENTE",
          },
        }
      );
      const responseOrcamentoRecusado = await api.get(
        "/orcamento/0/estatistica",
        {
          params: {
            status: "RECUSADO",
          },
        }
      );
      const responseOrdemServicoFinalizado = await api.get(
        "/ordem-servico/0/estatistica",
        {
          params: {
            done: true,
          },
        }
      );
      const responseOrdemServicoAFinalizar = await api.get(
        "/ordem-servico/0/estatistica",
        {
          params: {
            done: false,
          },
        }
      );
      const responseOrdemServicoPago = await api.get(
        "/ordem-servico/0/estatistica",
        {
          params: {
            paid: true,
          },
        }
      );
      const responseOrdemServicoNaoPago = await api.get(
        "/ordem-servico/0/estatistica",
        {
          params: {
            paid: false,
          },
        }
      );

      setAgendamento([
        {
          name: "Ativos",
          value: responseAgendamentosAtivos.data.data.count,
        },
        {
          name: "Finalizados",
          value: responseAgendamentosFinalizado.data.data.count,
        },
        {
          name: "Cancelados",
          value: responseAgendamentosCancelados.data.data.count,
        },
      ]);

      setOrcamento([
        {
          name: "Aprovados",
          value: responseOrcamentoAprovado.data.data.count,
        },
        {
          name: "Pendentes",
          value: responseOrcamentoPendente.data.data.count,
        },
        {
          name: "Recusados",
          value: responseOrcamentoRecusado.data.data.count,
        },
      ]);

      setOrdemServico([
        {
          name: "Ativos",
          value: responseOrdemServicoAFinalizar.data.data.count,
        },
        {
          name: "Finalizados",
          value: responseOrdemServicoFinalizado.data.data.count,
        },
      ]);
    };

    init();
  }, []);

  return (
    <>
      <Typography variant="h6" align="center">
        Agendamentos
      </Typography>
      <Charts data={agendamento} />
      <Typography variant="h6" align="center">
        Orçamentos
      </Typography>
      <Charts data={orcamento} />
      <Typography variant="h6" align="center">
        Ordem serviço
      </Typography>
      <Charts data={ordemServico} />
    </>
  );
}
