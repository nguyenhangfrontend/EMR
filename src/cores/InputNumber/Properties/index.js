import React, { useEffect, useState, useImperativeHandle, forwardRef } from "react";
import { Form, Select, Checkbox, InputNumber } from "antd";
import { Main } from "../styled";
import { sizeInput } from "mokup";
import { formItemLayout, tailFormItemLayout } from "components/constanst";

const InputNumberProps = forwardRef(( props, ref) => {
  const { state, fields} =props
  const [fieldName, setFieldName] = useState('');
  const [size, setSize] = useState('');
  const [disabled, setDisabled] = useState(false);
  const [quantity, setQuantity] = useState('');
  
  useEffect(() => {
    if (state.key) {
      setFieldName(state.props.fieldName);
      setSize(state.props.size);
      setDisabled(state.props.disabled);
      setQuantity(state.props.quantity);
    }
  }, [state]);
  useImperativeHandle(ref, () => ({
    fieldName,
    size,
    disabled,
    quantity

  }))
  const changeFieldName = (value) => {
   
    setFieldName(value);
  };
  const changeSize = (value) => {
   
    setSize(value);
  };
  const changeQuantity = (value) => {
   
    setQuantity(value);
  };
  const changeDisabled = (e) => {
   
    setDisabled(e.target.checked);
  };

  return (
    <Main>
      <Form {...formItemLayout}>
        <Form.Item label={"Field name"} className={"props-form-item"}>
          <Select
            style={{ width: '100%' }}
            size={'small'}
            showSearch
            onSelect={changeFieldName}
            value={fieldName}
          >
            {fields.map(item => (
              <Select.Option key={item} value={item}>
                <span title={item}>{item}</span>
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        
        <Form.Item label={"size"} className={"props-form-item"}>
         
            <Select
              showSearch
              size={"small"}
              style={{ width: "100%" }}
              value={size}
              onSelect={changeSize}
            >
              {sizeInput.map((item, index) => (
                <Select.Option key={index} value={item.value}>
                  {item.label}
                </Select.Option>
              ))}
            </Select>
          
        </Form.Item>
        
        <Form.Item
          {...tailFormItemLayout}
          label={"Quantity"}
          className={"props-form-item"}
        >
          <InputNumber type="number" size={"small"} min={1} value={quantity} onChange={changeQuantity}/>
        </Form.Item>
        
        <Form.Item
          {...tailFormItemLayout}
          label={"Disabled"}
          className={"props-form-item"}
        >
          <Checkbox checked={disabled} onChange={changeDisabled} />
        </Form.Item>
      </Form>
    </Main>
  );
});

export default InputNumberProps
