import React, { useState, useEffect, useImperativeHandle, forwardRef } from "react";
import { Form, InputNumber, Select, Upload, Button, Icon } from "antd";
import { formItemLayout, tailFormItemLayout } from "components/constanst";
import { Main } from "./styled";
import { connect } from "react-redux";
const ImageProps = (props,ref) => {
  const {
    state,
    uploadImage,
    common,
    fields
  } = props
  const [defaultImageUpload, setLocalImage] = useState("");
  const [fieldName, setFieldName] = useState("");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [nameImage, setNameImage] = useState("");
  useEffect(() => {
    if(state.key){
      setLocalImage(common.image);
    }
  }, [common.image]);
 
  useEffect(()=> {
    if(state.props){
      setWidth(state.props.width)
      setHeight(state.props.height)
      setFieldName(state.props.fieldName)
      setLocalImage(state.props.defaultImageUpload)
    }
  }, [state])

  useImperativeHandle(ref, () => ({
    fieldName,
    defaultImageUpload,
    width,
    height
  }));

  const handleChangeImage = info => {
    setNameImage(info.file.name)
    uploadImage(info.file.originFileObj);
  };
  const changeFieldName = value => {
    setFieldName(value);
  };
  const changeWidth = e => {
    setWidth(e);
  };
  const changeHeight = e => {
    setHeight(e);
  };

  return (
    <Main>
      <Form {...formItemLayout}>
        <Form.Item
          label={"Field name"}
          className={"props-form-item"}
        >
         
            <Select showSearch size={"small"} style={{ width: "100%" }} value={fieldName} onSelect={changeFieldName}>
              {fields.map(key => (
                <Select.Option key={key} value={key}>
                  {key}
                </Select.Option>
              ))}
            </Select>
          
        </Form.Item>
        
        <Form.Item
          {...tailFormItemLayout}
          label={"Default"}
          className={"props-form-item"}
        >
          <Upload onChange={handleChangeImage} showUploadList={false}>
            <Button size={'small'}>
              <Icon type="upload" /> Upload
            </Button>
          </Upload>
            <span className={'name-image'}>{nameImage || defaultImageUpload}</span>
        </Form.Item>

        <Form.Item
          {...tailFormItemLayout}
          label={"Width"}
          className={"props-form-item"}
        >
          <InputNumber size={"small"} value={width} onChange={changeWidth} />
        </Form.Item>

        <Form.Item
          {...tailFormItemLayout}
          label={"Height"}
          className={"props-form-item"}
        >
          <InputNumber size={"small"} value={height} onChange={changeHeight}/>
        </Form.Item>
      </Form>
    </Main>
  );
};

const mapState = state => ({
  common: state.common
});
const mapDispatch = ({ common: { uploadImage } }) => ({
  uploadImage
});

export default connect(mapState, mapDispatch, null, { forwardRef: true })(forwardRef(ImageProps));


// export default connect(mapState, mapDispatch)(ImageProps);
