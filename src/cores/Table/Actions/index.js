import React from 'react';
import T from 'prop-types';
import { sum } from 'lodash';
import { Menu, message } from 'antd';
import { Main } from './styled';
import { checkConsecutive } from '../constants';

const TableActions = ({ colSelected, rows, cols, handleUpdateColBox, itemProps }) => {
  const handleMerCol = () => {
    const colsKey = colSelected.map(key => {
      // key index: 0 component key, 1 row key, 2 col key
      const keys = key.split('_');
      return parseInt(keys[2]);
    });
    
    const colsIndex = colsKey.map(key => cols.findIndex(item => item.key === key));
    
    if (checkConsecutive(colsIndex)) {
      const currentConfig = itemProps.keysHadConfig || {};
      
      const totalWidth = sum(colsIndex.map(index => cols[index]['width']));
      const newConfig = colSelected.reduce((res, key, index) => ({
        ...res,
        [key]: {
          hadConfig: true,
          hide: index > 0,
          colSpan: colsIndex.length,
          totalWidth,
        }
      }), {});
      
      const props = {
        ...itemProps,
        keysHadConfig: {
          ...currentConfig,
          ...newConfig,
        },
      };
      
      handleUpdateColBox({ props });
    } else {
      message.error('Can not merge!')
    }
  };
  
  
  const handleMergeRow = () => {
    const rowsKey = colSelected.map(key => {
      // key index: 0 component key, 1 row key, 2 col key
      const keys = key.split('_');
      return parseInt(keys[1]);
    });
  
    const rowsIndex = rowsKey.map(key => rows.findIndex(item => item.key === key));
  
    if (checkConsecutive(rowsIndex)) {
      const currentConfig = itemProps.keysHadConfig || {};
      const newConfig = colSelected.reduce((res, key, index) => ({
        ...res,
        [key]: {
          ...currentConfig[key],
          hide: index > 0,
          rowSpan: rowsIndex.length,
        }
      }), {});
    
      const props = {
        ...itemProps,
        keysHadConfig: {
          ...currentConfig,
          ...newConfig,
        },
      };
    
      handleUpdateColBox({ props });
    } else {
      message.error('Can not merge!')
    }
  };
  
  return (
    <Main>
      <Menu>
        <Menu.Item onClick={handleMerCol}>
          <span>{'Merge Col'}</span>
        </Menu.Item>
  
        <Menu.Item onClick={handleMergeRow}>
          <span>{'Merge Row'}</span>
        </Menu.Item>
      </Menu>
    </Main>
  );
};

TableActions.defaultProps = {
  handleUpdateColBox: () => {},
};

TableActions.propTypes = {
  handleUpdateColBox: T.func,
};

export default TableActions;
