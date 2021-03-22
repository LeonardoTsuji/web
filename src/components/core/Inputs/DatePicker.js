import React from "react";
import { format } from "date-fns";
import DateFnsUtils from "@date-io/date-fns";
import pt from "date-fns/locale/pt-BR";

import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from "@material-ui/pickers";

export default function DatePicker(props) {
  return (
    <div>
      <MuiPickersUtilsProvider utils={DateFnsUtils} locale={pt}>
        <KeyboardDatePicker
          disableToolbar
          fullWidth
          variant="inline"
          inputVariant="outlined"
          format="dd/MM/yyyy"
          margin="normal"
          label={props.label}
          value={props.value}
          minDate={props.minDate}
          onChange={props.onChange}
          shouldDisableDate={props.disableDate}
          minDateMessage="A data não deve ser anterior à data mínima"
          InputProps={{ readOnly: props.readOnly }}
        />
      </MuiPickersUtilsProvider>
    </div>
  );
}
