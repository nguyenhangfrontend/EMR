import React, { useState, useRef } from 'react';
import { Button } from "antd";
import SelectCom from './SelectCom';
import { get } from 'lodash';

const AddForm = ({ template, handleAddFile, files }) => {
  const [onAddNew, setOnAddNew] = useState(false);
  const selectRef = useRef(null);

  const openAddNew = () => {
    const inputRef = get(selectRef, 'current.rcSelect.inputRef', {});

    if (inputRef.focus) {
      inputRef.click();
    }

    setOnAddNew(true);
  };

  const handleOnBlur = () => {
    setOnAddNew(false);
  };

  return (
    <div className={'file-list-add'}>
      {onAddNew && (
        <SelectCom
          handleOnBlur={handleOnBlur}
          template={template}
          handleSelect={handleAddFile}
          files={files}
          setOnAddNew={setOnAddNew}
        />
      )}


      <Button
        className={`file-list-add-btn ${onAddNew ? 'file-list-add-btn-visible' : ''}`}
        block
        type={'dashed'}
        size={'small'}
        icon={'plus'}
        onClick={openAddNew}
      >
        {'Thêm phiếu'}
      </Button>
    </div>
  )
};

export default AddForm;
