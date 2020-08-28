import React, {useEffect, useState} from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Card, Empty, Row, Col, Spin, Avatar, Divider ,Icon} from "antd";
import { Main } from "./styled";
import avatarImage from "assets/img/avatar.png";
import WebcamModal from '../webcamModal'

const Patient = ({ patient, fetPatient,uploadAvatar }) => {
  const {
    phong, khoa, maHoSo, gioiTinh,ngaySinh, chanDoan, tuoi, tenNb, giuong,
    maBenhAn, diaChi, bacSyDieuTri, id, avatar
  } = patient.info;

  const [visible, setVisible] = useState(false);
  const [avatarLocal, setAvatar] = useState(null);

useEffect(()=> {
  const url = `${process.env.REACT_APP_HOST}/api/patient/v1/files/${ avatar}`;
  setAvatar(url)
  setVisible(false)
}, [avatar])
  useEffect(() => {
    if (patient.patientDocument) {
      fetPatient({ timKiem: patient.patientDocument });
    }
  }, [patient.patientDocument]);

  const showModal = (type) => {
    setVisible(type)
  };
 

  const uploadImage = (fileUpload)=> {
    uploadAvatar({fileUpload, id})
  };

  return (
    <Main>
      <Card
        size={"small"}
        title={"Thông tin NB"}
        bordered={false}
        extra={<Link to={`/app/patient-list/${patient.patientDocument || ''}`}>Danh sách</Link>}
      >
         <Spin spinning={patient.loading}>
            <div className={"patient-information"}>
              {id ? (
                <React.Fragment>
                  <Row gutter={[12, 6]}>
                    <Col span={8}>
                      <span className="avatar-main">
                        <Avatar src={avatarLocal ? avatarLocal:avatarImage} icon={'user'} size={64} shape={'square'} alt="" />
                        <Icon type={'camera'} onClick={() => showModal(true)}/>
                      </span>
                    </Col>

                    <Col span={16}>
                      <div className={"info-item name"}>{tenNb}</div>
                      <div className={"info-item"}>
                        {`(${gioiTinh}, ${new Date(ngaySinh).getFullYear()},  ${tuoi} tuổi)`}
                      </div>
                      <div className={"info-item"}>Mã HS: {maHoSo}</div>
                    </Col>
                  </Row>

                  <Divider />

                  <Row gutter={[12, 6]}>
                    <Col span={8}>
                      <span className="info-label">{"Mã BA: "}</span>
                    </Col>
                    <Col span={16}>
                      <span className="info-text">{maBenhAn || '- - -'}</span>
                    </Col>
                    <Col span={8}>
                      <span className="info-label">{"Địa chỉ: "}</span>
                    </Col>
                    <Col span={16}>
                      <span className="info-text">{diaChi}</span>
                    </Col>
                    <Col span={8}>
                      <span className="info-label">{"Khoa: "}</span>
                    </Col>
                    <Col span={16}>
                      <div className="info-text">
                        <span>{khoa}</span>
                        <p>
                          <span className="color-red">
                            {phong ? `${phong} -` : null}
                            {giuong ? `${giuong}` : null}
                          </span>
                        </p>
                      </div>
                    </Col>
                    <Col span={8}>
                      <span className="info-label">{"Chẩn đoán:"}</span>
                    </Col>
                    <Col span={16}>
                      <span className="info-text">{chanDoan || '- - -'}</span>
                    </Col>
                    <Col span={8}>
                      <span className="info-label">{"BS điều trị:"}</span>
                    </Col>
                    <Col span={16}>
                      <span className="info-text">{bacSyDieuTri || '- - -'}</span>
                    </Col>
                  </Row>
                </React.Fragment>
              ) : (
                <Empty />
              )}
            </div>
         </Spin>
      </Card>
      <WebcamModal showModalUpload={showModal} visible={visible} upload={uploadImage} image={avatarLocal} title={"Upload avatar"}/>
    </Main>
  );
};

const mapState = (state) => ({
  patient: state.patient,
});

const mapDispatch = ({ patient: { fetPatient , uploadAvatar}}) => ({ fetPatient, uploadAvatar });

export default connect(mapState, mapDispatch)(Patient);
