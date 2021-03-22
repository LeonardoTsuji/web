import React from "react";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import { useStyles } from "./styles";

export default function CardComponent(props) {
  const { title, subheader, text } = props;
  const classes = useStyles();

  return (
    <Card className={classes.root}>
      <CardHeader title={title} subheader={subheader} />
      <CardContent>{text}</CardContent>
    </Card>
  );
}
