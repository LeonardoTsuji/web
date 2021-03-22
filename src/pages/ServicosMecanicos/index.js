import React, { useState, useEffect } from "react";
import Grid from "@material-ui/core/Grid";
import { CircularIndeterminate } from "../../components/core/Feedback/Progress";
import Dialog from "../../components/core/Feedback/Dialog";
import DialogConfirm from "../../components/core/Feedback/DialogConfirm";
import Table from "../../components/core/DataDisplay/TableCRUD";
import api from "../../services/api";
import { Container } from "./styles";

export default function ServicosMecanicos(props) {
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState({ open: false, text: "" });
  const [modalConfirm, setModalConfirm] = useState({ open: false, text: "" });
  const [alert, setAlert] = useState({
    open: false,
    text: "",
    severity: "success",
    key: 0,
  });
  const [servicosMecanicos, setServicosMecanicos] = useState([]);
  const [columns, setColumns] = useState([
    { title: "id", field: "id", title: "Nome", field: "name" },
    { title: "Descrição", field: "description" },
    { title: "Preço", field: "price" },
  ]);
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    const init = async () => {
      try {
        const responseServicosMecanicos = await api.get("/servico-mecanico");
        setServicosMecanicos(responseServicosMecanicos.data.data);
        setLoading(false);
      } catch (error) {
        setModal({
          open: true,
          text:
            error.response?.data?.message ||
            "Não foi possível carregar os serviços mecânicos",
          success: false,
        });
        setLoading(false);
      }
    };
    init();
  }, [loading]);

  const handleConfirm = (rowData) => {
    setModalConfirm({
      open: true,
      text: "Tem certeza que deseja excluir os itens selecionados?",
    });
    setSelected(rowData);
  };

  const handleSelectedDelete = async () => {
    setModalConfirm({
      open: false,
    });
    try {
      const promisesDeletedServicosMecanicos = selected.map(async (row) => {
        await api.delete(`/servico-mecanico/${row.id}`);
      });

      Promise.all(await promisesDeletedServicosMecanicos)
        .then(() => {
          setAlert({
            key: new Date().getTime(),
            open: true,
            text: "Serviços mecânicos excluídos com sucesso!",
            severity: "success",
          });
          setTimeout(() => {
            setLoading(true);
          }, 1000);
        })
        .catch((error) => {
          setAlert({
            key: new Date().getTime(),
            open: true,
            text:
              error.response?.data?.message ||
              "Não foi possível excluir os serviços mecânicos!",
            severity: "error",
          });
        });
    } catch (error) {
      setAlert({
        key: new Date().getTime(),
        open: true,
        text: "Não foi possível excluir os serviços mecânicos!",
        severity: "error",
      });
    }
  };

  const handleDelete = async (oldData) => {
    try {
      const response = await api.delete(`/servico-mecanico/${oldData.id}`);
      setAlert({
        key: new Date().getTime(),
        open: true,
        text: "Serviço mecânico excluído com sucesso!",
        severity: "success",
      });
      setTimeout(() => {
        setLoading(true);
      }, 1000);
    } catch (error) {
      setAlert({
        key: new Date().getTime(),
        open: true,
        text:
          error.response?.data?.message ||
          "Erro ao excluir o serviços mecânicos!",
        severity: "error",
      });
    }
  };

  const handleAdd = async (newData) => {
    try {
      const response = await api.post("/servico-mecanico", {
        name: newData.name,
        description: newData.description,
        price: newData.price,
      });
      setAlert({
        key: new Date().getTime(),
        open: true,
        text: "Serviço mecânico criado com sucesso!",
        severity: "success",
      });
      setTimeout(() => {
        setLoading(true);
      }, 1000);
    } catch (error) {
      setAlert({
        key: new Date().getTime(),
        open: true,
        text:
          error.response?.data?.message ||
          "Erro ao cadastrar o serviços mecânicos!",
        severity: "error",
      });
    }
  };

  const handleUpdate = async (newData, oldData) => {
    try {
      await api.put(`/servico-mecanico/${oldData.id}`, {
        ...newData,
      });
      setAlert({
        key: new Date().getTime(),
        open: true,
        text: "Serviço mecânico atualizado com sucesso!",
        severity: "success",
      });
      setTimeout(() => {
        setLoading(true);
      }, 1000);
    } catch (error) {
      setAlert({
        key: new Date().getTime(),
        open: true,
        text:
          error.response?.data?.message ||
          "Erro ao atualizar o serviços mecânicos!",
        severity: "error",
      });
    }
  };

  if (loading) return <CircularIndeterminate />;

  return (
    <Container>
      <Grid container spacing={0}>
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <Table
            title="Listagem de serviços mecânicos"
            columns={columns}
            isLoading={loading}
            data={servicosMecanicos}
            handleSelectedDelete={({ rowData }) => handleConfirm(rowData)}
            onRowAdd={({ newData }) => handleAdd(newData)}
            onRowDelete={({ oldData }) => handleDelete(oldData)}
            onRowUpdate={({ newData, oldData }) =>
              handleUpdate(newData, oldData)
            }
            key={alert.key}
            alertOpen={alert.open}
            alertText={alert.text}
            alertSeverity={alert.severity}
          />
        </Grid>
      </Grid>
      <Dialog
        open={modal.open}
        title={modal.text}
        handleClick={() => setModal({ ...modal, open: true })}
        handleClose={() => setModal({ ...modal, open: false })}
      />
      <DialogConfirm
        open={modalConfirm.open}
        title={modalConfirm.text}
        handleClick={() => handleSelectedDelete()}
        handleClose={() => setModalConfirm({ ...modalConfirm, open: false })}
      />
    </Container>
  );
}
