import React from "react";
import QRCodeGenerator from "./components/QRCodeGenerator";
import { Container } from "react-bootstrap";

const App = () => {
  return (
    <Container className="col-md-8 my-5">
      <QRCodeGenerator />
    </Container>
  );
};

export default App;
