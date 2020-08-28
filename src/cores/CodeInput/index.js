import React, { useEffect, useState, useRef } from 'react';
import T from 'prop-types';
import ReactCodeInput from 'react-codes-input';
import moment from 'moment';
import 'react-codes-input/lib/react-codes-input.min.css';
import { Main } from './styled';
import { connect } from "react-redux";

const CodeInput = (props) => {
  const { component, mode, init, form, formChange } = props;
  const [code, setCode] = useState('');
  const itemProps = component.props || {};
  
  const thisRef = useRef();

  const handleFocus = () => {
    if (mode === 'config')  {
      init(component);
    }
  };
  
  useEffect(() => {
    if (formChange[itemProps.fieldName]) {
      formChange[itemProps.fieldName](code);
    }
  }, [code]);
  
  useEffect(() => {
    let fieldValue;
    const field = form &&  form[itemProps.fieldName];
    const isvalidDate = field && typeof field === 'number' ? true : moment();
    if(field && !isvalidDate){
      fieldValue = moment(field).format('DD-MM-YYYY');
    }else {
      fieldValue = form &&  form[itemProps.fieldName];
      fieldValue = fieldValue && fieldValue.toString()
    }
    
    // eslint-disable-next-line no-useless-escape
    const fieldConvert =  fieldValue &&  (typeof fieldValue === 'string' )? fieldValue.replace(/[- _&\/\\#,+()$~%.'":*?<>{}^;]/g, ''):'';

    setCode(fieldConvert);
    thisRef.current = formChange[itemProps.fieldName];
  }, [form, formChange]);
  
  const handleChange = (value) => {
    setCode(value);
  };
  
  const handleFormSubmit = (e) => {
    e.preventDefault();
  };
  
  return (
    <Main onClick={handleFocus}>
      <form onSubmit={handleFormSubmit}>
        <ReactCodeInput
          value={code}
          disabled={itemProps.disabled || mode === 'config'}
          type="alphanumeric"
          id={itemProps.fieldName || moment().valueOf()}
          codeLength={itemProps.size || 2}
          letterCase="upper"
          onChange={handleChange}
          autoFocus={false}
        />
      </form>
    </Main>
  )
};

CodeInput.defaultProps = {
  formChange: {},
  form: {},
  component: {
    size: 2,
    disabled: false,
    props: {
      fieldName: '',
    }
  }
};

CodeInput.propTypes = {
  formChange: T.shape({}),
  form: T.shape({}),
  component: T.shape({})
};

const mapState = () => ({});

const mapDispatch = ({ component: { init } }) => ({
  init
});

export default connect(mapState, mapDispatch)(CodeInput);
