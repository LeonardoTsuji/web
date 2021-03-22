import React, { useState, useEffect } from "react";
import Grid from "@material-ui/core/Grid";
import { CircularIndeterminate } from "../../components/core/Feedback/Progress";
import Dialog from "../../components/core/Feedback/Dialog";
import DialogConfirm from "../../components/core/Feedback/DialogConfirm";
import Table from "../../components/core/DataDisplay/TableCRUD";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormLabel from "@material-ui/core/FormLabel";
import RadioGroup from "@material-ui/core/RadioGroup";
import Radio from "@material-ui/core/Radio";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import api from "../../services/api";
import { Container } from "./styles";

export default function Permissao(props) {
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState({ open: false, text: "" });
  const [modalConfirm, setModalConfirm] = useState({ open: false, text: "" });
  const [alert, setAlert] = useState({
    open: false,
    text: "",
    severity: "success",
  });
  const [recurso, setRecurso] = useState([
    {
      recurso: "Produto",
      ler: false,
      atualizar: false,
      criar: false,
      excluir: false,
    },
  ]);
  const [columns, setColumns] = useState([
    {
      title: "id",
      field: "id",
      title: "Permissão",
      field: "name",
      editable: "never",
    },
    {
      title: "Ler",
      field: "ler",
      type: "boolean",
    },
    {
      title: "Atualizar",
      field: "atualizar",
      type: "boolean",
    },
    {
      title: "Criar",
      field: "criar",
      type: "boolean",
    },
    {
      title: "Excluir",
      field: "excluir",
      type: "boolean",
    },
  ]);
  const [selected, setSelected] = useState([]);
  const [tipo, setTipo] = useState("");
  const [tipoArray, setTipoArray] = useState([
    "USUARIO",
    "ADMINISTRADOR",
    "OPERADOR",
  ]);
  const [render, setRender] = useState(<></>);

  useEffect(() => {
    const init = async () => {
      try {
        const responsePermissoes = await api.get("/recurso");
        setRecurso(responsePermissoes.data.data);
        setLoading(false);
      } catch (error) {
        setModal({
          open: true,
          text:
            error.response?.data?.message ||
            "Não foi possível carregar os permissões",
          success: false,
        });
        setLoading(false);
      }
    };
    init();
  }, [loading]);

  useEffect(() => {
    if (tipo === "USUARIO") {
      setRender(
        <Table
          title="Listagem de permissões - USUARIO"
          columns={columns}
          isLoading={loading}
          data={recurso}
          editable={{
            onRowUpdate: ({ newData, oldData }) =>
              handleUpdate(newData, oldData),
          }}
          actions={null}
          alertOpen={alert.open}
          alertText={alert.text}
          alertSeverity={alert.severity}
        />
      );
    } else if (tipo === "ADMINISTRADOR") {
      setRender(
        <Table
          title="Listagem de permissões - ADMINISTRADOR"
          columns={columns}
          isLoading={loading}
          data={recurso}
          editable={{
            onRowUpdate: ({ newData, oldData }) =>
              handleUpdate(newData, oldData),
          }}
          actions={null}
          alertOpen={alert.open}
          alertText={alert.text}
          alertSeverity={alert.severity}
        />
      );
    } else if (tipo === "OPERADOR") {
      setRender(
        <Table
          title="Listagem de permissões - OPERADOR"
          columns={columns}
          isLoading={loading}
          data={recurso}
          editable={{
            onRowUpdate: ({ newData, oldData }) =>
              handleUpdate(newData, oldData),
          }}
          actions={null}
          alertOpen={alert.open}
          alertText={alert.text}
          alertSeverity={alert.severity}
        />
      );
    }

    return null;
  }, [tipo]);

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
        await api.delete(`/recurso/${row.id}`);
      });

      Promise.all(await promisesDeletedFabricante)
        .then(() => {
          setAlert({
            open: true,
            text: "Permissões excluídas com sucesso!",
            severity: "success",
          });
          setTimeout(() => {
            setLoading(true);
          }, 1000);
        })
        .catch(() => {
          setAlert({
            open: true,
            text: "Não foi possível excluir as permissões!",
            severity: "error",
          });
        });
    } catch (err) {
      setAlert({
        open: true,
        text: "Não foi possível excluir as permissões!",
        severity: "error",
      });
    }
  };

  const handleDelete = async (oldData) => {
    try {
      const response = await api.delete(`/recurso/${oldData.id}`);
      setAlert({
        open: true,
        text: "Permissão excluída com sucesso!",
        severity: "success",
      });
      setTimeout(() => {
        setLoading(true);
      }, 1000);
    } catch (error) {
      setAlert({
        open: true,
        text: "Erro ao excluir a permissão!",
        severity: "error",
      });
    }
  };

  const handleAdd = async (newData) => {
    try {
      const response = await api.post("/recurso", {
        name: newData.name,
      });
      setAlert({
        open: true,
        text: "Permissão criada com sucesso!",
        severity: "success",
      });
      setTimeout(() => {
        setLoading(true);
      }, 1000);
    } catch (error) {
      setAlert({
        open: true,
        text: "Erro ao cadastrar a permissão!",
        severity: "error",
      });
    }
  };

  const handleUpdate = async (newData, oldData) => {
    try {
      await api.put(`/recurso/${oldData.id}`, {
        ...newData,
      });
      setAlert({
        open: true,
        text: "Permissao atualizada com sucesso!",
        severity: "success",
      });
      setTimeout(() => {
        setLoading(true);
      }, 1000);
    } catch (err) {
      setAlert({
        open: true,
        text: "Erro ao atualizar a recurso!",
        severity: "error",
      });
    }
  };

  if (loading) return <CircularIndeterminate />;

  return (
    <Container>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12} md={3} lg={3}>
          <FormControl variant="outlined" fullWidth>
            <InputLabel shrink="true" id="tipo">
              Tipo
            </InputLabel>
            <Select
              labelId="tipo"
              value={tipo}
              fullWidth
              onChange={(e) => setTipo(e.target.value)}
              label="Tipo"
              displayEmpty
            >
              <MenuItem value="" disabled>
                <em>Selecione uma opção</em>
              </MenuItem>
              {tipoArray.map((tipo) => (
                <MenuItem key={tipo} value={tipo}>
                  {tipo}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={12} md={7} lg={7}>
          {render}
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
