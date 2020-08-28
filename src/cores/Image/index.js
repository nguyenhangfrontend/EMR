import React, { useState, useEffect } from "react";
import T from 'prop-types';
import { Upload } from "antd";
import { connect } from "react-redux";
import { Main } from "./styled";
import defaultPicture from 'assets/img/default-image.jpg';
import { HOST } from "client/request";

const ImageUpload = ({ init, component, mode, focusing, formChange, common, uploadImage  }) => {
  const [file, setFile] = useState("");
  const itemProps = component.props || {};
  const handleFocus = () => {
    if (mode === "config") {
      init(component);
    }
  };
  useEffect(()=> {
    if (formChange && formChange[itemProps.fieldName]) {
      formChange[itemProps.fieldName](common.image);
    } 
  }, [common, itemProps]);
  const imageDefault = `${HOST}/api/html-editor/v1/files/${itemProps.defaultImageUpload}`;
  
  const handleChange = data => {
    const reader = new FileReader();

    reader.onload = function() {
      setFile(reader.result);
    };
    uploadImage(data.file.originFileObj);
    reader.readAsDataURL(data.file.originFileObj);
    
  };
  return (
    <Main onClick={handleFocus} focusing={focusing}>
      <Upload
          disabled={mode === "config"}
          showUploadList={false}
          onChange={handleChange}
        >
            <img
              className={"img-view"}
              src={file || itemProps.defaultImageUpload ?  file || imageDefault :  defaultPicture}
              width={itemProps.width}
              height={itemProps.height}
              alt={"default"}
            />
        </Upload>
    </Main>
  );
};

ImageUpload.defaultProps = {
  component: {
    props: {
      width: 64,
      height: 64
    }
  },
  formChange: {}
};

ImageUpload.propTypes = {
  formChange: T.shape({})
};

const mapState = state => ({
  common: state.common,
  fileDefault: state.common.imagedata
});

const mapDispatch = ({ component: { init }, common: { uploadImage } }) => ({ init, uploadImage });

export default connect(mapState, mapDispatch)(ImageUpload);
