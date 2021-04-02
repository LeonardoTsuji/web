import React, { useState, useEffect } from "react";

import { format, isBefore, parseISO } from "date-fns";

import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormLabel from "@material-ui/core/FormLabel";
import RadioGroup from "@material-ui/core/RadioGroup";
import Radio from "@material-ui/core/Radio";
import Button from "@material-ui/core/Button";
import Tooltip from "@material-ui/core/Tooltip";
import { CircularIndeterminate } from "../../components/core/Feedback/Progress";
import Dialog from "../../components/core/Feedback/Dialog";
import DialogConfirm from "../../components/core/Feedback/DialogConfirm";
import Table from "../../components/core/DataDisplay/TableCRUD";
import {
  Assignment,
  Delete,
  Add,
  DriveEta,
  Build,
  MonetizationOn,
  CheckCircle,
  AirportShuttleTwoTone,
} from "@material-ui/icons";
import api from "../../services/api";
import { useAuth } from "../../contexts/auth";
import {
  Container,
  ContainerModal,
  ContainerLabel,
  ContainerCarro,
  ContainerInfo,
  ContainerNovo,
  HeaderCarro,
  TitleCarro,
  Label,
  Value,
} from "./styles";

const handleColor = (status) => {
  if (status === "RECUSADO") return "red";
  else if (status === "PENDENTE") return "orange";
  else if (status === "APROVADO") return "green";
  else if (status === "FINALIZADO") return "blue";
  return "yellow";
};

