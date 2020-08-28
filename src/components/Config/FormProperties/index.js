import React, {} from 'react';
import { connect } from 'react-redux';
import { Card, Form, Input, Row, Col, Button, Spin, message, Select, Upload } from 'antd';
import { fontSizes } from 'components/EditorTool/Text/constants';
import { Main } from './styled';

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};


const FormProperties = ({ form, config, fillForm, pasteLayout, control, updateFormProps }) => {
  const { props } = config;
  
  const handleCopyLayout = () => {
    const obj = {
      components: config.components,
      lines: config.lines,
    };
  
    message.success('Layout has copy!');
    fillForm(obj);
  };
  
  const handlePasteLayout = () => {
    pasteLayout(control.form);
  };
  
  const handleExportData = () => {
    const formData = {
      props,
      components: config.components,
      lines: config.lines,
    };
  
    const str = JSON.stringify(formData);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(str);
    let a = document.createElement('a');
    a.href = dataUri;
    a.download = `${props.name}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a)
  };
  
  const handleOnchangeUpload = ({ file }) => {
    const reader = new FileReader();
    
    if (file.status === 'uploading') {
      reader.onload = (function() {
        return function(e) {
          const formData = JSON.parse(e.target.result);
          const obj = {
            components: formData.components,
            lines: formData.lines,
          };
          pasteLayout(obj);
          updateFormProps(formData.props);
        };
      })(file);
  
      reader.readAsText(file.originFileObj);
    }
  };
  
  return (
    <Main>
      <Spin spinning={config.loading} size={'small'}>
        <Card
          size={'small'}
          title={props.name}
          bordered={false}
          extra={<a href={`/preview/${config.id}`} target={'_blank'}>{'Preview'}</a>}
        >
          <Form {...formItemLayout}>
            <Form.Item label={'Code'} className={'props-form-item'}>
              {form.getFieldDecorator('value', {
                initialValue: props.value,
              })(
                <Input size={'small'} />
              )}
            </Form.Item>
      
            <Form.Item label={'Name'} className={'props-form-item'}>
              {form.getFieldDecorator('name', {
                initialValue: props.name,
              })(
                <Input size={'small'} />
              )}
            </Form.Item>
      
            <Form.Item label={'API'} className={'props-form-item'}>
              {form.getFieldDecorator('api', {
                initialValue: props.api,
              })(
                <Input size={'small'} />
              )}
            </Form.Item>
            
            <Form.Item label={'Font size'} className={'props-form-item'}>
              {form.getFieldDecorator('fontSize', {
                initialValue: props.fontSize,
              })(
                <Select
                  size={'small'}
                  style={{ width: '100%' }}
                  placeholder={'font-size'}
                >
                  {Object.keys(fontSizes).map(item => (
                    <Select.Option key={item} value={item}>{fontSizes[item]}{' pt'}</Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          </Form>
          
          <Row gutter={[12, 24]}>
            <Col span={8}>
              <Button size={'small'} icon={'download'} block type={'primary'} onClick={handleExportData}>
                {'Export'}
              </Button>
            </Col>
  
            <Col span={8}>
              <Upload
                showUploadList={false}
                onChange={handleOnchangeUpload}
                accept={'.json'}
                className={'custom-style'}
              >
                <Button size={'small'} icon={'upload'} block>
                  {'Import'}
                </Button>
              </Upload>
            </Col>
          </Row>
    
          <Row gutter={[12, 12]}>
            <Col span={12}>
              <Button
                icon={'snippets'}
                block
                type={'dashed'}
                disabled={control.form.components.length < 1 && control.form.lines.length < 1}
                onClick={handlePasteLayout}
              >
                {'Paste layout'}
              </Button>
            </Col>
            
            <Col span={12}>
              <Button icon={'copy'} block type={'dashed'} onClick={handleCopyLayout}>{'Copy layout'}</Button>
            </Col>
          </Row>
        </Card>
      </Spin>
    </Main>
  )
};

const mapState = state => ({
  config: state.config,
  control: state.control,
});

const mapDispatch = ({
  config: { updateFormProps, pasteLayout },
  control: { fillForm }
}) => ({ updateFormProps, fillForm, pasteLayout });

export default connect(mapState, mapDispatch)(Form.create({
  onValuesChange: (props, changedValues) => {
    const { updateFormProps, config } = props;
    
    const obj = {
      ...config.props,
      name: changedValues.name ? changedValues.name : config.props.name,
      value: changedValues.value ? changedValues.value : config.props.value,
      api: changedValues.api ? changedValues.api : config.props.api,
      fontSize: changedValues.fontSize ? changedValues.fontSize : config.props.fontSize,
    };
  
    updateFormProps(obj);
  },
})(FormProperties));
