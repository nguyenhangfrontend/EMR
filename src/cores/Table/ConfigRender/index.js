import React from 'react';
import { Main } from './styled';
import Block from "components/Config/Block";

const ConfigRender = (props) => {
  const { rows, cols, keysHadConfig, localComponents, handleColClick, colSelected, valuesHIS,
    refArray, verticalLine, handleUpdateColBox, formId, mode, component, form, formChange } = props;

  return (
    <Main>
      <table >
        <tbody>
        {rows.map((row, index) => (
          <tr key={index}>
            {cols.map((col, idx)=> {
              const boxKey = `${component.key}_${row.key}_${col.key}`;
              const com = localComponents.find(c => c.parent === boxKey);
              const config = keysHadConfig ? keysHadConfig[boxKey] : null;
              const width = config && config.colSpan ? config.totalWidth - 4 : col.width - 4;

              if (config && config.hide) {
                return null;
              }

              return (
                <td
                  key={idx}
                  width={col.width - 4}
                  onClick={handleColClick(boxKey)}
                  className={colSelected.includes(boxKey) && mode === 'config' ? 'col-selected' : ''}
                  colSpan={config ? config.colSpan : ''}
                  rowSpan={config ? config.rowSpan : ''}

                >
                  <div className={'in-side-col'}>
                    <Block
                      ref={ref => {
                        refArray.current[`block_${index}_${idx}`] = ref;
                      }}
                      verticalLine={verticalLine}
                      item={{ key: boxKey, width }}
                      mode={mode}
                      updateComponents={handleUpdateColBox}
                      component={com}
                      formId={formId}
                      values={form}
                      valuesHIS={valuesHIS}
                      formChange={formChange}
                    />
                  </div>
                </td>
              )
            })}
          </tr>
        ))}
        </tbody>
      </table>
    </Main>
  )
};

export default ConfigRender;
