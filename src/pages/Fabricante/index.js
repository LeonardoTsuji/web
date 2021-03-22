import React, { useState, useEffect } from "react";
import Grid from "@material-ui/core/Grid";
import { CircularIndeterminate } from "../../components/core/Feedback/Progress";
import Dialog from "../../components/core/Feedback/Dialog";
import DialogConfirm from "../../components/core/Feedback/DialogConfirm";
import Table from "../../components/core/DataDisplay/TableCRUD";
import api from "../../services/api";
import { Container } from "./styles";

export default function Fabricante(props) {
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState({ open: false, text: "" });
  const [modalConfirm, setModalConfirm] = useState({ open: false, text: "" });
  const [alert, setAlert] = useState({
    open: false,
    text: "",
    severity: "success",
    key: 0,
  });
  const [fabricante, setFabricante] = useState([]);
  const [columns, setColumns] = useState([
    { title: "id", field: "id", title: "Nome", field: "name" },
  ]);
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    const init = async () => {
      try {
        const responseFabricantes = await api.get("/fabricante");
        setFabricante(responseFabricantes.data.data);
        setLoading(false);
      } catch (error) {
        setModal({
          open: true,
          text:
            error.response?.data?.message ||
            "Não foi possível carregar os fabricantes",
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
      const promisesDeletedFabricante = selected.map(async (row) => {
        await api.delete(`/fabricante/${row.id}`);
      });

      Promise.all(await promisesDeletedFabricante)
        .then(() => {
          setAlert({
            key: new Date().getTime(),
            open: true,
            text: "Fabricantes excluídos com sucesso!",
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
              "Não foi possível excluir os fabricantes!",
            severity: "error",
          });
        });
    } catch (error) {
      setAlert({
        key: new Date().getTime(),
        open: true,
        text:
          error.response?.data?.message ||
          "Não foi possível excluir os fabricantes!",
        severity: "error",
      });
    }
  };

  const handleDelete = async (oldData) => {
    try {
      const response = await api.delete(`/fabricante/${oldData.id}`);
      setAlert({
        key: new Date().getTime(),
        open: true,
        text: "Fabricante excluído com sucesso!",
        severity: "success",
      });
      setTimeout(() => {
        setLoading(true);
      }, 1000);
    } catch (error) {
      setAlert({
        key: new Date().getTime(),
        open: true,
        text: error.response?.data?.message || "Erro ao excluir o fabricante!",
        severity: "error",
      });
    }
  };

  const handleAdd = async (newData) => {
    try {
      const response = await api.post("/fabricante", {
        name: newData.name,
      });
      setAlert({
        key: new Date().getTime(),
        open: true,
        text: "Fabricante criado com sucesso!",
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
          error.response?.data?.message || "Erro ao cadastrar o fabricante!",
        severity: "error",
      });
    }
  };

  const handleUpdate = async (newData, oldData) => {
    try {
      await api.put(`/fabricante/${oldData.id}`, {
        ...newData,
      });
      setAlert({
        key: new Date().getTime(),
        open: true,
        text: "Fabricante atualizado com sucesso!",
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
          error.response?.data?.message || "Erro ao atualizar o fabricante!",
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
            title="Listagem de fabricantes"
            columns={columns}
            isLoading={loading}
            data={fabricante}
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
