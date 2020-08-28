import React from "react";
import { Card } from "antd";
import { Main } from "./styled";
import Scan from "components/ServivalIndex";

const ServivalIndex = () => {
  return (
    <Main>
      <div className="layout-body">
        <div className="layout-middle">
          <Card>
            <Scan />
          </Card>
        </div>
      </div>
    </Main>
  );
};

export default ServivalIndex;
