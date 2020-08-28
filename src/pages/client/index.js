import React, { Suspense } from "react";
import { Layout } from "antd";
import Menu from "components/Menu";
import Pages from "pages";

const ClientLayout = () => {
  return (
    <Layout>
      <Layout.Sider collapsible width={240} className={"app-sider"}>
        <Suspense fallback={<div>{"loading"}</div>}>
          <Menu />
        </Suspense>
      </Layout.Sider>

      <Layout.Content style={{ backgroundColor: "transparent" }}>
        <Pages />
      </Layout.Content>
      
    </Layout>
  );
};

export default ClientLayout;
