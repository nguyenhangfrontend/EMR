import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import T from 'prop-types';
import { Drawer, Button } from 'antd';
import { EditorState, convertToRaw, convertFromHTML, ContentState } from 'draft-js';
import { Main } from './styled';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

const Descriptions = forwardRef((props, ref) => {
  const { visible, onClose, handleSubmit, state } = props;
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  
  useEffect(() => {
    if (state.props) {
      const contentBlock = convertFromHTML(state.props.description || '');
      const contentState = ContentState.createFromBlockArray(contentBlock);
      const editorState = EditorState.createWithContent(contentState);
      
      setEditorState(editorState);
    }
  }, [state]);
  
  useImperativeHandle(ref, () => ({
    description: draftToHtml(convertToRaw(editorState.getCurrentContent()))
  }));
  
  const handleSave = () => {
    handleSubmit();
  };
  
  const handleUpdateComponent = (currentState) => {
    setEditorState(currentState);
  };
  
  return (
    <Main>
      <Drawer
        title="Component description"
        placement={'right'}
        closable={false}
        onClose={onClose}
        visible={visible}
        width={500}
      >
        <Editor
          editorState={editorState}
          onEditorStateChange={handleUpdateComponent}
          toolbarClassName="toolbarClassName"
          wrapperClassName="wrapperClassName"
          editorClassName="editor_ClassName"
        />
  
        <div style={{ textAlign: 'right', marginTop: 24 }}>
          <Button onClick={onClose} style={{ marginRight: 8 }}>
            Cancel
          </Button>
          <Button onClick={handleSave} type="primary">
            Submit
          </Button>
        </div>
      </Drawer>
    </Main>
  );
});

Descriptions.defaultProps = {
  visible: false,
};

Descriptions.propTypes = {
  visible: T.bool,
  handleSubmit: T.func,
  onClose: T.func,
};

export default Descriptions;
