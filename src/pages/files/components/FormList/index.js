import React, { useEffect, useState, useRef, forwardRef, useImperativeHandle } from "react";
import { uniqBy } from 'lodash';
import { Drawer, Tree, Card, message, Modal } from "antd";
import { group, renderTitle } from './constants';
import CardTitle from './CardTitle';
import AddForm from './AddForm';

import { Main } from "./styled";

const { TreeNode, DirectoryTree } = Tree;

const FormList = forwardRef((props, ref) => {
  const { isVisible, handleCloseForm, changeFile, template, list, removeFile, templateName } = props;

  const [expandedKeys, setExpandedKeys] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [files, setFiles] = useState([]);
  const [treeWidth, setTreeWidth] = useState(0);
  const containRef = useRef(null);

  useImperativeHandle(ref, () => ({
    setExpandedKeys,
    setSelectedKeys,
  }));

  useEffect(() => {
    setTreeWidth(containRef.current.clientWidth);
  }, [isVisible]);

  useEffect(() => {
    const f = list
      .filter(item => item.macDinh || item['nbHoSoBaId'])
      .map(item => ({ ...item, title: item.formName || item.name, key: item.formId || item.formValue}))
      .sort((a, b) => a.stt - b.stt);

    setFiles(f);
  }, [list]);

  const handleChangeView = (viewOnly) => {
    if (viewOnly) {
      const f = files.filter(item => !!item.hsdd);

      setFiles(f);
    } else {
      const f = list
        .filter(item => item.macDinh || item['nbHoSoBaId'])
        .map(item => ({ ...item, title: item.formName || item.name, key: item.formId || item.formValue}))
        .sort((a, b) => a.stt - b.stt);

      setFiles(f);
    }
  };

  const selectItem = (keys) => {
    const file = files.find(item =>
      `${item.formId}` === keys[0]
      || item.key === keys[0]
      || `${item.formId}_${item.nbHoSoBaId}` === keys[0]);

    if (file) {
      setSelectedKeys(keys);
      changeFile(file);
    }
  };

  const handleDelete = (file) => {
    const index = files.findIndex(item => item.key === file.key
      || (file.parentKey === `${item.key}` && file['nbHoSoBaId'] === item['nbHoSoBaId'])
    );
    const f = files.filter(item => item.key !== file.key
      || !(file.parentKey === `${item.key}` && file['nbHoSoBaId'] === item['nbHoSoBaId']));

    const fileNext = files[index === 0 ? 0 : index - 1];

    Modal.confirm({
      title: 'Bạn có chắc muốn xoá bản ghi này?',
      content: `Bản ghi: ${file.formName}`,
      okText: 'Xoá',
      okType: 'danger',
      cancelText: 'Huỷ',
      onOk() {
        if (file['nbHoSoBaId']) {
          removeFile(file);
        } else {
          setFiles(f);
          changeFile(fileNext);
          setSelectedKeys([`${fileNext.key}`]);
        }
      },
    });
  };

  const handleAddFile = (value, obj) => {
    // find file template
    const t = template.find(item => item.bieuMau.ma === obj.key);
    const currentFiles = files
      .filter(item => item.formId === t.bieuMau.formId)
      .map(item => ({ key: item.key || item['nbHoSoBaId'] }));


    const length = uniqBy(currentFiles, 'key').length;

    const newKey = `${t.bieuMau.ma}_${new Date().getTime()}`;
    const newFile = {
      ...t.bieuMau,
      key: newKey,
      title: t.bieuMau.ten,
      formName: `${t.bieuMau.ten} - Tờ số ${length + 1}`,
      isNew: true
    };


    if (!files.filter(f => !!f['nbHoSoBaId']).find(f => f.formId === newFile.formId)
      && files.find(item => item.formId === newFile.formId)
    ) {
      message.warning('Vui lòng bấm lưu tạo bản ghi biểu mẫu trước khi thêm!')
    } else {
      setSelectedKeys([newKey]);
      setFiles([...files, newFile]);

      if (t) {
        changeFile(newFile);
      }
    }
  };

  const handleSearch = (e) => {
    setSearchValue(e.target.value);

    const data = group(files);
    const keys = [];
    const f = list
      .filter(item => item.macDinh || item['nbHoSoBaId'])
      .map(item => ({ ...item, title: item.formName || item.name, key: item.formId || item.formValue}))
      .sort((a, b) => a.stt - b.stt).filter(f => f.title
      .toLocaleLowerCase()
      .includes(e.target.value.toLocaleLowerCase())
    );

    setFiles(f);

    data.forEach(item => {
      if (item.sub) {
        const fileAlive = item.sub.find(f =>
          f.title
            .toLocaleLowerCase()
            .includes(e.target.value.toLocaleLowerCase())
        );

        if (fileAlive) {
          keys.push(fileAlive.parentKey);
        }
      }
    });

    setExpandedKeys(keys);
  };

  return (
    <Drawer
      size={'small'}
      placement="right"
      closable={false}
      visible={isVisible}
      onClose={handleCloseForm}
      getContainer={false}
      style={{ position: 'absolute' }}
      bodyStyle={{ padding: 0 }}
      width={'calc(30% + 12px)'}
    >
      <Main width={treeWidth}>
        <Card
          size={'small'}
          title={(
            <CardTitle
              handleSearch={handleSearch}
              searchValue={searchValue}
              setSearchValue={setSearchValue}
              handleChangeView={handleChangeView}
            />
          )}
          bordered={false}
        >
          <div className={'document-name'}>{templateName}</div>

          <AddForm template={template} handleAddFile={handleAddFile} files={files} />

          <div ref={containRef} className={'forms-contain'}>
            <DirectoryTree
              multiple
              expandedKeys={expandedKeys}
              onSelect={selectItem}
              onExpand={setExpandedKeys}
              selectedKeys={selectedKeys}
            >
              {group(files).map(item => {
                if (!item.sub) {
                  return (
                    <TreeNode
                      title={renderTitle(1, searchValue, handleDelete, item.title, item)}
                      key={item.key}
                      isLeaf
                    />
                  )
                }

                return (
                  <TreeNode
                    title={renderTitle(1, searchValue, handleDelete, item.title)}
                    key={item.key}
                  >
                    {item.sub.map((f) => (
                      <TreeNode
                        title={renderTitle(2, searchValue, handleDelete, f.title, f)}
                        key={f.key}
                        isLeaf
                      />
                    ))}
                  </TreeNode>
                )
              })}
            </DirectoryTree>
          </div>
        </Card>
      </Main>
    </Drawer>
  );
});

export default FormList;
