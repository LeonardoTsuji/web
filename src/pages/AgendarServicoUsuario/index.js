import React, { useState, useEffect } from "react";

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
  if (status === "CANCELADO") return "red";
  else if (status === "ATIVO") return "blue";
  else if (status === "FINALIZADO") return "green";
  return "yellow";
};

export default function ListagemAgendamento({ history }) {
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

  const { id } = useAuth();

  const handleDelete = async (rowData) => {
    try {
      const response = await api.delete(`/agenda/${rowData.id}`);
      setAlert({
        key: new Date().getTime(),
        open: true,
        text: "Agendamento cancelado com sucesso!",
        severity: "success",
      });
      setTimeout(() => {
        setLoading(true);
        setModalConfirm({
          open: false,
        });
      }, 1000);
    } catch (error) {
      setAlert({
        key: new Date().getTime(),
        open: true,
        text: "Erro ao cancelar o agendamento!",
        severity: "error",
      });
      setModalConfirm({
        open: false,
      });
    }
  };

  const confirmDelete = (rowData) => {
    setModalConfirm({
      open: true,
      text: "Deseja cancelar o agendamento?",
      handleClick: async () => await handleDelete(rowData),
    });
  };

  const InfoOrcamento = ({ rowData }) => {
    console.log(rowData);
    const [carro, setCarro] = useState({
      modelo: "",
      placa: "",
      cor: "",
      quilometragem: "",
      ano: "",
      marca: "",
    });

    useEffect(() => {
      const init = async () => {
        try {
          const response = await api.get(
            `usuario/${rowData.userId}/agenda/${rowData.id}`
          );

          setCarro({
            modelo:
              response.data.data &&
              response.data.data[0]["vehicle.model.model"],
            placa: response.data.data && response.data.data[0]["vehicle.plate"],
            cor: response.data.data && response.data.data[0]["vehicle.color"],
            quilometragem:
              response.data.data && response.data.data[0]["vehicle.kilometer"],
            ano: response.data.data && response.data.data[0]["vehicle.year"],
            marca:
              response.data.data && response.data.data[0]["vehicle.brand.name"],
          });
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
      </ContainerInfo>
    );
  };

  const handleAcoes = (rowData) => {
    if (rowData.status === "PENDENTE") {
      return (
        <>
          <Tooltip title="Recusar">
            <IconButton onClick={() => confirmDelete(rowData)}>
              <Delete color="error" />
            </IconButton>
          </Tooltip>
        </>
      );
    }
    return;
  };

  const [orcamento, setOrcamento] = useState([]);
  const [columns, setColumns] = useState([
    { title: "Número agendamento", field: "id" },
    {
      title: "Status do agendamento",
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
    {
      title: "Data para levar na oficina",
      field: "dateSchedule",
      render: (rowData) => (
        <Typography variant="body2">{rowData.dateSchedule}</Typography>
      ),
    },
    {
      title: "Ações",
      field: "acoes",
      render: (rowData) => handleAcoes(rowData),
    },
  ]);

  useEffect(() => {
    const init = async () => {
      try {
        const responseOrcamento = await api.get(`/usuario/${id}/agenda`);
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

  if (loading) return <CircularIndeterminate />;

  return (
    <Container>
      <Grid container spacing={0}>
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <Table
            title="Listagem de agendamentos "
            columns={columns}
            isLoading={loading}
            data={orcamento}
            detailPanel={(rowData) => <InfoOrcamento rowData={rowData} />}
            handleSelectedDelete={null}
            actions={false}
            key={alert.key}
            selection={false}
            editable={false}
            alertOpen={alert.open}
            alertText={alert.text}
            alertSeverity={alert.severity}
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
