import React, { useEffect, useState, useRef } from "react";
import { Table, Card, Row, Col } from "antd";
import { Main } from "./styled";
import RecordType from "./RecordType";
import Form from "./Form";
const MedicalRecord = (props) => {
  return (
    <Main>
      <Row gutter={[8, 8]}>
        <Col className="gutter-row" span={9}>
          <RecordType />
        </Col>
        <Col className="gutter-row" span={15}>
          <Card>
            <Form />
          </Card>
        </Col>
      </Row>
    </Main>
  );
};

export default MedicalRecord;
