import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Main } from "./styled";
import { Empty,Spin } from "antd";
import { isEmpty } from "lodash";
import  moment from 'moment'
import {
  Button, Modal, Input, Form, Row, Col, Select, Upload, Icon,
} from "antd";
import { useTranslation } from "react-i18next";
import T from "prop-types";

const CreateModal = ({
  showModal,
  visible,
  fetPatients,
  documents,
  fetchTemplate,
  patientInfo,
  loadingInpatients,
  uploadScan,
  select
}) => {
  const { dataDocument } = documents
  const { t } = useTranslation();
  const [inputValue, setInputValue] = useState("");
  const [nameImage, setNameImage] = useState("");
  const [file, setFile] = useState();
  const [formValue, setFormValue] = useState('');
  const handleOk = () => {
    showModal(true);
  };

  const handleCancel = () => {
    showModal(false);
    select({})
    setNameImage('')
    setFile(undefined);
    setInputValue('')
  };

  const submitSearch = () => {
    if(inputValue.length){
      fetchTemplate(inputValue);
      fetPatients({ timKiem: inputValue });
    }
    
    
  };

  const handleChangeImage = info => {
    setNameImage(info.file.name)
    setFile(info.file.originFileObj);
  };
  const changeForm = (value) => {
    setFormValue(value)
  }
  const changeInput = (e) => {
    setInputValue(e.target.value);
  };
  const removeFile = () => {
    setNameImage('')
    setFile(undefined);
  }
  const create = () => {
    const params = {
      patientDocument: patientInfo.maHoSo,
      formValue: formValue,
      recordId:  dataDocument && dataDocument.id,
      
    }
      uploadScan({...params, file  });
  }

  return (
    <Modal
      visible={visible}
      onOk={handleOk}
      okText={t("drugDistributions.close")}
      cancelText={""}
      onCancel={handleCancel}
      style={{ minWidth: 600 }}
      footer={[
        <div style={{ textAlign: "center", padding: "5px" }}>
          <Button
            type="danger"
            className="btn-create"
            onClick={handleCancel}
            size="large"
          >
            Đóng
          </Button>
          <Button
            type="primary"
            className="btn-create"
            htmlType="submit"
            size="large"
            onClick={create}
          >
            Lưu
          </Button>
        </div>,
      ]}
      cancelButtonProps={{ style: { display: "none" } }}
    >
      <Main>
        <div className="title">
          <h4>Thêm biểu mẫu</h4>
        </div>
        <div className="main-popup">
          <div className="header">
            <div className="search">
              <Input.Search
                onChange={changeInput}
                type="text"
                value={inputValue}
                placeholder="Mã HS"
                className="search-input search-item"
                onPressEnter={submitSearch}
                type={"number"}
              />
            </div>
            <Spin spinning={loadingInpatients}>
              {!isEmpty(patientInfo) ? (
                <React.Fragment>
                  <div className="patient-info">
                    <Row>
                      <Col span={12}>
                        <div className="info-item">
                          <span className="label-info">Mã HS: </span>
                          <span className="info-content patient-doccument">
                            {patientInfo.maHoSo}
                          </span>
                        </div>
                        <div className="info-item">
                          <span className="label-info">Họ và tên: </span>
                          <span className="info-content patient-name">
                          {patientInfo.tenNb}
                          </span>
                        </div>
                        <div className="info-item">
                          <span className="label-info">Ngày sinh: </span>
                          <span className="info-content">{moment(patientInfo.ngaySinh).format(
                                "hh:mm - DD/MM/YYYY"
                              )}</span>
                        </div>
                      </Col>
                      <Col span={12}>
                        <div className="info-item">
                          <span className="label-info">Giới tính: </span>
                          <span className="info-content">{patientInfo.gioiTinh}</span>
                        </div>
                        <div className="info-item">
                          <span className="label-info">Địa chỉ: </span>
                          <span className="info-content">{patientInfo.diaChi}</span>
                        </div>
                      </Col>
                    </Row>
                  </div>
                  <div className="select-file">
                    <p className="label-info">Chọn biểu mẫu: </p>
                    <Select
                      showSearch
                      size={"default"}
                      placeholder="Chọn biểu mẫu"
                      className="search-item"
                      notFoundContent={
                        <span id={"no-data-mess"}>
                          {t("drugDistributions.noData")}
                        </span>
                      }
                      onChange={changeForm}
                      id={"department"}
                      style={{ width: 200 }}
                    >
                      { dataDocument && dataDocument.dsBieuMau &&
                        dataDocument.dsBieuMau.map((item, index) => (
                          <Select.Option
                            key={index}
                            value={item.bieuMau.ma}
                            
                            name={item.bieuMau.ten}
                          >
                            <div
                              style={{
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                              title={item.bieuMau.ten}
                            >
                              {item.bieuMau.ten}
                            </div>
                          </Select.Option>
                        ))}
                    </Select>
                    <div className="upload">
                      <Upload
                        onChange={handleChangeImage}
                        name="file"
                        showUploadList={false}
                      >
                        <Button>
                          <Icon type="upload" /> Upload
                        </Button>
                      </Upload>
                      {nameImage && 
                      <div className="file-info"><span className="file-name">{nameImage}</span> <Icon type="delete" className="remove" onClick={removeFile}/></div>
                      }
                      
                    </div>
                  </div>
                </React.Fragment>
              ) : (
                <Empty description={t("drugDistributions.noData")} />
              )}
            </Spin>
          </div>
        </div>
      </Main>
    </Modal>
  );
};

CreateModal.defaultProps = {
  showModal: () => {},
  visible: false,
  data: {},
};

CreateModal.propTypes = {
  showModal: T.func,
  visible: T.bool,
  data: T.shape({}),
};
const mapState = (state) => ({
  documents: state.documents,
  patientInfo: state.patient.info,
  loadingInpatients: state.patient.loadingInpatients
});
const mapDispatch = ({
  patient: { fetPatients,  select},
  documents: { fetchTemplate },
  scan: { uploadScan}
}) => ({
  fetPatients,
  fetchTemplate,
  uploadScan,
  select
});

const WrappedApp = Form.create({})(CreateModal);
export default connect(mapState, mapDispatch)(WrappedApp);
