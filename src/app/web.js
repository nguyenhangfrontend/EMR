import React, { Suspense } from 'react';
import { Layout } from "antd";
import Header from "components/ClientHeader";
import ClientLayout from "pages/client";

const web = () => {
  return (
    <Layout>
      <Layout.Header className={"app-header"}>
        <Suspense fallback={<div>{"loading"}</div>}>
          <Header />
        </Suspense>
      </Layout.Header>

      <ClientLayout />
    </Layout>
  );
};

export default web;
