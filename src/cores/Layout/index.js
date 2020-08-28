import React, { forwardRef, useImperativeHandle, useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import T from 'prop-types';
import Grid from 'components/Config/Grid';
import { fontSizes } from 'components/EditorTool/Text/constants';
import { Main } from './styled';

const Layout = forwardRef((props, ref) => {
  const {
    component, block, updateContent, mode, files, init,
    config, updateComponents, formId, form, formChange, verticalLine, valuesHIS
  } = props;
  const [localLines, setLocalLines] = useState([]);
  const itemProps = component.props || {};
  const gridRef = useRef(null);
  let components = [];
  let fontSize = 12;

  useEffect(() => {
    setLocalLines(itemProps.lines || []);
  }, [component]);

  useEffect(() => {}, [form]);
  
  useImperativeHandle(ref, () => ({
    collectComponent: () => gridRef.current.collect().components,
    collectLines: () => gridRef.current.collect().lines,
  }));
  
  if (mode === 'config') {
    components = config.components;
    fontSize = config.props.fontSize ? fontSizes[config.props.fontSize] : 12;
  } else {
    const formX = files.list.find(item => item.id === formId);

    if (formX) {
      components = formX.components;
      fontSize = formX.config && formX.config.fontSize ? fontSizes[formX.config.fontSize] : 12;
    }
  }
  
  const addLine = (res) => {
    const defaultLines = component.props.lines || [];
    const lines = [...defaultLines, res];
    updateContent({ ...component, props: { ...component.props, lines } });
  };
  
  const updateLine = (res) => {
    const defaultLines = component.props.lines || [];
    const lines = defaultLines.map(line => line.key === res.key ? res : line);
    updateContent({ ...component, props: { ...component.props, lines } });
  };
  
  const removeLine = (res) => {
    const defaultLines = component.props.lines || [];
    const lines = defaultLines.filter(line => line.key !== res.key);
    updateContent({ ...component, props: { ...component.props, lines } });
  };
  
  const handleFocus = () => {
    if (mode === 'config')  {
      init(component);
    }
  };
  
  return (
    <Main border={itemProps.border || false} mode={mode}>
      <div onClick={handleFocus} className={'mark-focus'} />
      <Grid
        ref={gridRef}
        lines={localLines}
        verticalLine={verticalLine}
        components={components || []}
        mode={mode}
        width={!!itemProps.border ? block.width - 6 : block.width}
        addLine={addLine}
        updateComponents={updateComponents}
        updateLine={updateLine}
        removeLine={removeLine}
        formId={formId}
        values={form}
        valuesHIS={valuesHIS}
        formChange={formChange}
        fontSize={fontSize}
      />
    </Main>
  )
});

Layout.defaultProps = {
  component: {},
  config: {},
  form: {},
  formChange: {},
};

Layout.propTypes = {
  files: T.shape({}),
  config: T.shape({}),
  form: T.shape({}),
  formChange: T.shape({}),
};

const mapState = (state) => ({
  files: state.files,
  config: state.config,
});

const mapDispatch = ({ config: { updateComponents }, component: { init } }) => ({ updateComponents, init });

export default connect(mapState, mapDispatch, null, { forwardRef: true })(Layout);
