import React, { useState, useEffect } from "react";
import Typography from "@material-ui/core/Typography";
import Charts from "../../components/core/Charts";
import BarCharts from "../../components/core/BarCharts";
import api from "../../services/api";

export default function Estatistica() {
  const [agendamento, setAgendamento] = useState([]);
  const [orcamento, setOrcamento] = useState([]);
  const [ordemServico, setOrdemServico] = useState([]);
  const [orcamentoMes, setOrcamentoMes] = useState([]);
  const [ordemServicoMes, setOrdemServicoMes] = useState([]);

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
      const responseOrcamentoMes = await api.get("orcamento/0/estatistica/mes");
      const responseOrdemServicoMes = await api.get(
        "ordem-servico/0/estatistica/mes"
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

      if (
        responseOrcamentoMes.data &&
        responseOrcamentoMes.data.data &&
        responseOrcamentoMes.data.data.count
      ) {
        let meses = {
          1: { name: "Janeiro", uv: "" },
          2: { name: "Fevereiro", uv: "" },
          3: { name: "Março", uv: "" },
          4: { name: "Abril", uv: "" },
          5: { name: "Maio", uv: "" },
          6: { name: "Junho", uv: "" },
          7: { name: "Julho", uv: "" },
          8: { name: "Agosto", uv: "" },
          9: { name: "Setembro", uv: "" },
          10: { name: "Outubro", uv: "" },
          11: { name: "Novembro", uv: "" },
          12: { name: "Dezembro", uv: "" },
        };

        responseOrcamentoMes.data.data.count.forEach((mes) => {
          meses[mes.month].uv = mes.quantity;
        });
        setOrcamentoMes(Object.entries(meses).map((e) => e[1]));
      }

      if (
        responseOrdemServicoMes.data &&
        responseOrdemServicoMes.data.data &&
        responseOrdemServicoMes.data.data.count
      ) {
        let meses = {
          1: { name: "Janeiro", uv: "" },
          2: { name: "Fevereiro", uv: "" },
          3: { name: "Março", uv: "" },
          4: { name: "Abril", uv: "" },
          5: { name: "Maio", uv: "" },
          6: { name: "Junho", uv: "" },
          7: { name: "Julho", uv: "" },
          8: { name: "Agosto", uv: "" },
          9: { name: "Setembro", uv: "" },
          10: { name: "Outubro", uv: "" },
          11: { name: "Novembro", uv: "" },
          12: { name: "Dezembro", uv: "" },
        };

        responseOrdemServicoMes.data.data.count.forEach((mes) => {
          meses[mes.month].uv = mes.quantity;
        });
        setOrdemServicoMes(Object.entries(meses).map((e) => e[1]));
      }
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
        Ordens serviço
      </Typography>
      <Charts data={ordemServico} />
      <Typography variant="h6" align="center">
        Orçamentos por mês
      </Typography>
      <BarCharts data={orcamentoMes} />
      <Typography variant="h6" align="center">
        Ordens serviço por mês
      </Typography>
      <BarCharts data={ordemServicoMes} />
    </>
  );
}
