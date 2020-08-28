import React, { useEffect } from "react";
import { Drawer } from "antd";
import { Main } from "./styled";
import ListForm from "../FormList";
const FormList = ({
  isVisible,
  handleClose,
  fileOnShow,
  formList,
  changeFile
}) => {

  return (
    <Drawer
      size={"small"}
      placement="right"
      closable={false}
      visible={isVisible}
      onClose={handleClose}
      getContainer={false}
      style={{ position: "absolute" }}
      bodyStyle={{
        padding: 12,
      }}
      width={"calc(30% + 12px)"}
    >
      <Main>
        <ListForm fileOnShow={fileOnShow} listForm={formList} changeFile={changeFile}/>
      </Main>
    </Drawer>
  );
};

export default FormList;
