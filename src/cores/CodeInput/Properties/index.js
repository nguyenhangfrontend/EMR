import React, { useEffect, useState, useImperativeHandle, forwardRef } from "react";
import T from "prop-types";
import { Form, Checkbox, InputNumber, Select } from "antd";
import { Main } from "./styled";
import components from "cores";
import { formItemLayout, tailFormItemLayout } from "components/constanst";

const ComponentProps = forwardRef((props, ref) => {
  const {  state, fields } = props;
  const [fieldName, setFieldName] = useState("");
  const [disabled, setDisabled] = useState(false);
  const [border, setBorder] = useState(false);
  const [size, setSize] = useState('');
  useEffect(() => {
    if (state.key) {
      setFieldName(state.props.fieldName);
      setDisabled(state.props.disabled);
      setBorder(state.props.border);
      setSize(state.props.size);
    }
  }, [state]);
  useImperativeHandle(ref, () => ({
    fieldName,
    disabled,
    border,
    size,
  }));
  const changeFieldName = (value) => {
    setFieldName(value);
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
            {fields.map((item) => (
              <Select.Option key={item} value={item}>
                <span title={item}>{item}</span>
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          {...tailFormItemLayout}
          label={"Disabled"}
          className={"props-form-item"}
        >
          <Checkbox checked={disabled} onChange={changeDisabled} />
        </Form.Item>

        {state.type === "layout" && (
          <Form.Item
            {...tailFormItemLayout}
            label={"Border"}
            className={"props-form-item"}
          >
            <Checkbox checked={border} onChange={changeBorder} />
          </Form.Item>
        )}

        <Form.Item
          {...tailFormItemLayout}
          label={"Size"}
          className={"props-form-item"}
        >
         <InputNumber size={"small"} onChange={changeSize} value={size} />
        </Form.Item>
      </Form>
    </Main>
  );
});

ComponentProps.defaultProps = {
  component: {},
};

ComponentProps.propTypes = {
  component: T.shape({}),
};

export default ComponentProps
