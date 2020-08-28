import React, { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import T from 'prop-types';
import renderHtml from 'react-render-html';
import { Button, Row, Col, Radio, Input, Checkbox, Select } from 'antd';
import moment from 'moment';
import { Main } from './styled';

const CheckGroupProps = forwardRef((props, ref) => {
  const { state, fields, updateComponents } = props;
  const [fieldName, setLocalValue] = useState('');
  const [type, setLocalType] = useState('multiple');
  const [direction, setDirection] = useState('ltr');
  const [checkList, setLocalCheckList] = useState([]);
  const [disabled, setLocalDisabled] = useState();
  
  useImperativeHandle(ref, () => ({
    fieldName,
    type,
    direction,
    checkList,
    disabled,
  }));
  
  useEffect(() => {
    if (state.key) {
      setLocalValue(state.props.fieldName);
      setLocalType(state.props.type || 'multiple');
      setLocalCheckList(state.props.checkList);
      setDirection(state.props.direction);
      setLocalDisabled(state.props.disabled);
    }
  }, [state]);
  
  const setFieldName = (output) => {
    setLocalValue(output);
  };
  
  const updateItem = (item) => (e) => {
    const value =  e.target.value;
    const newList = checkList.map(obj => obj.key === item.key ? {
      ...obj,
      value: value
    } : obj);
  
    setLocalCheckList(newList);
  };
  
  const removeItem = (itemKey) => () => {
    const newList = checkList.filter(item => item.key !== itemKey);
    setLocalCheckList(newList);
    updateComponents({
      ...state,
      props: {
        ...state.props,
        checkList: newList,
      }
    })
  };
  
  const addCheckItem = () => {
    const newList = checkList;
    const item = { label: 'test', value: 'text', key: moment().valueOf() };
    const list = [...newList, item];
    
    setLocalCheckList(list);
    updateComponents({
      ...state,
      props: {
        ...state.props,
        checkList: list,
      }
    })
  };
  
  const handleDisable = (e) => {
    setLocalDisabled(e.target.checked)
  };
  
  const handleSetType = (e) => {
    setLocalType(e.target.value);
  };
  
  const handleChangeDirection = (e) => {
    const value = e.currentTarget.value;
    if (value === 'rtl') {
      setDirection('ltr');
      
    } else {
      setDirection('rtl');
    }
  };
  
  return (
    <Main>
      <Row gutter={[12, 12]}>
        <Col span={8}>
          <span>{'Direction: '}</span>
        </Col>
  
        <Col span={16}>
          <Row gutter={[12, 12]}>
            <Col span={8}>
              <Button
                icon={direction === 'ltr' ? 'arrow-right' : 'arrow-left'}
                size={'small'}
                value={direction}
                onClick={handleChangeDirection}
              />
            </Col>
  
            <Col span={16}>
              {direction === 'ltr' ? 'L to R' : 'R to L'}
            </Col>
          </Row>
        </Col>
  
        <Col span={8}>
          <span>{'Type: '}</span>
        </Col>
  
        <Col span={16}>
          <Radio.Group onChange={handleSetType} value={type}>
            <Radio value={'onlyOne'}>{'Only one'}</Radio>
            <Radio value={'multiple'}>{'Multiple'}</Radio>
          </Radio.Group>
        </Col>
        
        <Col span={8}>
          <span>{'Field name: '}</span>
        </Col>
        
        <Col span={16}>
          <Select
            style={{ width: '100%' }}
            size={'small'}
            showSearch
            onSelect={setFieldName}
            value={fieldName}
          >
            {fields.map(item => (
              <Select.Option key={item} value={item}>
                <span title={item}>{item}</span>
              </Select.Option>
            ))}
          </Select>
        </Col>
  
        <Col span={8}>
          <span>{'Disabled: '}</span>
        </Col>
  
        <Col span={16}>
          <Checkbox checked={disabled} onChange={handleDisable} />
        </Col>
      </Row>
    
      {checkList.map(item => (
        <div key={item.key} className={'item-main'}>
          <div className={'item-label'}>{renderHtml(item.label || '')}</div>
        
          <Row gutter={12}>
            <Col span={20}>
              <Input
                value={item.value}
                onChange={updateItem(item)}
                size={'small'}
              />
            </Col>
            
            <Col span={4}>
              <Button icon={'delete'} size={'small'} onClick={removeItem(item.key)} />
            </Col>
          </Row>
        </div>
      ))}
    
      <Button className={'add-btn'} icon={'plus'} size={'small'} onClick={addCheckItem} />
    </Main>
  );
});

CheckGroupProps.defaultProps = {
  state: {},
};

CheckGroupProps.propTypes = {
  state: T.shape({})
};

export default CheckGroupProps;
