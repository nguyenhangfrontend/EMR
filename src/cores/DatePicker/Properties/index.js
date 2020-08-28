import React, { useEffect, forwardRef, useImperativeHandle, useState } from "react";
import T from "prop-types";
import { Form, Select, Checkbox } from "antd";
import { formItemLayout } from "components/constanst";
import { format } from '../constants';

const DateTimeProps = forwardRef((props, ref) => {
  const {  state, fields } = props;
  
  const [dateTimeFormat, setDateTimeFormat] = useState("");
  const [fieldName, setFieldName] = useState("");
  const [disabled, setDisabled] = useState(false);
  const [onlyDate, setOnlyDate] = useState(false);

  useEffect(()=> {
    if(state.props){
      setDateTimeFormat(state.props.dateTimeFormat);
      setFieldName(state.props.fieldName);
      setDisabled(state.props.disabled);
      setOnlyDate(state.props.onlyDate)
    }
  }, [state]);

  useImperativeHandle(ref, () => ({
    fieldName,
    dateTimeFormat,
    disabled,
    onlyDate,
  }));

  const selectFieldName = (value) => {
    setFieldName(value)
  };

  const selectFormat = (value) => {
    setDateTimeFormat(value)
  };

  const changeDisabled = (e) => {
    setDisabled(e.target.checked)
  };

  const changeOnlyDate = (e) => {
    setOnlyDate(e.target.checked)
  };

  return (
    <Form {...formItemLayout}>
      <Form.Item label={"Field name"} className={"props-form-item"}>
        <Select showSearch size={"small"} style={{ width: "100%" }} value={fieldName} onSelect={selectFieldName}>
          {fields.map(item => (
            <Select.Option key={item} value={item}>
              <div title={item}>
                {item}
              </div>
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item  label={"Format"} className={"props-form-item"}>
        <Select showSearch size={"small"} style={{ width: "100%" }} value={dateTimeFormat} onSelect={selectFormat}>
          {Object.keys(format).map(key => (
            <Select.Option key={key} value={key}>
              {format[key].label}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        label={"Disabled"}
        className={"props-form-item"}
      >
          <Checkbox checked={disabled} onChange={changeDisabled}/>
        </Form.Item>
  
      <Form.Item
        label={"Only date"}
        className={"props-form-item"}
      >
        <Checkbox checked={onlyDate} onChange={changeOnlyDate}/>
      </Form.Item>
    </Form>
  );
});

DateTimeProps.propTypes = {
  state: T.shape({}),
};

export default DateTimeProps
