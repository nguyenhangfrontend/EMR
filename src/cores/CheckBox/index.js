import React from 'react';
import T from 'prop-types';
import { Main } from './styled';
import TextEdit from '../TextEdit';

const CheckBox = ({ checked, item, mode, handleUpdateData, handleOnChange, direction }) => {
  const handleOnClick = (e) => {
    if (mode === 'editing') {
      e.preventDefault();
      handleOnChange(item.value);
    }
  };
  
  const handleLabelChange = (value) => {
    handleUpdateData({
      ...item,
      labelValue: value,
    });
  };
  
  return (
    <Main checked={checked} onClick={handleOnClick} direction={direction}>
      <TextEdit onChange={handleLabelChange} mode={mode} defaultValue={item.label || 'label'} />
      <div className={'check-box-contain'}>
        <span>{checked ? 'x' : ''}</span>
      </div>
    </Main>
  )
};

CheckBox.defaultProps = {
  direction: 'ltr'
};

CheckBox.propTypes = {
  checked: T.bool,
  label: T.string,
  direction: T.string,
};

export default CheckBox;
