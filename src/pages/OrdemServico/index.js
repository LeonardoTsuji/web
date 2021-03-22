import React, { useState, useEffect } from "react";

import { format } from "date-fns";

import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormLabel from "@material-ui/core/FormLabel";
import RadioGroup from "@material-ui/core/RadioGroup";
import Radio from "@material-ui/core/Radio";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import Snackbar from "../../components/core/Feedback/Snackbar";
import Dialog from "../../components/core/Feedback/Dialog";
import { Delete, Add, Send } from "@material-ui/icons";
import api from "../../services/api";
import { Container, ContainerTitle } from "./styles";

export default function OrdemServico(props) {
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState({ open: false, text: "" });
  const [alert, setAlert] = useState({
    open: false,
    text: "",
    severity: "success",
    key: new Date().getTime(),
  });
  const [selectedOrcamento, setSelectedOrcamento] = useState({});
  const [orcamentoArray, setOrcamentoArray] = useState([]);
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
  const [formaPagamento, setFormaPagamento] = useState("dinheiro");
  const [pago, setPago] = useState("nao");
  const [finalizado, setFinalizado] = useState("nao");
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
        const responseOrcamento = await api.get("/orcamento", {
          params: {
            status: "APROVADO",
          },
        });

        setUsuarioArray(response.data.data);
        setFabricanteArray(responseFabricantes.data.data);
        setCategoriaArray(responseCategorias.data.data);
        setProdutoArray(responseProdutos.data.data);
        setAgendamento(responseAgendamentos.data.data);
        setOrcamentoArray(responseOrcamento.data.data);
        setLoading(false);
      } catch (err) {
        setLoading(false);
      }
    };
    init();
  }, []);

  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await api.post("/ordem-servico", {
        paid: pago === "sim",
        done: finalizado === "sim",
        paymentMethod: formaPagamento,
        amount: totalFinal,
        userId: usuarioId,
        userVehicleId: carro.id,
        products: itemsOrcamento,
      });

      setAlert({
        open: true,
        text: "Ordem de serviço gerada com sucesso!",
        severity: "success",
        alert: new Date().getTime(),
      });
    } catch (error) {
      setModal({ open: true, text: "Erro ao gerar ordem de serviço" });
    }
  };

  const handleOrcamento = async (value) => {
    setSelectedOrcamento(value);
    const itens = [];

    const promisesOrcamento =
      orcamentoArray &&
      orcamentoArray.map(async (orcamento) => {
        if (orcamento.id === value) {
          setCarro({
            modelo: orcamento.vehicle.model.model,
            placa: orcamento.vehicle.plate,
            cor: orcamento.vehicle.color,
            quilometragem: orcamento.vehicle.kilometer,
            ano: orcamento.vehicle.year,
            marca: orcamento.vehicle.brand.name,
            id: orcamento.userVehicleId,
          });
          setUsuario(orcamento.vehicle.user.name);
          setUsuarioId(orcamento.userId);

          if (orcamento.products) {
            const promisesProdutos = orcamento.products.map(async (produto) => {
              try {
                const responseProdutos = await api.get("/produto", {
                  params: {
                    categoryId: produto.categoryId,
                    brandId: produto.brandId,
                  },
                });

                itens.push({
                  fabricante: produto.brandId,
                  categoria: produto.categoryId,
                  descricao: produto.description,
                  productId: produto.id,
                  produto: produto.id,
                  quantity: produto.budgetProduct.quantity,
                  produtoArray: responseProdutos.data.data,
                  valorUnitario: produto.price,
                  valorTotal: produto.price * produto.budgetProduct.quantity,
                });
              } catch (err) {}
            });

            await Promise.all(promisesProdutos);
          }
          setItemsOrcamento(itens);
        }
      });

    await Promise.all(promisesOrcamento);
  };

  return (
    <Container>
      <Grid container spacing={0}>
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <ContainerTitle>
            <Typography variant="h5" component="h1">
              Ordem de serviço
            </Typography>
          </ContainerTitle>
          <form onSubmit={onSubmit}>
            <Grid item xs={12} sm={12} md={12} lg={12}>
              <Grid item xs={12} sm={12} md={12} lg={12}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={12} md={5} lg={5}>
                    <FormControl variant="outlined" fullWidth>
                      <InputLabel shrink="true" id="orcamento">
                        Orçamento
                      </InputLabel>
                      <Select
                        labelId="orcamento"
                        value={selectedOrcamento}
                        fullWidth
                        onChange={(e) => handleOrcamento(e.target.value)}
                        label="Orçamento"
                        displayEmpty
                      >
                        <MenuItem value="" disabled>
                          <em>Selecione uma opção</em>
                        </MenuItem>
                        {orcamentoArray &&
                          orcamentoArray.map((fab) => (
                            <MenuItem key={fab.id} value={fab.id}>
                              {fab.createdAt
                                ? format(new Date(fab.createdAt), "dd/MM/yyyy")
                                : ""}
                            </MenuItem>
                          ))}
                      </Select>
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
                  <Grid item xs={12} sm={12} md={5} lg={5}>
                    <TextField
                      name="usuario"
                      label="Usuário"
                      value={usuario}
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
                      <Grid item xs={12} sm={12} md={2} lg={1}>
                        <TextField
                          name="quantity"
                          required
                          title="Quantidade"
                          label="Quantidade"
                          variant="outlined"
                          disabled
                          type="number"
                          inputProps={{ min: 0 }}
                          fullWidth
                          value={itemOrcamento.quantity}
                        />
                      </Grid>
                      <Grid item xs={12} sm={12} md={3} lg={2}>
                        <FormControl variant="outlined" fullWidth>
                          <InputLabel shrink="true" id="fabricante">
                            Fabricante
                          </InputLabel>
                          <Select
                            labelId="fabricante"
                            value={itemOrcamento.fabricante}
                            fullWidth
                            disabled
                            displayEmpty
                          >
                            <MenuItem value="" disabled>
                              <em>Selecione uma opção</em>
                            </MenuItem>
                            {fabricanteArray &&
                              fabricanteArray.map((fab) => (
                                <MenuItem key={fab.id} value={fab.id}>
                                  {fab.name}
                                </MenuItem>
                              ))}
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={12} md={3} lg={3}>
                        <FormControl variant="outlined" fullWidth>
                          <InputLabel shrink="true" id="categoria">
                            Categoria
                          </InputLabel>
                          <Select
                            labelId="categoria"
                            value={itemOrcamento.categoria}
                            fullWidth
                            disabled
                            displayEmpty
                          >
                            <MenuItem value="" disabled>
                              <em>Selecione uma opção</em>
                            </MenuItem>
                            {categoriaArray &&
                              categoriaArray.map((fab) => (
                                <MenuItem key={fab.id} value={fab.id}>
                                  {fab.name}
                                </MenuItem>
                              ))}
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={12} md={4} lg={4}>
                        <FormControl variant="outlined" fullWidth>
                          <InputLabel shrink="true" id="produto">
                            Produto
                          </InputLabel>
                          <Select
                            labelId="produto"
                            value={itemOrcamento.produto}
                            fullWidth
                            disabled
                            displayEmpty
                          >
                            <MenuItem value="" disabled>
                              <em>Selecione uma opção</em>
                            </MenuItem>
                            {itemOrcamento.produtoArray &&
                              itemOrcamento.produtoArray.map((fab) => (
                                <MenuItem key={fab.id} value={fab.id}>
                                  {fab.name}
                                </MenuItem>
                              ))}
                          </Select>
                        </FormControl>
                      </Grid>
                      {/* <Grid item xs={12} sm={12} md={3} lg={3}>
                        <TextField
                          name="descricao"
                          title="Descrição"
                          label="Descrição"
                          variant="outlined"
                          fullWidth
                          type="text"
                          shrink="true"
                          value={itemOrcamento.descricao}
                          onChange={(e) =>
                            setScheduleItemValue(
                              index,
                              "descricao",
                              e.target.value
                            )
                          }
                        />
                      </Grid> */}
                      <Grid item xs={12} sm={12} md={1} lg={1}>
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
                          disabled
                        />
                      </Grid>
                      <Grid item xs={12} sm={12} md={1} lg={1}>
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
                          disabled
                        />
                      </Grid>
                    </Grid>
                  );
                })}
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={12} md={5} lg={5}>
                    <FormControl component="fieldset">
                      <FormLabel component="legend">Pago</FormLabel>
                      <RadioGroup
                        name="pago"
                        value={pago}
                        row
                        onChange={(e) => setPago(e.target.value)}
                      >
                        <FormControlLabel
                          value="sim"
                          control={<Radio />}
                          label="Sim"
                        />
                        <FormControlLabel
                          value="nao"
                          control={<Radio />}
                          label="Não"
                        />
                      </RadioGroup>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={12} md={5} lg={5}>
                    <FormControl component="fieldset">
                      <FormLabel component="legend">Finalizado</FormLabel>
                      <RadioGroup
                        name="finalizado"
                        value={finalizado}
                        row
                        onChange={(e) => setFinalizado(e.target.value)}
                      >
                        <FormControlLabel
                          value="sim"
                          control={<Radio />}
                          label="SIM"
                        />
                        <FormControlLabel
                          value="nao"
                          control={<Radio />}
                          label="NAO"
                        />
                      </RadioGroup>
                    </FormControl>
                  </Grid>
                </Grid>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={12} md={5} lg={5}>
                    <FormControl component="fieldset">
                      <FormLabel component="legend">
                        Forma de pagamento
                      </FormLabel>
                      <RadioGroup
                        aria-label="gender"
                        name="gender1"
                        value={formaPagamento}
                        row
                        onChange={(e) => setFormaPagamento(e.target.value)}
                      >
                        <FormControlLabel
                          value="dinheiro"
                          control={<Radio />}
                          label="Dinheiro"
                        />
                        <FormControlLabel
                          value="cartaoCredito"
                          control={<Radio />}
                          label="Cartão de crédito"
                        />
                        <FormControlLabel
                          value="cartaoDebito"
                          control={<Radio />}
                          label="Cartão de débito"
                        />
                      </RadioGroup>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={12} md={5} lg={5}>
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
                      Enviar ordem de serviço
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
