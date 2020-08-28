import React, { memo, useEffect, useState } from "react";
import { connect } from "react-redux";
import T from "prop-types";
import { Button, Modal, Upload , Icon} from "antd";
import { Main } from "./styled";
import Camera from "react-html5-camera-photo";
import "react-html5-camera-photo/build/css/index.css";
import { useTranslation } from "react-i18next";

const WebcamModal = ({ image, visible, upload, showModalUpload, title }) => {
  const { t } = useTranslation();

  const [urlPreview, setUrlPreview] = useState("");

  const [fileUpload, setFileUpload] = useState("");
  const [fileName, setFileName] = useState("");
  useEffect(()=> {
    setUrlPreview(image)
  }, [image])
  //Usage example:
  const dataURLtoFile = (dataurl, filename) => {
    if (dataurl) {
      var arr = dataurl.split(","),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new File([u8arr], filename, { type: mime });
    }
  };

  const handleOk = () => {
    showModalUpload(true);
  };

  const handleCancel = () => {
    setFileName("");
    setFileUpload("");
    setUrlPreview(image);
    showModalUpload(false);
    
  };

  const selectImage = (data, isCapture) => {
    let file = "";
    let fileUpload = "";
    let urlPreview = "";
    let fileName = "";
    if (isCapture) {
      const base64regex = /^data:image\/(?:gif|png|jpeg|bmp|webp)(?:;charset=utf-8)?;base64,(?:[A-Za-z0-9]|[+/])+={0,2}/g;
      const isbase64 = base64regex.test(data);
      if (isbase64) {
        let dataUri = data || data.onTakePhoto.dataUri;
        const imageSrc = dataUri;

        file = dataURLtoFile(imageSrc, "image.jpg");
        urlPreview = imageSrc;
        fileUpload = file;
        fileName = "";
      }
    } else {
      fileUpload = data.file.originFileObj;
      fileName = data.file.name;
      urlPreview = URL.createObjectURL(data.file.originFileObj);
    }
    setFileName(fileName);
    setFileUpload(fileUpload);
    setUrlPreview(urlPreview);
  };

  const uploadImage = () => {
    upload(fileUpload);
  };

  const reTakePhoto = () => {
    setFileName("");
    setFileUpload("");
    setUrlPreview("");
  };
  return (
    <Modal
      visible={visible}
      onOk={handleOk}
      okText={t("drugDistributions.close")}
      title={title}
      onCancel={handleCancel}
      style={{ minWidth: 768, height: 'calc(100vh - 100px)' }}
      footer={[
        <div style={{ display: 'flex', padding: "5px", justifyContent: 'space-between' }} >
          <div className={"selectImage"}>
            <Upload onChange={selectImage} showUploadList={false}>
              <Button size={"small"} style={{height: 35}}>
                <Icon type="upload" /> Chọn ảnh
              </Button>
            </Upload>
            <span className={"name-image"} style={{marginLeft: 12}}>
              {fileName}
            </span>
          </div>
          <div className="action">
            <Button
              type="danger"
              className="btn-create"
              onClick={reTakePhoto}
              size="large"
            >
              Chụp lại
            </Button>
            <Button
              type="primary"
              className="btn-create"
              htmlType="submit"
              size="large"
              onClick={uploadImage}
            >
              Upload
            </Button>
          </div>
        </div>,
      ]}
      cancelButtonProps={{ style: { display: "none" } }}
    >
      
        <Main className="video-screen">
          <Camera
            onTakePhoto={(dataUri) => {
              selectImage(dataUri, true);
            }}
            isImageMirror={true}
          />
          {urlPreview ? (
            <div
              className="image-preview"
            >
              <img src={urlPreview}/>
            </div>
            
          ) : null}
        </Main>

        <div />
      
    </Modal>
  );
};
WebcamModal.defaultProps = {
  showModal: () => {},
  visible: false,
  data: {},
};

WebcamModal.propTypes = {
  showModal: T.func,
  visible: T.bool,
  data: T.shape({}),
};
export default WebcamModal;
