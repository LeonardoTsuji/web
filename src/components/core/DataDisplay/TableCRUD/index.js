import React, { useState, useEffect } from "react";
import MaterialTable from "material-table";
import Grid from "@material-ui/core/Grid";
import Snackbar from "../../Feedback/Snackbar";
import { Container } from "./styles";

export default function TableCRUD(props) {
  const [columns, setColumns] = useState(props.columns);
  const [state, setState] = useState([]);

  useEffect(() => {
    setState(props.data);
  }, []);

  const handleSelectedDelete = async (rowData) => {
    if (props.handleSelectedDelete)
      return props.handleSelectedDelete({ rowData });

    const dataDelete = [...state];
    rowData.forEach(async (row) => {
      dataDelete.splice(row.id, 1);
    });
    setState([...dataDelete]);
  };

  const handleDelete = (oldData) => {
    if (props.onRowDelete) return props.onRowDelete({ oldData });

    new Promise((resolve, reject) => {
      setTimeout(() => {
        const dataDelete = [...state];
        const index = oldData.tableData.id;
        dataDelete.splice(index, 1);
        setState([...dataDelete]);

        resolve();
      }, 1000);
    });
  };

  const handleAdd = (newData) => {
    if (props.onRowAdd) return props.onRowAdd({ newData });
    else {
      new Promise((resolve, reject) => {
        setTimeout(() => {
          setState([...state, newData]);
          resolve();
        }, 1000);
      });
    }
  };

  const handleUpdate = async (newData, oldData) => {
    if (props.onRowUpdate) return props.onRowUpdate({ newData, oldData });

    new Promise((resolve, reject) => {
      setTimeout(() => {
        const dataUpdate = [...state];
        const index = oldData.tableData.id;
        dataUpdate[index] = newData;
        setState([...dataUpdate]);

        resolve();
      }, 1000);
    });
  };

  return (
    <Container>
      <Grid container spacing={0}>
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <MaterialTable
            title={props.title}
            columns={columns}
            isLoading={props.isLoading}
            data={state}
            options={{
              exportButton: true,
              selection: props.selection === false ? false : true,
              actionsColumnIndex: -1,
            }}
            actions={
              props.actions === false
                ? null
                : [
                    {
                      tooltip: "Remover todos os registros selecionados",
                      icon: "delete",
                      onClick: (evt, data) => handleSelectedDelete(data),
                    },
                  ]
            }
            editable={
              props.editable === false
                ? {
                    onRowAdd: props.onRowAdd
                      ? (newData) => handleAdd(newData)
                      : null,
                    onRowUpdate: props.onRowUpdate
                      ? (newData, oldData) => handleUpdate(newData, oldData)
                      : null,
                    onRowDelete: props.onRowDelete
                      ? (oldData) => handleDelete(oldData)
                      : null,
                  }
                : {
                    onRowAdd: (newData) => handleAdd(newData),
                    onRowUpdate: (newData, oldData) =>
                      handleUpdate(newData, oldData),
                    onRowDelete: (oldData) => handleDelete(oldData),
                  }
            }
            detailPanel={
              props.detailPanel ? (rowData) => props.detailPanel(rowData) : null
            }
            localization={{
              body: {
                emptyDataSourceMessage: "Nenhum registro para exibir",
                addTooltip: "Adicionar",
                deleteTooltip: "Excluir",
                editTooltip: "Editar",
                editRow: {
                  deleteText: "Tem certeza que deseja deletar esse item?",
                  cancelTooltip: "Cancelar",
                  saveTooltip: "Salvar",
                },
              },
              header: {
                actions: "Ações",
              },
              toolbar: {
                searchTooltip: "Pesquisar",
                searchPlaceholder: "Pesquisar",
                nRowsSelected: "{0} linhas(s) selecionadas",
                exportName: "Exportar como CSV",
                exportTitle: "Exportar",
              },
              pagination: {
                labelRowsSelect: "linhas",
                labelDisplayedRows: "{count} de {from}-{to}",
                firstTooltip: "Primeira página",
                previousTooltip: "Página anterior",
                nextTooltip: "Próxima página",
                lastTooltip: "Última página",
              },
            }}
          />
        </Grid>
      </Grid>
      <Snackbar
        key={props.key}
        open={props.alertOpen}
        text={props.alertText}
        severity={props.alertSeverity}
      />
    </Container>
  );
}
