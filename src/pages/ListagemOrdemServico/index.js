import React, { useState, useEffect } from "react";

import { format } from "date-fns";

import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
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
  LocalAtm,
  CheckCircle,
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

const handleColor = (flag) => {
  if (flag) return "green";
  return "red";
};

export default function ListagemOrdemServico({ history }) {
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
  });
  const [alert, setAlert] = useState({
    open: false,
    text: "",
    severity: "success",
    key: 0,
  });

  const InfoOrdemServico = ({ rowData }) => {
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
      { title: "Quantidade", field: "serviceOrderProduct.quantity" },
    ]);

    useEffect(() => {
      const init = async () => {
        try {
          const response = await api.get(
            `usuario/${rowData.userId}/veiculo/${rowData.userVehicleId}`
          );

          const responseTotal = await api.get(
            `usuario/${rowData.userId}/ordem-servico/${rowData.id}/valor`
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
              <Typography variant="h6">Itens do ordem de serviço</Typography>
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

  const handlePaid = async (rowData) => {
    try {
      const response = await api.put(
        `/usuario/${rowData.userId}/ordem-servico/${rowData.id}`,
        {
          paid: true,
        }
      );
      setAlert({
        key: new Date().getTime(),
        open: true,
        text: "Ordem de serviço alterada para paga com sucesso!",
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
        text: "Erro ao atualizar a ordem de serviço!",
        severity: "error",
      });
      setModalConfirm({
        open: false,
      });
    }
  };

  const handleDone = async (rowData) => {
    try {
      const response = await api.put(
        `/usuario/${rowData.userId}/ordem-servico/${rowData.id}`,
        {
          done: true,
        }
      );
      setAlert({
        key: new Date().getTime(),
        open: true,
        text: "Ordem de serviço finalizada com sucesso!",
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
        text: "Erro ao atualizar a ordem de serviço!",
        severity: "error",
      });
      setModalConfirm({
        open: false,
      });
    }
  };

  const confirmPaid = (rowData) => {
    setModalConfirm({
      open: true,
      text: "Deseja confirmar o pagamento do serviço?",
      handleClick: async () => await handlePaid(rowData),
    });
  };
  const confirmDone = (rowData) => {
    setModalConfirm({
      open: true,
      text: "Deseja confirmar que o serviço foi finalizado?",
      handleClick: async () => await handleDone(rowData),
    });
  };

  const handleAcoes = (rowData) => {
    const pago = rowData.paid;
    const finalizado = rowData.done;

    return (
      <>
        {pago ? null : (
          <Button
            variant="contained"
            color="primary"
            onClick={() => confirmPaid(rowData)}
            startIcon={<LocalAtm />}
            style={{ marginRight: 5 }}
          >
            Pago
          </Button>
        )}
        {finalizado ? null : (
          <Button
            variant="contained"
            color="primary"
            onClick={() => confirmDone(rowData)}
            startIcon={<CheckCircle />}
          >
            Finalizado
          </Button>
        )}
      </>
    );
  };

  const [ordemServico, setOrdemServico] = useState([]);
  const [columns, setColumns] = useState([
    { title: "Número ordem de serviço", field: "id" },
    {
      title: "Pago",
      field: "paid",
      render: (rowData) => (
        <Typography
          variant="body2"
          style={{ color: handleColor(rowData.paid), fontWeight: 600 }}
        >
          {rowData.paid ? "Pago" : "A pagar"}
        </Typography>
      ),
    },
    {
      title: "Finalizado",
      field: "done",
      render: (rowData) => (
        <Typography
          variant="body2"
          style={{ color: handleColor(rowData.done), fontWeight: 600 }}
        >
          {rowData.done ? "Finalizado" : "A finalizar"}
        </Typography>
      ),
    },
    { title: "Forma de pagamento", field: "paymentMethod" },
    {
      title: "Data ordem de serviço",
      field: "createdAt",
      render: (rowData) => (
        <Typography variant="body2" style={{ color: "blue", fontWeight: 600 }}>
          {rowData.createdAt
            ? format(new Date(rowData.createdAt), "dd/MM/yyyy")
            : "Não foi possível identificar a data"}
        </Typography>
      ),
    },
    {
      title: "Data de pagamento",
      field: "paymentDate",
      render: (rowData) => (
        <Typography variant="body2">
          {rowData.paymentDate
            ? format(new Date(rowData.paymentDate), "dd/MM/yyyy")
            : "A pagar"}
        </Typography>
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
        const responseOrdemServico = await api.get("/ordem-servico");
        setOrdemServico(responseOrdemServico.data.data);
        setLoading(false);
      } catch (error) {
        setModal({
          ...modal,
          open: true,
          text:
            error.response?.data?.message ||
            "Não foi possível carregar as ordens de serviço",
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
            title="Listagem de ordem de serviço"
            columns={columns}
            isLoading={loading}
            data={ordemServico}
            detailPanel={(rowData) => <InfoOrdemServico rowData={rowData} />}
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
        handleClick={() => modalConfirm.handleClick()}
        handleClose={() =>
          modalConfirm.handleClose ||
          setModalConfirm({ ...modalConfirm, open: false })
        }
      />
    </Container>
  );
}
