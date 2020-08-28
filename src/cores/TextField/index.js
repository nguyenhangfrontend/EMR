import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';
import T from 'prop-types';
import TextEdit from 'cores/TextEdit';
import ContentEditable from 'components/ContentEditable';
import MultipleLine from 'components/MultipleLine';
import { Main } from './styled';
import { connect } from "react-redux";

const TextField = forwardRef((props, ref) => {
  const {
    mode, component, form, formChange, init,
    focusing, hideLabelDots, other, textTransform, blockWidth
  } = props;
  const labelRef = useRef(null);
  const [width, setWidth] = useState(0);
  const [labelWidth, setLabelWidth] = useState(0);
  const [labelValue, setLabelValue] = useState(0);
  const label = mode === 'config' ? 'label' : '';
  const itemProps = component.props || {};
  
  const getValue = (id) => {
    const elm = document.getElementById(id);
    return elm ? elm.innerHTML : '';
  };
  
  useImperativeHandle(ref, () => ({
    collectLabel: () => getValue(`${component.type}_${component.key}`),
  }));
  
  useEffect(() => {
    if (labelRef.current) {
      setWidth(blockWidth - labelRef.current.node.clientWidth - 6);
      setLabelWidth(labelRef.current.node.clientWidth);
    }
  }, [labelValue, blockWidth]);
  
  useEffect(() => {
    setLabelValue(itemProps.label)
  }, [component]);
  
  const handleFocus = () => {
    if (mode === 'config')  {
      init(component);
    }
  };
  
  const handleOnChange = (value) => {
    if (formChange[itemProps.fieldName]) {
      formChange[itemProps.fieldName](value.htmlValue);
    } else {
      // console.log('formChange: ', formChange[itemProps.fieldName]);
    }
  };
  
  return (
    mode === 'editing' ? (
      <Main onClick={handleFocus}>
        <MultipleLine
          label={!itemProps.noLabel ? itemProps.label : ''}
          onChange={handleOnChange}
          value={form[itemProps.fieldName || '']}
          extentLine={itemProps.line - 1 < 0 ? 0 : itemProps.line - 1}
          disabled={itemProps.disabled}
          width={blockWidth}
          min={itemProps.line}
          size={itemProps.size || 1000}
          border={!!itemProps.border}
        />
      </Main>
    ) : (
      <Main
        onClick={handleFocus}
        focusing={focusing}
        hideLabelDots={hideLabelDots}
        style={{ height: itemProps.line ? itemProps.line * 18 : '' }}
        hadLabel={!!itemProps.label}
      >
        {!itemProps.noLabel && (
          <TextEdit
            id={`${component.type}_${component.key}`}
            className={'text-field-label'}
            defaultValue={itemProps.label || label}
            ref={labelRef}
            mode={mode}
            onChange={setLabelValue}
            textTransform={textTransform}
          />
        )}
  
        <ContentEditable
          labelWidth={labelWidth}
          htmlValue={form[itemProps.fieldName || '']}
          size={itemProps.size || 500}
          width={width}
          onChange={handleOnChange}
          disabled={mode === 'config' || itemProps.disabled}
          type={itemProps.line > 1 ? 'multiple' : 'single'}
          extentLine={itemProps.line - 1 || 0}
          {...other}
        />
      </Main>
    )
  );
});

TextField.defaultProps = {
  mode: 'editing',
  labelText: '',
  form: {},
  formChange: {},
  component: {
    noLabel: false,
  },
  line: {},
  focusComponent: () => {}
};

TextField.propTypes = {
  mode: T.oneOf(['config', 'editing']),
  form: T.shape({}),
  formChange: T.shape({}),
  component: T.shape({}),
  line: T.shape({}),
  labelText: T.string,
  focusComponent: T.func,
};

const mapState = () => ({});

const mapDispatch = ({ component: { init } }) => ({
  init
});

export default connect(mapState, mapDispatch, null, { forwardRef: true })(TextField);
