import React, { useEffect, useState } from "react";
import T from 'prop-types';
import { Main } from "./styled";
import { connect } from "react-redux";

const Input = ({ init, component, mode, focusing, form, formChange }) => {
  const [localValue, setValue] = useState('');
  const itemProps = component.props || {};
  
  
  useEffect(() => {
    form && setValue(form[itemProps.fieldName]);
  }, [component, form]);
  
  const handleFocus = () => {
    if (mode === "config") {
      init(component);
    }
  };
  
  const handleOnChange = (e) => {
    formChange[itemProps.fieldName](e.target.value);
  };
  
  return (
    <Main onClick={handleFocus} focusing={focusing}>
      <input
        defaultValue={localValue}
        type="text"
        className={'input-component'}
        onChange={handleOnChange}
        maxLength={2}
      />
    </Main>
  );
};

Input.defaultProps = {
  component: {
    props: {}
  }
};

Input.propTypes = {
  component: T.shape({})
};

const mapState = state => ({
  common: state.common,
  fileDefault: state.common.imagedata
});

const mapDispatch = ({ component: { init } }) => ({ init });

export default connect(mapState, mapDispatch)(Input);
