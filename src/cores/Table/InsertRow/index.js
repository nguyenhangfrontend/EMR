import React, { useState, useEffect, useRef } from "react";
import moment from "moment";
import { Main } from "./styled";
import Block from "components/Config/Block";
import Cell from "./Cell";
import { dataX } from "mokup";

const InsertRow = (props) => {
  const {
    rows,
    cols,
    keysHadConfig,
    localComponents,
    handleColClick,
    colSelected,
    refArray,
    verticalLine,
    handleUpdateColBox,
    formId,
    mode,
    component,
    form,
    valuesHIS,
  } = props;
  const [localRows, setLocalRows] = useState([]);
  const [localCols, setLocalCols] = useState([]);
  const [localResources, setLocalResources] = useState([]);
  const [values, setValues] = useState({});
  const [formChange, setFormChange] = useState({});
  const [sources, setSources] = useState([]);
  const headerRow = rows[0] || {};

  const prevValuesRef = useRef();
  const prevSourcesRef = useRef();

  useEffect(() => {
    prevValuesRef.current = values;
    prevSourcesRef.current = sources;
  });

  const combineResource = () => {
    const arr = Object.keys(dataX).reduce((res, key) => {
      const defaultRow = rows.find((item) => item.rowKey === key);

      return [
        ...res,
        ...dataX[key].map((item, index) => ({
          ...item,
          rowKey: key,
          key: defaultRow ? defaultRow.key : key,
          copiedKey: index > 0 ? key : null,
        })),
      ];
    }, []);

    const src = arr.reduce((res, item, index) => {
      const obj = Object.keys(item).reduce(
        (r, key) => ({
          ...r,
          [`${index}_${item.rowKey}_${key}`]: item[key],
        }),
        {}
      );

      return { ...res, ...obj };
    }, {});

    setLocalResources(arr);
    setSources(dataX);
    setValues(src);
    setLocalRows(arr);
  };

  useEffect(() => {
    combineResource();
  }, []);

  useEffect(() => {
    setLocalCols(cols);
  }, [rows, cols]);

  const setFormKey = (key) => (value) => {
    const prevValues = prevValuesRef.current;
    const prevSources = prevSourcesRef.current;

    const newForm = { ...prevValues, [key]: value };
    const keySplit = key.split("_");
    const rowKey = `${keySplit[1]}_${keySplit[2]}`;

    const output = {
      ...prevSources,
      [rowKey]: prevSources[rowKey].map((item, i) =>
        i === parseInt(`${keySplit[0]}`)
          ? {
              ...item,
              [`${keySplit[3]}_${keySplit[4]}`]: value,
            }
          : item
      ),
    };

    console.log("output: ", output);
    setValues(newForm);
    // setSources(output);
  };

  useEffect(() => {
    const src = localResources.reduce((res, item, index) => {
      const obj = Object.keys(item).reduce(
        (r, key) => ({
          ...r,
          [`${index}_${item.rowKey}_${key}`]: item[key],
        }),
        {}
      );

      return { ...res, ...obj };
    }, {});

    const obj = Object.keys(src).reduce(
      (result, key) => ({
        ...result,
        [key]: setFormKey(key),
      }),
      {}
    );

    setFormChange(obj);
  }, [localResources]);

  const addRow = (r) => () => {
    const idx = localResources.findIndex((item) => item.key === r.key);
    const rowInsert = {
      ...r,
      key: moment().valueOf(),
      copiedKey: r.copiedKey || r.key,
    };

    const newRows = [
      ...localResources.slice(0, idx + 1),
      rowInsert,
      ...localResources.slice(idx + 1),
    ];

    console.log("newRows: ", newRows);

    setLocalResources(newRows);
  };

  return (
    <Main>
      <table>
        <tbody>
          <tr>
            {localCols.map((col, idx) => {
              const boxKey = `${component.key}_${headerRow.key}_${col.key}`;
              const com = localComponents.find((c) => c.parent === boxKey);
              const config = keysHadConfig ? keysHadConfig[boxKey] : null;
              const width =
                config && config.colSpan
                  ? config.totalWidth - 4
                  : col.width - 4;

              return (
                <td key={idx} width={col.width - 4}>
                  <div className={"in-side-col"}>
                    <Block
                      item={{ key: boxKey, width }}
                      mode={mode}
                      updateComponents={handleUpdateColBox}
                      component={com}
                      formId={formId}
                    />
                  </div>
                </td>
              );
            })}
          </tr>

          {localResources.map((row, index) => {
            return (
              <tr key={index}>
                {localCols.map((col, idx) => {
                  const boxKey = `${component.key}_${row.key}_${col.key}`;
                  const com = localComponents.find((c) => c.parent === boxKey);
                  const config = keysHadConfig ? keysHadConfig[boxKey] : null;
                  const width =
                    config && config.colSpan
                      ? config.totalWidth - 4
                      : col.width - 4;
                  const rowSpan = localResources.filter(
                    (item) => item.key === row.key || item.copiedKey === row.key
                  ).length;

                  if (row.copiedKey && col.fixed) {
                    return null;
                  }

                  if (col.component) {
                    return (
                      <Cell
                        key={`${index}_${col.key}`}
                        col={col}
                        mode={mode}
                        formChange={formChange}
                        defaultValues={values}
                        rowIndex={index}
                        rowKey={row.rowKey}
                        row={row}
                        addRow={addRow}
                      />
                    );
                  }

                  return (
                    <td
                      key={idx}
                      width={col.width - 4}
                      onClick={handleColClick(boxKey)}
                      className={
                        colSelected.includes(boxKey) && mode === "config"
                          ? "col-selected"
                          : ""
                      }
                      rowSpan={col.fixed ? rowSpan : 1}
                    >
                      <div className={"in-side-col"}>
                        <Block
                          ref={(ref) => {
                            refArray.current[`block_${index}_${idx}`] = ref;
                          }}
                          verticalLine={verticalLine}
                          item={{ key: boxKey, width }}
                          mode={mode}
                          updateComponents={handleUpdateColBox}
                          component={com}
                          formId={formId}
                          values={form}
                          formChange={formChange}
                          valuesHIS={valuesHIS}
                        />
                      </div>
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </Main>
  );
};

export default InsertRow;
