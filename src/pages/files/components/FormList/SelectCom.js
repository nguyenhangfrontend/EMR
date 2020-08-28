import React, { useEffect, useRef } from 'react';
import { Select } from "antd";
import { get } from "lodash";
import { checkAvailableToAdd } from './constants';

const SelectCom = ({ handleSelect, handleOnBlur, template, files, setOnAddNew }) => {
  const selectRef = useRef(null);

  useEffect(() => {
    const inputRef = get(selectRef, 'current.rcSelect.inputRef', {});

    if (inputRef.focus) {
      inputRef.click();
    }
  }, []);

  const handleSelectItem = (value, obj) => {
    handleSelect(value, obj);
    setOnAddNew(false);
  };

  return (
    <Select
      autoFocus
      ref={selectRef}
      showSearch
      allowClear
      showArrow={false}
      size={'small'}
      style={{ width: '100%' }}
      onSelect={handleSelectItem}
      placeholder={'Chọn phiếu thêm'}
      onBlur={handleOnBlur}
      className={`file-list-add-select`}
    >
      {template.map(item => (
        <Select.Option
          disabled={!checkAvailableToAdd(item, files)}
          key={item.bieuMau.ma}
          value={item.bieuMau.ten}
        >
          {item.bieuMau.ten}
        </Select.Option>
      ))}
    </Select>
  )
};

export default SelectCom;
