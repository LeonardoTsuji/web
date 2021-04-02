import React, { useState, useEffect } from "react";
import Grid from "@material-ui/core/Grid";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import { CircularIndeterminate } from "../../components/core/Feedback/Progress";
import Dialog from "../../components/core/Feedback/Dialog";
import DialogConfirm from "../../components/core/Feedback/DialogConfirm";
import Table from "../../components/core/DataDisplay/TableCRUD";
import api from "../../services/api";
import { retornaObj } from "../../utils/utils";
import { Container } from "./styles";

export default function Produto(props) {
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState({ open: false, text: "" });
  const [modalConfirm, setModalConfirm] = useState({ open: false, text: "" });
  const [alert, setAlert] = useState({
    open: false,
    text: "",
    severity: "success",
    key: 0,
  });
  const [produto, setProduto] = useState([]);
  const [columns, setColumns] = useState([]);
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    const init = async () => {
      try {
        const responseProdutos = await api.get("/produto");
        const responseCategorias = await api.get("/categoria");
        const responseFabricantes = await api.get("/fabricante");

        setColumns([
          { title: "id", field: "id", title: "Nome", field: "name" },
          { title: "Preço", field: "price", type: "numeric" },
          {
            title: "Fabricante",
            field: "brandId",
            editComponent: (props) => (
              <Autocomplete
                options={responseFabricantes.data.data}
                getOptionLabel={(option) => option.name}
                onChange={(e, newValue) => props.onChange(newValue.id)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Fabricante"
                    variant="outlined"
                    required
                  />
                )}
              />
            ),
            lookup: retornaObj(responseFabricantes.data.data, "id", "name"),
          },
          {
            title: "Categoria",
            field: "categoryId",
            editComponent: (props) => (
              <Autocomplete
                options={responseCategorias.data.data}
                getOptionLabel={(option) => option.name}
                onChange={(e, newValue) => props.onChange(newValue.id)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Categoria"
                    variant="outlined"
                    required
                  />
                )}
              />
            ),
            lookup: retornaObj(responseCategorias.data.data, "id", "name"),
          },
        ]);
        setProduto(responseProdutos.data.data);
        setLoading(false);
      } catch (error) {
        setModal({
          open: true,
          text:
            error.response?.data?.message ||
            "Não foi possível carregar os produtos",
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
      const promisesDeletedProduto = selected.map(async (row) => {
        await api.delete(`/produto/${row.id}`);
      });

      Promise.all(await promisesDeletedProduto)
        .then(() => {
          setAlert({
            key: new Date().getTime(),
            open: true,
            text: "Produtos excluídos com sucesso!",
            severity: "success",
          });
          setTimeout(() => {
            setLoading(true);
          }, 1000);
        })
        .catch(() => {
          setAlert({
            key: new Date().getTime(),
            open: true,
            text: "Não foi possível excluir os produtos!",
            severity: "error",
          });
        });
    } catch (error) {
      setAlert({
        key: new Date().getTime(),
        open: true,
        text: "Não foi possível excluir os produtos!",
        severity: "error",
      });
    }
  };

  const handleDelete = async (oldData) => {
    try {
      const response = await api.delete(`/produto/${oldData.id}`);
      setAlert({
        key: new Date().getTime(),
        open: true,
        text: "Produto excluído com sucesso!",
        severity: "success",
      });
      setTimeout(() => {
        setLoading(true);
      }, 1000);
    } catch (error) {
      setAlert({
        key: new Date().getTime(),
        open: true,
        text: "Erro ao excluir o produto!",
        severity: "error",
      });
    }
  };

  const handleAdd = async (newData) => {
    try {
      const response = await api.post("/produto", {
        name: newData.name,
        description: newData.description,
        price: newData.price,
        brandId: newData.brandId,
        categoryId: newData.categoryId,
      });
      setAlert({
        key: new Date().getTime(),
        open: true,
        text: "Produto criado com sucesso!",
        severity: "success",
      });
      setTimeout(() => {
        setLoading(true);
      }, 1000);
    } catch (error) {
      setAlert({
        key: new Date().getTime(),
        open: true,
        text: error.response?.data?.message || "Erro ao cadastrar o produto!",
        severity: "error",
      });
    }
  };

  const handleUpdate = async (newData, oldData) => {
    try {
      await api.put(`/produto/${oldData.id}`, {
        ...newData,
      });
      setAlert({
        key: new Date().getTime(),
        open: true,
        text: "Produto atualizado com sucesso!",
        severity: "success",
      });
      setTimeout(() => {
        setLoading(true);
      }, 1000);
    } catch (error) {
      setAlert({
        key: new Date().getTime(),
        open: true,
        text: error.response?.data?.message || "Erro ao atualizar o produto!",
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
            title="Listagem de produtos"
            columns={columns}
            isLoading={loading}
            data={produto}
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
