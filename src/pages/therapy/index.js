import React, { useState } from "react";
import { Route } from "react-router-dom";
import RightTool from "components/RightTool";
import { Layout } from 'antd';
import { Main } from "./styled";
import { therapyPages } from "pages/constants";

const { Sider } = Layout;

const Therapy = () => {
  const [collapse, setCollapse] = useState();

  return (
    <Main>
      <div className={"app-contain"}>
        {Object.keys(therapyPages).map(key => (
          <Route
            key={key}
            path={therapyPages[key].path}
            component={therapyPages[key].component}
            exact={therapyPages[key].exact}
          />
        ))}
      </div>

      <Sider
        reverseArrow
        collapsible
        onCollapse={setCollapse}
        width={300}
      >
        <RightTool collapse={collapse} />
      </Sider>
    </Main>
  );
};

export default Therapy;
