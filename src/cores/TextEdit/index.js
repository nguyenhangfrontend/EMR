import React, { useRef, forwardRef, useImperativeHandle } from 'react';
import T from 'prop-types';
import renderHTML from 'react-render-html';
import { Main } from './styled';

const TextEdit = forwardRef((props, ref) => {
  const { onChange, defaultValue, className, mode, textTransform, id } = props;
  const mainRef = useRef(null);
  const textNode = useRef(null);
  
  useImperativeHandle(ref, () => ({
    node: mainRef.current,
    textNode: textNode.current,
  }));
  
  const emitChange = () => {
    onChange(textNode.current.innerHTML);
  };
  
  return (
    <Main ref={mainRef} className={className}>
      <div
        id={id}
        className={'edit-contain'}
        contentEditable={mode === 'config'}
        suppressContentEditableWarning={true}
        ref={textNode}
        onInput={emitChange}
        onBlur={emitChange}
        style={{textTransform: textTransform}}
      >
        {renderHTML(defaultValue)}
      </div>
    </Main>
  );
});

TextEdit.defaultProps = {
  className: '',
  defaultValue: '',
  mode: '',
  disabled: false,
  onChange: () => {}
};

TextEdit.propTypes = {
  onChange: T.func,
  disabled: T.bool,
  defaultValue: T.string,
  className: T.string,
  mode: T.string,
};

export default TextEdit;
