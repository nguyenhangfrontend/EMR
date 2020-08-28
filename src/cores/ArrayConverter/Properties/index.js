import React, { useEffect, useState, useImperativeHandle, forwardRef } from "react";
import T from "prop-types";
import { Form, Checkbox, InputNumber, Select, Input } from "antd";
import { Main } from "./styled";
import components from "cores";
import { formItemLayout, tailFormItemLayout } from "components/constanst";

const ComponentProps = forwardRef((props, ref) => {
  const { state, fields} = props
  const [fieldName, setFieldName] = useState("");
  const [noLabel, setNolabel] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [size, setSize] = useState("");
  const [border, setBorder] = useState(false);
  const [line, setLine] = useState("");
  const [rule, setRule] = useState("");

  useImperativeHandle(ref, () => ({
    size,
    fieldName,
    noLabel,
    disabled,
    border,
    line,
    rule
  }));

  useEffect(() => {
    if (state.key) {
      setFieldName(state.props.fieldName);
      setSize(state.props.size);
      setNolabel(state.props.noLabel);
      setDisabled(state.props.disabled);
      setBorder(state.props.border);
      setLine(state.props.line);
      setRule(state.props.rule);
    }
  }, [state]);

  const changeFieldName = (value) => {
    setFieldName(value);
  };
  const changeNoLabel = (e) => {
    setNolabel(e.target.checked);
  };
  const changeDisabled = (e) => {
    setDisabled(e.target.checked);
  };
  const changeBorder = (e) => {
    setBorder(e.target.checked);
  };
  const changeSize = (e) => {
    setSize(e);
  };
  const changeLine = (e) => {
    setLine(e);
  };
  const changeRule = (e) => {
    setRule(e.target.value);
  };

  return (
    <Main>
      <Form {...formItemLayout}>
        <Form.Item label={"Component"} className={"props-form-item"}>
          <span>
            {components[state.type] ? components[state.type].name : ""}
          </span>
        </Form.Item>

        <Form.Item label={"Field name"} className={"props-form-item"}>
          <Select
            style={{ width: "100%" }}
            size={"small"}
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
  
        <Form.Item {...tailFormItemLayout} label={'No label'} className={'props-form-item'}>
          
            <Checkbox checked={noLabel} onChange={changeNoLabel}/>
        </Form.Item>

        <Form.Item
          {...tailFormItemLayout}
          label={"Disabled"}
          className={"props-form-item"}
        >
          <Checkbox value={disabled} onChange={changeDisabled} />
        </Form.Item>

        {state.type === "layout" && (
          <Form.Item
            {...tailFormItemLayout}
            label={"Border"}
            className={"props-form-item"}
          ><Checkbox checked={border} onChange={changeBorder} />
          </Form.Item>
        )}

        <Form.Item
          {...tailFormItemLayout}
          label={"Line"}
          className={"props-form-item"}
        >
          <InputNumber size={"small"} value={line} onChange={changeLine} />
        </Form.Item>

        <Form.Item
          {...tailFormItemLayout}
          label={"Size"}
          className={"props-form-item"}
        >
          <InputNumber size={"small"} value ={size} onChange={changeSize}/>
        </Form.Item>

        <Form.Item
          {...tailFormItemLayout}
          label={"Rule"}
          className={"props-form-item"}
        >
          
            <Input
              size={"small"}
              style={{ width: 100 }}
              placeholder="Nhập ký tự phân cách"
              value={rule}
              onChange={changeRule}
            />
          
        </Form.Item>
      </Form>
    </Main>
  );
});

ComponentProps.defaultProps = {
  component: {},
  fields: []
};

ComponentProps.propTypes = {
  component: T.shape({}),
  fields: T.arrayOf(T.string)
};

export default ComponentProps;
