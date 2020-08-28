import React, { useEffect, useImperativeHandle, forwardRef, useState } from "react";
import T from "prop-types";
import { Form, Select } from "antd";
import { formItemLayout } from "components/constanst";
import { Main } from "./styled";

const InputProps = forwardRef((props, ref) => {
  const {state,fields} = props;
 const [fieldName, setFieldName] = useState('');
  
  
  useEffect(() => {
    if (state.key) {
      setFieldName(state.props.fieldName);
    }
  }, [state]);

  useImperativeHandle(ref, () => ({
    fieldName
  }));

  const changeFieldName = (value) => {
    setFieldName(value)
  };
  return (
    <Main>
      <Form {...formItemLayout}>
        <Form.Item
          label={"Default"}
          className={"props-form-item"}
        >
          <Select showSearch size={"small"} style={{ width: "100%" }} onChange={changeFieldName} value={fieldName}>
            {fields.map(key => (
              <Select.Option key={key} value={key}>
                <div title={key}>
                  {key}
                </div>
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Main>
  );
});


InputProps.propTypes = {
  state: T.shape({}),
};

export default InputProps;

