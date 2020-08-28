import React from 'react';
import InsertRow from './InsertRow';
import GridData from './GridDataRender';
import LayoutRender from './LayoutRender';
import AddRow from './AddRow';
import Categories from './Categories';
import ConfigRender from './ConfigRender';


export const composeRender = (type, props) => {
  const { mode } = props;

  if (mode === 'config' && type === 'analytic') {
    return <Categories {...props} />;
  }

  if (mode === 'config') {
    return <ConfigRender {...props} />;
  }

  if (type === 'insertRow') {
    return <InsertRow {...props} />
  }

  if (type === 'gridData') {
    return <GridData {...props} />
  }

  if (type === 'replicationRow') {
    return <AddRow {...props} />
  }

  if (type === 'analytic') {
    return <Categories {...props} />
  }

  return <LayoutRender {...props} />
};

export const checkConsecutive = (indexList) => {
  if (indexList.length > 1) {
    let idx = 0;
    
    while (idx < indexList.length) {
      if (indexList[idx] + 1 !== indexList[idx + 1]) {
        return false;
      }
      idx += 1;
      
      if (idx === indexList.length - 1) {
        return true;
      }
    }
  } else {
    return true;
  }
};

