import React, { useEffect, useState, useImperativeHandle, forwardRef, } from 'react';
import { Form, Checkbox } from 'antd';
import { formItemLayout, tailFormItemLayout } from 'components/constanst';
import { Main } from './styled';

const LayoutProps = forwardRef((props, ref) => {
  const { state} = props
  const [border, setBorder] = useState(false);
  useImperativeHandle(ref, () => ({
    border
  }));
  useEffect(() => {
    setBorder(state.props.border)
  }, [state]);
  
  
  const handleChangeBorder = (e) => {
    const checked = e.target.checked;
    setBorder(checked);
  };
  
  return (
    <Main>
      <Form {...formItemLayout}>
        <Form.Item {...tailFormItemLayout} label={'Border'} className={'props-form-item'}>
          <Checkbox onChange={handleChangeBorder} checked={border} />
        </Form.Item>
      </Form>
    </Main>
  )
});

export default LayoutProps;
