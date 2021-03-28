import React, { useState, useEffect } from "react";
import Grid from "@material-ui/core/Grid";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import { CircularIndeterminate } from "../../components/core/Feedback/Progress";
import Dialog from "../../components/core/Feedback/Dialog";
import DialogConfirm from "../../components/core/Feedback/DialogConfirm";
import Table from "../../components/core/DataDisplay/TableCRUD";
import api from "../../services/api";
import { retornaObj } from "../../utils/utils";
import { Container } from "./styles";

const handleColor = (active) => {
  if (active) return "blue";
  return "red";
};

export default function ListagemOperador(props) {
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState({ open: false, text: "" });
  const [modalConfirm, setModalConfirm] = useState({ open: false, text: "" });
  const [alert, setAlert] = useState({
    open: false,
    text: "",
    severity: "success",
    key: 0,
  });
  const [operador, setOperador] = useState([]);
  const [columns, setColumns] = useState([]);
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    const init = async () => {
      try {
        const responseRole = await api.get("/regra");
        const responseRoleOperador = await api.get("/regra", {
          params: {
            name: "OPERADOR",
          },
        });
        const responseOperador = await api.get("/usuario", {
          params: {
            role: responseRoleOperador.data.data.id,
          },
        });
        setOperador(responseOperador.data.data);
        setColumns([
          { title: "id", field: "id", editable: "never" },
          { title: "Nome", field: "name" },
          { title: "email", field: "email" },
          { title: "celular", field: "phone" },
          {
            title: "Regra",
            field: "roleId",
            editComponent: (props) => (
              <Select
                label="Regra"
                variant="outlined"
                value={responseRoleOperador.data.data.id}
                fullWidth
                disabled
              >
                <MenuItem
                  key={responseRoleOperador.data.data.id}
                  value={responseRoleOperador.data.data.id}
                >
                  {responseRoleOperador.data.data.name}
                </MenuItem>
              </Select>
            ),
            lookup: retornaObj(responseRole.data.data, "id", "name"),
          },
          {
            title: "ativo",
            field: "active",
            render: (rowData) => (
              <Select
                label="Regra"
                variant="outlined"
                value={rowData.active}
                fullWidth
                disabled
              >
                <MenuItem key={true} value={true}>
                  Ativo
                </MenuItem>
                <MenuItem key={false} value={false}>
                  Inativo
                </MenuItem>
              </Select>
            ),
            lookup: { true: "Ativo", false: "Inativo" },
          },
        ]);
        setLoading(false);
      } catch (error) {
        setModal({
          open: true,
          text:
            error.response?.data?.message ||
            "Não foi possível carregar os operadores",
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
        await api.delete(`/usuario/${row.id}`);
      });

      Promise.all(await promisesDeletedFabricante)
        .then(() => {
          setAlert({
            key: new Date().getTime(),
            open: true,
            text: "Operadores excluídos com sucesso!",
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
              "Não foi possível excluir os operadores!",
            severity: "error",
          });
        });
    } catch (error) {
      setAlert({
        key: new Date().getTime(),
        open: true,
        text:
          error.response?.data?.message ||
          "Não foi possível excluir os operadores!",
        severity: "error",
      });
    }
  };

  const handleDelete = async (oldData) => {
    try {
      const response = await api.delete(`/usuario/${oldData.id}`);
      setAlert({
        key: new Date().getTime(),
        open: true,
        text: "Operador excluído com sucesso!",
        severity: "success",
      });
      setTimeout(() => {
        setLoading(true);
      }, 1000);
    } catch (error) {
      setAlert({
        key: new Date().getTime(),
        open: true,
        text: error.response?.data?.message || "Erro ao excluir o operador!",
        severity: "error",
      });
    }
  };

  const handleUpdate = async (newData, oldData) => {
    console.log(oldData);
    try {
      await api.put(`/usuario/${oldData.id}`, {
        ...newData,
      });
      setAlert({
        key: new Date().getTime(),
        open: true,
        text: "Operador atualizado com sucesso!",
        severity: "success",
      });
      setTimeout(() => {
        setLoading(true);
      }, 1000);
    } catch (error) {
      console.log(error);
      setAlert({
        key: new Date().getTime(),
        open: true,
        text: error.response?.data?.message || "Erro ao atualizar o operador!",
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
            title="Listagem de operadores"
            columns={columns}
            isLoading={loading}
            data={operador}
            handleSelectedDelete={({ rowData }) => handleConfirm(rowData)}
            editable={false}
            onRowAdd={null}
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
