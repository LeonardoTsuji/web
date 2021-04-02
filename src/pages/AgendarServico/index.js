import React, { useState, useEffect } from "react";

import { format } from "date-fns";
import DateFnsUtils from "@date-io/date-fns";
import pt from "date-fns/locale/pt-BR";

import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";

import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import Autocomplete from "@material-ui/lab/Autocomplete";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormLabel from "@material-ui/core/FormLabel";
import RadioGroup from "@material-ui/core/RadioGroup";
import Radio from "@material-ui/core/Radio";
import Divider from "@material-ui/core/Divider";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import Dialog from "../../components/core/Feedback/Dialog";
import Snackbar from "../../components/core/Feedback/Snackbar";
import NumberFormat from "../../components/core/Inputs/NumberFormat";
import { Delete, Add, Send, Event, DriveEta } from "@material-ui/icons";
import api from "../../services/api";
import { useAuth } from "../../contexts/auth";
import Breadcrumb from "../../components/core/Navigation/Breadcrumb";
import { Container, ContainarForm, TitleForm } from "./styles";

export default function Agendamentoservico(props) {
  const { id } = useAuth();

  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState({ open: false, text: "", success: true });
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedDateFormated, setSelectedDateFormated] = useState(
    format(new Date(), "dd/MM/yyyy")
  );
  const [selectedHour, setSelectedHour] = useState("");
  const [dateArray, setDateArray] = useState([]);
  const [fabricanteArray, setFabricanteArray] = useState([]);
  const [veiculoArray, setVeiculoArray] = useState([]);
  const [selectedVeiculo, setSelectedVeiculo] = useState("");
  const [selectedFabricante, setSelectedFabricante] = useState("");
  const [placa, setPlaca] = useState("");
  const [quilometro, setQuilometro] = useState(0);
  const [ano, setAno] = useState(new Date());
  const [cor, setCor] = useState("");
  const [error, setError] = useState(false);
  const [helperText, setHelperText] = useState("");
  const [alert, setAlert] = useState({
    open: false,
    text: "",
    severity: "success",
    key: new Date().getTime(),
  });

  useEffect(() => {
    const init = async () => {
      try {
        const response = await api.get("/agenda/1/dia");
        const responseFabricantes = await api.get("/fabricante");
        const responseVeiculos = await api.get("/modelo-veiculo", {
          params: {
            brandId: responseFabricantes.data.data[0]
              ? responseFabricantes.data.data[0].id
              : 1,
          },
        });

        setDateArray(response.data.data);
        setFabricanteArray(responseFabricantes.data.data);
        setSelectedFabricante(
          responseFabricantes.data.data && responseFabricantes.data.data[0].id
        );
        setVeiculoArray(responseVeiculos.data.data);
        setSelectedVeiculo(
          responseVeiculos.data.data && responseVeiculos.data.data[0].id
        );

        setLoading(false);
      } catch (err) {
        setLoading(false);
      }
    };
    init();
  }, []);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setSelectedDateFormated(format(date, "dd/MM/yyyy"));
  };

  function filterWeekends(date) {
    // Return false if  Sunday

    return date.getDay() === 0;
  }

  const handleFabricanteChange = async (value) => {
    const responseVeiculos = await api.get("/modelo-veiculo", {
      params: {
        brandId: value,
      },
    });

    setVeiculoArray(responseVeiculos.data.data);
    setSelectedFabricante(value);
    setSelectedVeiculo(
      responseVeiculos.data.data && responseVeiculos.data.data[0].id
    );
  };

  const onSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await api.post(`/usuario/${id}/veiculo`, {
        plate: placa,
        color: cor,
        kilometer: quilometro ? quilometro.replace(/[ ,.]/g, "") : 0,
        year: ano.getFullYear(),
        brandId: selectedFabricante,
        modelId: selectedVeiculo,
      });

      await api.post(`/agenda`, {
        userId: id,
        dateSchedule: selectedDateFormated,
        vehicleId: response.data.data.id,
      });

      setAlert({
        open: true,
        text: "Agendamento realizado com sucesso!",
        severity: "success",
        key: new Date().getTime(),
      });
    } catch (err) {
      setModal({
        open: true,
        text: "Erro ao agendar o orçamento",
        success: false,
      });
      setAlert({
        open: true,
        text: "Erro ao realizar agendamento!",
        severity: "error",
        key: new Date().getTime(),
      });
    }
  };

  const handlePlaca = (value) => {
    var regex = /^([a-zA-Z]{3})([0-9])([A-Za-z0-9])([0-9]{2})$/g;

    if (!regex.test(value)) {
      setError(true);
      setHelperText("Placa inválida");
    } else {
      setError(false);
      setHelperText("");
    }
    setPlaca(value);
  };

  const handleQuilometro = (value) => {
    const result = Intl.NumberFormat();
    setQuilometro(result.format(value));
  };

  return (
    <Container>
      <Breadcrumb />
      <Grid
        container
        direction="column"
        justify="space-around"
        alignItems="center"
        spacing={0}
      >
        <ContainarForm>
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <TitleForm>
              <Event />
              <Typography variant="h6">Data do orçamento</Typography>
            </TitleForm>
            <form onSubmit={onSubmit}>
              <MuiPickersUtilsProvider utils={DateFnsUtils} locale={pt}>
                <KeyboardDatePicker
                  disableToolbar
                  fullWidth
                  variant="inline"
                  inputVariant="outlined"
                  format="dd/MM/yyyy"
                  margin="normal"
                  label="Data para o orçamento"
                  value={selectedDate}
                  minDate={new Date()}
                  minDateMessage="A data não deve ser anterior à data mínima"
                  onChange={handleDateChange}
                  shouldDisableDate={filterWeekends}
                  InputProps={{ readOnly: true }}
                />
              </MuiPickersUtilsProvider>
              <TitleForm>
                <DriveEta />
                <Typography variant="h6">Dados do veículo</Typography>
              </TitleForm>
              <FormControl margin="normal" variant="outlined" fullWidth>
                <InputLabel shrink id="fabricante">
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
                    if (newValue) handleFabricanteChange(newValue.id);
                    return;
                  }}
                />
              </FormControl>
              <FormControl margin="normal" variant="outlined" fullWidth>
                <InputLabel shrink id="veiculo">
                  Veículo
                </InputLabel>
                <Autocomplete
                  options={veiculoArray}
                  getOptionLabel={(option) => option.model}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Veículo"
                      variant="outlined"
                      required
                    />
                  )}
                  onChange={(e, newValue) => {
                    if (newValue) setSelectedVeiculo(newValue.id);
                    return;
                  }}
                />
              </FormControl>
              <Grid item xs={12} sm={12} md={12} lg={12}>
                <TextField
                  name="placa"
                  required
                  margin="normal"
                  label="Placa"
                  type="text"
                  placeholder="AAA1234 ou AAA1A11"
                  variant="outlined"
                  value={placa}
                  onChange={(e) => handlePlaca(e.target.value)}
                  fullWidth
                  error={error}
                  helperText={helperText}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={12}>
                <TextField
                  name="quilometragem"
                  required
                  margin="normal"
                  label="Quilometragem"
                  type="text"
                  name="quilometragem"
                  variant="outlined"
                  value={quilometro}
                  onBlur={(e) => handleQuilometro(e.target.value)}
                  onChange={(e) => setQuilometro(e.target.value)}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={12}>
                <MuiPickersUtilsProvider utils={DateFnsUtils} locale={pt}>
                  <KeyboardDatePicker
                    disableToolbar
                    format="yyyy"
                    fullWidth
                    margin="normal"
                    minDateMessage="A data não deve ser anterior à data mínima"
                    name="ano"
                    required
                    label="Ano"
                    autoOk
                    variant="inline"
                    inputVariant="outlined"
                    value={ano}
                    views={["year"]}
                    onChange={(date) => setAno(date)}
                  />
                </MuiPickersUtilsProvider>
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={12}>
                <TextField
                  name="cor"
                  required
                  margin="normal"
                  label="Cor"
                  type="text"
                  variant="outlined"
                  value={cor}
                  onChange={(e) => setCor(e.target.value)}
                  fullWidth
                />
              </Grid>
              <Button
                variant="contained"
                size="small"
                color="primary"
                type="submit"
              >
                Agendar orçamento
              </Button>
            </form>
          </Grid>
        </ContainarForm>
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
