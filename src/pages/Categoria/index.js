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
  const [nome, setNome] = useState("");
  const [categoria, setCategoria] = useState([]);
  const [columns, setColumns] = useState([
    { title: "id", field: "id", title: "Nome", field: "name" },
  ]);
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    const init = async () => {
      try {
        const responseCategorias = await api.get("/categoria");
        setCategoria(responseCategorias.data.data);
        setLoading(false);
      } catch (error) {
        setModal({
          open: true,
          text:
            error.response?.data?.message ||
            "Não foi possível carregar as categorias",
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
      const promisesDeletedCategoria = selected.map(async (row) => {
        await api.delete(`/categoria/${row.id}`);
      });

      Promise.all(await promisesDeletedCategoria)
        .then(() => {
          setAlert({
            key: new Date().getTime(),
            open: true,
            text: "Categorias excluídas com sucesso!",
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
              "Não foi possível excluir as categorias!",
            severity: "error",
          });
        });
    } catch (error) {
      setAlert({
        key: new Date().getTime(),
        open: true,
        text:
          error.response?.data?.message ||
          "Não foi possível excluir as categorias!",
        severity: "error",
      });
    }
  };

  const handleDelete = async (oldData) => {
    try {
      const response = await api.delete(`/categoria/${oldData.id}`);
      setAlert({
        key: new Date().getTime(),
        open: true,
        text: "Categoria excluída com sucesso!",
        severity: "success",
      });
      setTimeout(() => {
        setLoading(true);
      }, 1000);
    } catch (error) {
      setAlert({
        key: new Date().getTime(),
        open: true,
        text: error.response?.data?.message || "Erro ao excluir a categoria!",
        severity: "error",
      });
    }
  };

  const handleAdd = async (newData) => {
    try {
      const response = await api.post("/categoria", {
        name: newData.name,
      });
      setAlert({
        key: new Date().getTime(),
        open: true,
        text: "Categoria criada com sucesso!",
        severity: "success",
      });
      setTimeout(() => {
        setLoading(true);
      }, 1000);
    } catch (error) {
      setAlert({
        key: new Date().getTime(),
        open: true,
        text: error.response?.data?.message || "Erro ao cadastrar a categoria!",
        severity: "error",
      });
    }
  };

  const handleUpdate = async (newData, oldData) => {
    try {
      await api.put(`/categoria/${oldData.id}`, {
        ...newData,
      });
      setAlert({
        key: new Date().getTime(),
        open: true,
        text: "Categoria atualizada com sucesso!",
        severity: "success",
      });
      setTimeout(() => {
        setLoading(true);
      }, 1000);
    } catch (error) {
      setAlert({
        key: new Date().getTime(),
        open: true,
        text: error.response?.data?.message || "Erro ao atualizar a categoria!",
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
            title="Listagem de categorias"
            columns={columns}
            isLoading={loading}
            data={categoria}
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
