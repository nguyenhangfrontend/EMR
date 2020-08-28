import React, { useState } from "react";
import T from "prop-types";
import { Table, Empty } from "antd";
import { Main } from "./styled";
import stringUtils from "mainam-react-native-string-utils";

const CustomTable = (props) => {
  const { Column } = Table;
  const [state, _setState] = useState({});
  const setState = (data = {}) => {
    _setState((state) => {
      return { ...state, ...data };
    });
  };
  const setRowClassName = (item = {}, index) => {
    if (props.activeRow(item, index)) return "active-row";
    if (props.disableRow(item, index)) return "disable-row";
    return "";
  };
  let columns = props.columns;
  let subHeader = props.subHeader || [];
  if (subHeader && subHeader.length)
    columns = columns.map((item, index) => {
      try {
        let sub = subHeader.find((item) => item.index === index);
        if (!sub) {
          sub = {};
        }
        item.children = [sub];
        sub.dataIndex = item.dataIndex;
        sub.key = "subHeader" + index;
        sub.width = item.width;
        if (item.render) sub.render = item.render;
      } catch (error) {}
      return item;
    });
  return (
    <Main headerSearch={props.headerSearch}>
      <Table
        {...props}
        rowClassName={setRowClassName}
        columns={columns}
      ></Table>
    </Main>
  );
};

CustomTable.defaultProps = {
  dataSource: [],
  columns: [],
  headerSearch: false,
  disableRow: () => {
    return false;
  },
  activeRow: () => {},
};

CustomTable.propTypes = {
  dataSource: T.array,
  columns: T.array,
  headerSearch: T.bool,
  disableRow: T.func,
  activeRow: T.func,
};

export default CustomTable;