export default function ListagemOrcamento({ history }) {
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState({
    open: false,
    text: "",
    success: true,
    hiddenIcon: false,
    children: null,
  });
  const [modalConfirm, setModalConfirm] = useState({
    open: false,
    text: "",
    handleClick: null,
    handleClose: null,
    children: null,
  });
  const [alert, setAlert] = useState({
    open: false,
    text: "",
    severity: "success",
    key: 0,
  });

  const [formaPagamento, setFormaPagamento] = useState("dinheiro");
  const [expiredBudget, setExpiredBudget] = useState({});

  const handleDelete = async (rowData) => {
    try {
      const response = await api.delete(`/orcamento/${rowData.id}`);
      setAlert({
        open: true,
        text: "Orçamento cancelado com sucesso!",
        severity: "success",
        key: new Date().getTime(),
      });
      setTimeout(() => {
        setLoading(true);
        setModalConfirm({
          open: false,
        });
      }, 1000);
    } catch (error) {
      setAlert({
        open: true,
        text: "Erro ao cancelar o orçamento!",
        severity: "error",
        key: new Date().getTime(),
      });
      setModalConfirm({
        open: false,
      });
    }
  };

  const handleAccept = async (rowData, paymentMethod) => {
    try {
      const response = await api.put(
        `/usuario/${rowData.userId}/orcamento/${rowData.id}`,
        {
          status: "APROVADO",
          paymentMethod,
        }
      );
      setAlert({
        open: true,
        text: "Orçamento aprovado com sucesso!",
        severity: "success",
        key: new Date().getTime(),
      });
      setTimeout(() => {
        setLoading(true);
        setModalConfirm({
          open: false,
        });
      }, 1000);
    } catch (error) {
      setAlert({
        open: true,
        text: "Erro ao cancelar o orçamento!",
        severity: "error",
        key: new Date().getTime(),
      });
      setModalConfirm({
        open: false,
      });
    }
  };

  const confirmDelete = (rowData) => {
    setModalConfirm({
      open: true,
      text: "Deseja cancelar o orçamento?",
      handleClick: async () => await handleDelete(rowData),
    });
  };

  useEffect(() => {
    const handleExpired = async () => {
      try {
        await api.put(`/orcamento/${expiredBudget.id}`, {
          status: "EXPIRADO",
        });
      } catch (err) {}
    };
    handleExpired();
  }, [expiredBudget]);

  const InfoOrcamento = ({ rowData }) => {
    const [carro, setCarro] = useState({
      modelo: "",
      placa: "",
      cor: "",
      quilometragem: "",
      ano: "",
      marca: "",
    });

    const [total, setTotal] = useState(0);

    const [columnsInfo, setColumnsInfo] = useState([
      { title: "Item", field: "name" },
      { title: "Preço", field: "price" },
      { title: "Quantidade", field: "budgetProduct.quantity" },
    ]);

    useEffect(() => {
      const init = async () => {
        try {
          const response = await api.get(
            `usuario/${rowData.userId}/veiculo/${rowData.userVehicleId}`
          );

          const responseTotal = await api.get(
            `usuario/${rowData.userId}/orcamento/${rowData.id}/valor`
          );

          setCarro({
            modelo: response.data.data[0]["vehicle.model.model"],
            placa: response.data.data[0]["vehicle.plate"],
            cor: response.data.data[0]["vehicle.color"],
            quilometragem: response.data.data[0]["vehicle.kilometer"],
            ano: response.data.data[0]["vehicle.year"],
            marca: response.data.data[0]["vehicle.brandId"],
          });

          setTotal(responseTotal.data.data.total);
        } catch (err) {}
      };

      init();
    }, []);

    return (
      <ContainerInfo>
        <ContainerCarro>
          <HeaderCarro>
            <TitleCarro>
              <DriveEta />
              <Typography variant="h6">Dados do veículo</Typography>
            </TitleCarro>
          </HeaderCarro>
          <ContainerModal>
            <ContainerLabel>
              <Label>Modelo:</Label>
              <Value>{carro.modelo}</Value>
            </ContainerLabel>
            <ContainerLabel>
              <Label>Placa:</Label>
              <Value>{carro.placa}</Value>
            </ContainerLabel>
            <ContainerLabel>
              <Label>Cor:</Label>
              <Value>{carro.cor}</Value>
            </ContainerLabel>
            <ContainerLabel>
              <Label>Quilometragem:</Label>
              <Value>{carro.quilometragem}km</Value>
            </ContainerLabel>
            <ContainerLabel>
              <Label>Ano:</Label>
              <Value>{carro.ano}</Value>
            </ContainerLabel>
            <ContainerLabel>
              <Label>Marca:</Label>
              <Value>{carro.marca}</Value>
            </ContainerLabel>
          </ContainerModal>
        </ContainerCarro>
        <ContainerCarro>
          <HeaderCarro>
            <TitleCarro>
              <Build />
              <Typography variant="h6">Itens do orçamento</Typography>
            </TitleCarro>
            <TitleCarro>
              <MonetizationOn />
              <Typography variant="h6">Total: R${total}</Typography>
            </TitleCarro>
            <ContainerModal>
              <Table
                title=""
                columns={columnsInfo}
                isLoading={loading}
                data={rowData.products}
                handleSelectedDelete={null}
                actions={false}
                selection={false}
                editable={false}
                alertOpen={alert.open}
                alertText={alert.text}
                alertSeverity={alert.severity}
              />
            </ContainerModal>
          </HeaderCarro>
        </ContainerCarro>
      </ContainerInfo>
    );
  };

  const handleAcoes = (rowData) => {
    if (rowData.status === "PENDENTE") {
      if (
        isBefore(
          new Date(),
          new Date(format(new Date(rowData.expirationDate), "MM-dd-yyyy"))
        )
      ) {
        return (
          <>
            <Tooltip title="Recusar">
              <IconButton onClick={() => confirmDelete(rowData)}>
                <Delete color="error" />
              </IconButton>
            </Tooltip>
          </>
        );
      } else {
        setExpiredBudget(rowData);
      }
    }

    return;
  };

  const [orcamento, setOrcamento] = useState([]);
  const [columns, setColumns] = useState([
    { title: "Número orçamento", field: "id" },
    {
      title: "Status do orçamento",
      field: "status",
      render: (rowData) => (
        <Typography
          variant="body2"
          style={{ color: handleColor(rowData.status), fontWeight: 600 }}
        >
          {rowData.status}
        </Typography>
      ),
    },
    { title: "Forma de pagamento", field: "paymentMethod" },
    {
      title: "Validade do orçamento",
      field: "expirationDate",
      render: (rowData) => (
        <Typography variant="body2" style={{ color: "blue", fontWeight: 600 }}>
          {rowData.expirationDate
            ? format(new Date(rowData.expirationDate), "dd/MM/yyyy")
            : "Não foi possível identificar a data"}
        </Typography>
      ),
    },
    {
      title: "Data do orçamento",
      field: "createdAt",
      render: (rowData) => (
        <Typography variant="body2">
          {rowData.createdAt
            ? format(new Date(rowData.createdAt), "dd/MM/yyyy")
            : "Não foi possível identificar a data"}
        </Typography>
      ),
    },
    {
      title: "Ações",
      field: "acoes",
      render: (rowData) => handleAcoes(rowData),
    },
  ]);
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    const init = async () => {
      try {
        const responseOrcamento = await api.get("/orcamento");
        setOrcamento(responseOrcamento.data.data);
        setLoading(false);
      } catch (error) {
        setModal({
          ...modal,
          open: true,
          text:
            error.response?.data?.message ||
            "Não foi possível carregar os orçamentos",
          success: false,
        });
        setLoading(false);
      }
    };
    init();
  }, [loading]);

  const handleSelectedDelete = async () => {
    setModalConfirm({
      open: false,
    });
    try {
      const promisesDeletedOrcamento = selected.map(async (row) => {
        await api.delete(`/orcamento/${row.id}`);
      });

      Promise.all(await promisesDeletedOrcamento)
        .then(() => {
          setAlert({
            open: true,
            text: "Orçamentos excluídos com sucesso!",
            severity: "success",
            key: new Date().getTime(),
          });
          setTimeout(() => {
            setLoading(true);
          }, 1000);
        })
        .catch(() => {
          setAlert({
            open: true,
            text: "Não foi possível excluir os orçamentos!",
            severity: "error",
            key: new Date().getTime(),
          });
        });
    } catch (err) {
      setAlert({
        open: true,
        text: "Não foi possível excluir os orçamentos!",
        severity: "error",
        key: new Date().getTime(),
      });
    }
  };

  if (loading) return <CircularIndeterminate />;

  return (
    <Container>
      <Grid container spacing={0}>
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <Table
            title="Listagem de orçamento"
            columns={columns}
            isLoading={loading}
            data={orcamento}
            detailPanel={(rowData) => <InfoOrcamento rowData={rowData} />}
            handleSelectedDelete={null}
            actions={false}
            selection={false}
            editable={false}
            alertOpen={alert.open}
            alertText={alert.text}
            alertSeverity={alert.severity}
            key={alert.key}
          />
        </Grid>
      </Grid>
      <Dialog
        open={modal.open}
        title={modal.title}
        hiddenIcon={modal.hiddenIcon}
        text={modal.text}
        handleClick={() => setModal({ ...modal, open: true })}
        handleClose={() => setModal({ ...modal, open: false })}
      >
        {modal.children}
      </Dialog>
      <DialogConfirm
        open={modalConfirm.open}
        title={modalConfirm.text}
        children={modalConfirm.children}
        handleClick={() => modalConfirm.handleClick()}
        handleClose={() =>
          modalConfirm.handleClose ||
          setModalConfirm({ ...modalConfirm, open: false })
        }
      />
    </Container>
  );
}
