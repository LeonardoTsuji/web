import React, { useState, useEffect } from "react";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormLabel from "@material-ui/core/FormLabel";
import RadioGroup from "@material-ui/core/RadioGroup";
import Radio from "@material-ui/core/Radio";
import InputLabel from "@material-ui/core/InputLabel";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import Snackbar from "../../components/core/Feedback/Snackbar";
import Dialog from "../../components/core/Feedback/Dialog";
import { Delete, Add, Send } from "@material-ui/icons";
import api from "../../services/api";
import { Container, ContainerTitle } from "./styles";

export default function Orcamento(props) {
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState({ open: false, text: "" });
  const [alert, setAlert] = useState({
    open: false,
    text: "",
    severity: "success",
    key: new Date().getTime(),
  });
  const [itemsOrcamento, setItemsOrcamento] = useState([
    {
      fabricante: "",
      categoria: "",
      descricao: "",
      productId: 0,
      produto: "",
      quantity: 0,
      produtoArray: [],
      valorUnitario: 0,
      valorTotal: 0,
    },
  ]);
  const [validade, setValidade] = useState(new Date());
  const [usuario, setUsuario] = useState("");
  const [usuarioId, setUsuarioId] = useState(0);
  const [usuarioArray, setUsuarioArray] = useState([]);
  const [totalFinal, setTotalFinal] = useState(0);
  const [fabricanteArray, setFabricanteArray] = useState([]);
  const [categoriaArray, setCategoriaArray] = useState([]);
  const [produtoArray, setProdutoArray] = useState([]);
  const [fabricante, setFabricante] = useState([]);
  const [categoria, setCategoria] = useState([]);
  const [produto, setProduto] = useState([]);
  const [agendamento, setAgendamento] = useState([]);
  const [selectedAgendamento, setSelectedAgendamento] = useState(0);
  const [carro, setCarro] = useState({
    modelo: "",
    placa: "",
    cor: "",
    quilometragem: "",
    ano: "",
    marca: "",
    id: 0,
  });

  useEffect(() => {
    const init = async () => {
      try {
        const response = await api.get(`/usuario`);
        const responseFabricantes = await api.get("/fabricante");
        const responseCategorias = await api.get("/categoria");
        const responseProdutos = await api.get("/produto", {
          params: {
            categoryId: responseCategorias.data.data[0]?.id,
            brandId: responseFabricantes.data.data[0]?.id,
          },
        });
        const responseAgendamentos = await api.get("/agenda", {
          params: {
            status: "ATIVO",
          },
        });

        setUsuarioArray(response.data.data);
        setFabricanteArray(responseFabricantes.data.data);
        setCategoriaArray(responseCategorias.data.data);
        setProdutoArray(responseProdutos.data.data);
        setAgendamento(responseAgendamentos.data.data);
        setLoading(false);
      } catch (error) {
        setModal({
          open: true,
          text:
            error.response?.data?.message ||
            "Não foi possível carregar os agendamentos",
          success: false,
        });
        setLoading(false);
      }
    };
    init();
  }, []);

  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await api.post("/orcamento", {
        expirationDate: validade,
        paymentMethod: "",
        amount: totalFinal,
        status: "ATIVO",
        userId: usuarioId,
        userVehicleId: carro.id,
        products: itemsOrcamento,
        scheduleId: selectedAgendamento,
      });
      setAlert({
        open: true,
        text: "Orçamento cadastrado com sucesso!",
        severity: "success",
        alert: new Date().getTime(),
      });
    } catch (error) {
      setModal({ open: true, text: "Erro ao cadastrar o orçamento" });
    }
  };

  const addNewScheduleItem = () => {
    setItemsOrcamento([
      ...itemsOrcamento,
      {
        quantity: 0,
        descricao: "",
        valorUnitario: 0,
        valorTotal: 0,
      },
    ]);
  };

  const handleBlur = (position, field, value) => {
    let valorTotal = 0;

    const updatedScheduleItems = itemsOrcamento.map((itemOrcamento, index) => {
      if (index === position) {
        if (field === "quantity") {
          valorTotal = value * itemOrcamento.valorUnitario;
          return { ...itemOrcamento, ["valorTotal"]: valorTotal };
        }
      }
      return itemOrcamento;
    });

    const sumTotal = updatedScheduleItems.reduce(function (acc, element) {
      return (acc += element.valorTotal);
    }, 0);

    setTotalFinal(sumTotal);

    setItemsOrcamento(updatedScheduleItems);
  };

  const setScheduleItemValue = (position, field, value) => {
    const updatedScheduleItems = itemsOrcamento.map((itemOrcamento, index) => {
      if (index === position) {
        return { ...itemOrcamento, [field]: value };
      }

      return itemOrcamento;
    });

    setItemsOrcamento(updatedScheduleItems);
  };

  const handleDelete = (index) => {
    const dataDelete = [...itemsOrcamento];
    if (dataDelete.length > 1) {
      dataDelete.splice(index, 1);
    } else {
      setModal({
        text: "É necessário ter um item no orçamento",
        open: true,
      });
    }
    setItemsOrcamento([...dataDelete]);
  };

  const handleCategoria = async (position, value) => {
    const updatedScheduleItems = itemsOrcamento.map(
      async (itemOrcamento, index) => {
        if (index === position) {
          try {
            const responseProdutos = await api.get("/produto", {
              params: { categoryId: value, brandId: itemOrcamento.fabricante },
            });
            return {
              ...itemOrcamento,
              ["categoria"]: value,
              ["produtoArray"]: responseProdutos.data.data,
            };
          } catch (err) {
            setModal({
              text: "Não foi possível encontrar os produtos",
              open: true,
            });
          }
        }

        return itemOrcamento;
      }
    );

    setItemsOrcamento(await Promise.all(updatedScheduleItems));
  };

  const handleProduto = (position, value) => {
    const updatedScheduleItems = itemsOrcamento.map((itemOrcamento, index) => {
      let produto = {};
      if (index === position) {
        if (itemOrcamento.produtoArray) {
          produto = itemOrcamento.produtoArray.find(
            (item) => item.id === value
          );
        }

        return {
          ...itemOrcamento,
          ["produto"]: value,
          ["productId"]: value,
          ["valorUnitario"]: produto.price,
          ["valorTotal"]: produto.price * itemOrcamento.quantity,
        };
      }

      return itemOrcamento;
    });

    const sumTotal = updatedScheduleItems.reduce(function (acc, element) {
      return (acc += element.valorTotal);
    }, 0);

    setTotalFinal(sumTotal);

    setItemsOrcamento(updatedScheduleItems);
  };

  const handleAgenda = (value) => {
    setSelectedAgendamento(value);

    agendamento.map((agend) => {
      if (agend.id === value) {
        setCarro({
          modelo: agend["vehicle.model.model"],
          placa: agend["vehicle.plate"],
          cor: agend["vehicle.color"],
          quilometragem: agend["vehicle.kilometer"],
          ano: agend["vehicle.year"],
          marca: agend["vehicle.brand.name"],
          id: agend.vehicleId,
        });
        setUsuario(agend["vehicle.user.name"]);
        setUsuarioId(agend.userId);
      }
    });
  };

  return (
    <Container>
      <Grid container spacing={0}>
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <ContainerTitle>
            <Typography variant="h5" component="h1">
              Orçamento
            </Typography>
          </ContainerTitle>
          <form onSubmit={onSubmit}>
            <Grid item xs={12} sm={12} md={12} lg={12}>
              <Grid item xs={12} sm={12} md={12} lg={12}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={12} md={5} lg={5}>
                    <FormControl variant="outlined" fullWidth>
                      <InputLabel shrink="true" id="agendamento">
                        Agendamento
                      </InputLabel>
                      <Autocomplete
                        options={agendamento}
                        getOptionLabel={(option) =>
                          `${option.dateSchedule} - ${option["vehicle.user.name"]}`
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Agendamento"
                            variant="outlined"
                            required
                          />
                        )}
                        onChange={(e, newValue) => {
                          if (newValue) handleAgenda(newValue.id);
                          else {
                            setSelectedAgendamento("");
                            setCarro({
                              modelo: "",
                              placa: "",
                              cor: "",
                              quilometragem: "",
                              ano: "",
                              marca: "",
                              id: "",
                            });
                            setUsuario("");
                            setUsuarioId("");
                          }
                        }}
                      />
                    </FormControl>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={12}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={12} md={10} lg={10}>
                    <TextField
                      name="Marca"
                      label="Marca"
                      value={carro.marca}
                      disabled
                      variant="outlined"
                    />
                    <TextField
                      name="Modelo"
                      label="Modelo"
                      value={carro.modelo}
                      disabled
                      variant="outlined"
                    />
                    <TextField
                      name="Placa"
                      label="Placa"
                      value={carro.placa}
                      disabled
                      variant="outlined"
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={12}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={12} md={10} lg={10}>
                    <TextField
                      name="Quilometragem"
                      label="Quilometragem"
                      value={carro.quilometragem}
                      disabled
                      variant="outlined"
                    />
                    <TextField
                      name="Ano"
                      label="Ano"
                      value={carro.ano}
                      disabled
                      variant="outlined"
                    />
                    <TextField
                      name="Cor"
                      label="Cor"
                      value={carro.cor}
                      disabled
                      variant="outlined"
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={12}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={12} md={4} lg={4}>
                    <TextField
                      name="validade"
                      required
                      label="Validade do orçamento"
                      variant="outlined"
                      type="date"
                      fullWidth
                      value={validade}
                      InputLabelProps={{ shrink: true }}
                      onChange={(e) => setValidade(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={6} lg={6}>
                    <TextField
                      name="usuario"
                      label="Cliente"
                      value={usuario}
                      fullWidth
                      disabled
                      variant="outlined"
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={12}>
                {itemsOrcamento.map((itemOrcamento, index) => {
                  return (
                    <Grid key={itemOrcamento.index} container spacing={2}>
                      <Grid item xs={12} sm={12} md={4} lg={1}>
                        <TextField
                          name="quantity"
                          required
                          title="Quantidade"
                          label="Quantidade"
                          variant="outlined"
                          type="number"
                          inputProps={{ min: 0 }}
                          fullWidth
                          value={itemOrcamento.quantity}
                          onChange={(e) =>
                            setScheduleItemValue(
                              index,
                              "quantity",
                              e.target.value
                            )
                          }
                          onBlur={(e) =>
                            handleBlur(index, "quantity", e.target.value)
                          }
                        />
                      </Grid>
                      <Grid item xs={12} sm={12} md={4} lg={2}>
                        <FormControl variant="outlined" fullWidth>
                          <InputLabel shrink="true" id="fabricante">
                            Fabricante
                          </InputLabel>
                          <Autocomplete
                            options={fabricanteArray}
                            getOptionLabel={(option) => option.name}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label="Fabricante"
                                variant="outlined"
                                required
                              />
                            )}
                            onChange={(e, newValue) => {
                              if (newValue)
                                setScheduleItemValue(
                                  index,
                                  "fabricante",
                                  newValue.id
                                );
                              return;
                            }}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={12} md={4} lg={3}>
                        <FormControl variant="outlined" fullWidth>
                          <InputLabel shrink="true" id="categoria">
                            Categoria
                          </InputLabel>
                          <Autocomplete
                            options={categoriaArray}
                            getOptionLabel={(option) => option.name}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label="Categoria"
                                variant="outlined"
                                required
                              />
                            )}
                            onChange={(e, newValue) => {
                              if (newValue) handleCategoria(index, newValue.id);

                              return;
                            }}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={12} md={4} lg={2}>
                        <FormControl variant="outlined" fullWidth>
                          <InputLabel shrink="true" id="produto">
                            Produto
                          </InputLabel>
                          <Autocomplete
                            options={itemOrcamento.produtoArray}
                            getOptionLabel={(option) => option.name}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label="Produto"
                                variant="outlined"
                                required
                              />
                            )}
                            onChange={(e, newValue) => {
                              if (newValue) handleProduto(index, newValue.id);

                              return;
                            }}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={12} md={4} lg={1}>
                        <TextField
                          name="valorUnitario"
                          required
                          title="Valor unitário"
                          label="Valor unitário"
                          variant="outlined"
                          fullWidth
                          type="text"
                          disabled
                          value={itemOrcamento.valorUnitario}
                          onChange={(e) =>
                            setScheduleItemValue(
                              index,
                              "valorUnitario",
                              e.target.value
                            )
                          }
                        />
                      </Grid>
                      <Grid item xs={12} sm={12} md={4} lg={1}>
                        <TextField
                          name="valorTotal"
                          required
                          title="Valor total"
                          label="Valor total"
                          variant="outlined"
                          disabled
                          fullWidth
                          type="currency"
                          value={itemOrcamento.valorTotal}
                          onChange={(e) =>
                            setScheduleItemValue(
                              index,
                              "valorTotal",
                              e.target.value
                            )
                          }
                        />
                      </Grid>
                      <Grid item xs={12} sm={12} md={2} lg={2}>
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={12} md={12} lg={12}>
                            <IconButton onClick={() => handleDelete(index)}>
                              <Delete color="error" />
                            </IconButton>
                            <IconButton onClick={() => addNewScheduleItem()}>
                              <Add color="primary" />
                            </IconButton>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  );
                })}
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={12} md={6} lg={6}>
                    <TextField
                      name="totalFinal"
                      required
                      title="Total final"
                      label="Total final"
                      variant="outlined"
                      disabled
                      fullWidth
                      type="currency"
                      value={totalFinal}
                    />
                  </Grid>
                </Grid>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={12} md={6} lg={6}>
                    <Button
                      variant="contained"
                      color="secondary"
                      type="submit"
                      startIcon={<Send />}
                    >
                      Enviar orçamento
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </form>
        </Grid>
      </Grid>
      <Dialog
        open={modal.open}
        title={modal.text}
        success={modal.success}
        handleClick={() => setModal({ ...modal, open: true })}
        handleClose={() => setModal({ ...modal, open: false })}
      />
      <Snackbar
        open={alert.open}
        text={alert.text}
        severity={alert.severity}
        key={alert.key}
      />
    </Container>
  );
}
