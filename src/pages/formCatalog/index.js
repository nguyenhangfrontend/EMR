import React from "react";
import { Card } from "antd";
import { Main } from "./styled";
import FormCatalog from "components/form-catalog";

const ServivalIndex = () => {
  return (
    <Main>
      <div className="layout-body">
        <div className="layout-middle">
          <Card>
            <FormCatalog />
          </Card>
        </div>
      </div>
    </Main>
  );
};

export default ServivalIndex;
