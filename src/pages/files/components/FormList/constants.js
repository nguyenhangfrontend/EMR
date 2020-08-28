import React from "react";
import { Icon } from 'antd';
import { uniqBy } from 'lodash';

const group = (list) => {
  const newList = [];

  list.forEach(item => {
    const sub = list
      .filter(i => i.formId === item.formId)
      .map((item => ({
        ...item,
        parentKey: `${item.formId || item.formValue}`,
        key: item.isNew ? item.key : `${item.formId || item.formValue}_${item['nbHoSoBaId']}`,
      })));

    if (sub.length > 1) {
      const obj = {
        ...item,
        key: item.formId || item.formValue,
        sub: uniqBy(sub, 'nbHoSoBaId').map((item, index) => ({ ...item, title: `Tờ số ${index + 1}` })),
        hasChild: true,
        title: item.formName,
      };

      if (!newList.find(o => o.key === (item.formId || item.formValue))) {
        newList.push(obj);
      }
    } else {
      newList.push({...item, key: item.isNew ? item.key : item.formId || item.formValue});
    }
  });

  return newList;
};

const renderTitle = (level = 1, searchValue, handleDelete, title, item) => {
  const index = title.toLocaleLowerCase().indexOf(searchValue.toLocaleLowerCase());
  const beforeStr = title.slice(0, index);
  const middleStr = title.slice(index, index + searchValue.length);
  const afterStr = title.slice(index + searchValue.length);

  const deleteItem = () => {
    handleDelete(item);
  };

  return (
    <span className={`main-title level-${level}`}>
      {index > -1 ? (
        <span className={`file-name-render item-level-${level}`}>
          {beforeStr}
          <span style={{ color: '#f50' }}>{middleStr}</span>
          {afterStr}
        </span>
      ) : (
        <span className={`file-name-render item-level-${level}`}>{title}</span>
      )}

      {(item && (item['nbHoSoBaId'] || item.isNew)) && (
        <Icon onClick={deleteItem} className={'tree-delete-icon'} type={'close-circle'} />
      )}
    </span>
  )
};

const checkAvailableToAdd = (item, files) => {
  if (!item.bieuMau.editor) {
    return false;
  }

  if (!item.macDinh && !files.find(f => f.formId === item.bieuMau.formId)) {
    return true;
  }

  if (item.active) {
    return true;
  }

  return item.taoNhieuMau;
};

export { group, renderTitle, checkAvailableToAdd };