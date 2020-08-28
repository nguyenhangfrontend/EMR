import React, { useEffect, useState, useImperativeHandle, forwardRef } from "react";
import T from "prop-types";
import { Form, Checkbox, InputNumber, Select } from "antd";
import { Main } from "./styled";
import { formItemLayout, tailFormItemLayout } from "components/constanst";

const ComponentProps = forwardRef(( props, ref) => {
  const { state, fields } = props;
  const [fieldName, setFieldName] = useState("");
  const [noLabel, setNolabel] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [size, setSize] = useState("");
  const [border, setBorder] = useState(false);
  const [line, setLine] = useState("");

  useImperativeHandle(ref, () => ({
    size,
    fieldName,
    noLabel,
    disabled,
    border,
    line,
  }));

  useEffect(() => {
    if (state.key) {
      setFieldName(state.props.fieldName);
      setSize(state.props.size);
      setNolabel(state.props.noLabel);
      setDisabled(state.props.disabled);
      setBorder(state.props.border);
      setLine(state.props.line);
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
  return (
    <Main>
      <Form {...formItemLayout}>
        <Form.Item label={"Field name"} className={"props-form-item"}>
          <Select
            style={{ width: "100%" }}
            size={"small"}
            showSearch
            onSelect={changeFieldName}
            value={fieldName}
          >
            {fields.map((item) => (
              <Select.Option key={item} value={item}>
                <span title={item}>{item}</span>
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          {...tailFormItemLayout}
          label={"No label"}
          className={"props-form-item"}
        >
          <Checkbox checked={noLabel} onChange={changeNoLabel} />
        </Form.Item>

        <Form.Item
          {...tailFormItemLayout}
          label={"Disabled"}
          className={"props-form-item"}
        >
          <Checkbox onChange={changeDisabled} checked={disabled} />
        </Form.Item>

        <Form.Item
          {...tailFormItemLayout}
          label={"Border"}
          className={"props-form-item"}
        >
          <Checkbox onChange={changeBorder} checked={border} />
        </Form.Item>

        <Form.Item
          {...tailFormItemLayout}
          label={"Line"}
          className={"props-form-item"}
        >
          <InputNumber value={line} onChange={changeLine} size={"small"} />
        </Form.Item>

        <Form.Item
          {...tailFormItemLayout}
          label={"Size"}
          className={"props-form-item"}
        >
          <InputNumber size={"small"} value={size} onChange={changeSize} />
        </Form.Item>
      </Form>
    </Main>
  );
});

ComponentProps.defaultProps = {
  component: {},
  fields: [],
};

ComponentProps.propTypes = {
  component: T.shape({}),
  fields: T.arrayOf(T.string),
};

export default ComponentProps
