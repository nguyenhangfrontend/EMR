import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { connect } from 'react-redux';
import T from 'prop-types';
import { Button, Popover } from 'antd';
import { Main } from './styled';
import Actions from './Actions';
import ModalCustom from './modalCustom';
import { isEmpty } from "lodash";
import { composeRender } from './constants';

const Table = forwardRef((props, ref) => {
  const {
    component, updateContent, mode, config, init, updateComponents,
    files, formId, form, formChange, verticalLine, valuesHIS, template
  } = props;
  const refArray = useRef([]);
  const [colSelected, setColSelected] = useState([]);
  const [onFocus, setOnFocus] = useState(false);
  const [type, setType] = useState();
  const [defaultData, setDefaultData] = useState({});
  const [localComponents, setLocalComponents] = useState([]);
  const itemProps = component.props || {};
  const refContainer = useRef(null);
  
  const collectComponent = () => {
    let list = [];

    itemProps.rows.forEach((row, index) => (
      itemProps.cols.forEach((col, idx)=> {
        const obj = refArray.current[`block_${index}_${idx}`] ? refArray.current[`block_${index}_${idx}`].collect() : {};
        const cList = obj.components || [];
        
        list = [...list, ...cList, obj.component];
      })
    ));

    return list.filter(item => !!item);
  };

  const collectDefault = () => {
    return defaultData;
  };
  
  useImperativeHandle(ref, () => ({
    collectComponent: () => collectComponent(),
    collectDefault: () => collectDefault(),
  }));

  useEffect(() => {
    setDefaultData(itemProps.defaultData || {});
  }, [itemProps]);
  
  useEffect(() => {
    if (mode === 'config') {
      setLocalComponents(config.components);
    } else {
      const formX = files.list.find(item => item.id === formId);
      if (formX) {
        setLocalComponents(formX.components);
      }
    }
  }, [config.components]);
  
  useEffect(() => {
    const type = config.type;
    setType(type);
  }, []);
  
  const handleUpdateColBox = (res) => {
    updateContent({
      ...component,
      ...res,
    })
  };

  const handleFocus = () => {
    if (mode === 'config') {
      init(component);
      setOnFocus(true);
    }
  };

  const handleOnChange = (value) => {
    if (formChange[itemProps.fieldName]) {
      formChange[itemProps.fieldName](value);
    }
  };

  const handleSelectCol = (key) => {
    const newList = [...colSelected, key];
    setColSelected(newList);
  };

  const handleDeselect = (key) => {
    const newList = colSelected.filter(item => item !== key);
    setColSelected(newList);
  };


  const handleColClick = (key) => () => {
    if (colSelected.includes(key)) {
      handleDeselect(key);
    } else {
      handleSelectCol(key);
    }
  };


  return (
    <div ref={refContainer}>
      {type === 'Table' &&
        <ModalCustom component={component} forwardedRef={refContainer}/>
      }

      {!isEmpty(itemProps.rows) && !isEmpty(itemProps.cols) &&
        <Main mode={mode}>
          <div className={'table-bar'} onClick={handleFocus} />
          <div className={'table-tool'}>
            {onFocus && (
              <Popover
                content={
                  <Actions
                    colSelected={colSelected}
                    rows={itemProps.rows}
                    cols={itemProps.cols}
                    itemProps={itemProps}
                    handleUpdateColBox={handleUpdateColBox}
                  />
                }
                title="Title"
                trigger="click"
              >
                <Button icon={'setting'} size={'small'} />
              </Popover>
            )}
          </div>
          {composeRender(itemProps.type, {
            ...itemProps,
            component,
            localComponents,
            components: localComponents,
            mode,
            formId,
            form,
            formChange,
            verticalLine,
            dataSource: form[itemProps.fieldName] || [],
            onChange: handleOnChange,
            handleColClick,
            refArray,
            colSelected,
            valuesHIS,
            updateContent,
            updateComponents,
            setDefaultData,
            template,
          })}
        </Main>
      }

    </div>

  );
});

Table.defaultProps = {
  component: {},
  files: {},
  form: {}
};

Table.propTypes = {
  component: T.shape({}),
  form: T.shape({}),
};

const mapState = (state) => ({
  files: state.files,
  config: state.config,
});

const mapDispatch = ({ config: { updateComponents }, component: { init } }) => ({ updateComponents, init });

export default connect(mapState, mapDispatch, null, { forwardRef: true })(Table);
