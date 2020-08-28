import React, {
  useImperativeHandle,
  forwardRef,
  useState,
  useEffect,
} from "react";
import T from "prop-types";
import { Form, Select } from "antd";
import { Main } from "../styled";
import components from "cores";
import { formItemLayout } from "components/constanst";

const BarcodeProps = forwardRef(( props, ref) => {
  const { state, fields } = props;
  const [fieldName, setFieldName] = useState("");

  useEffect(() => {
    if (state.props) {
      setFieldName(state.props.fieldName);
    }
  },[state]);

  useImperativeHandle(ref, () =>({
    fieldName
  }));

  const selectFieldName = (value) => {
    setFieldName(value);
  };
  return (
    <Main>
      <Form {...formItemLayout}>
        <Form.Item label={'Component'} className={'props-form-item'}>
          <span>{components[state.type] ? components[state.type].name : ''}</span>
        </Form.Item>
        <Form.Item label={'Field name'} className={'props-form-item'}>
          
            <Select
              showSearch
              size={'small'}
              style={{ width: '100%' }}
              onSelect={selectFieldName}
              value={fieldName}
            >
              {fields.map(key => (
                <Select.Option key={key} value={key}>{key}</Select.Option>
              ))}
            </Select>
          
        </Form.Item>

        
      </Form>
    </Main>
  )
});

BarcodeProps.propTypes = {
  config: T.shape({}),
};

export default BarcodeProps
