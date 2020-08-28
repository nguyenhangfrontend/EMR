import React, { useEffect } from "react";
import { connect } from "react-redux";
import { Main } from "./styled";
import { Button, Modal, Tooltip, Table, Checkbox, Col, Row } from "antd";
import { useTranslation } from "react-i18next";
import NursingAll from "./NursingAll";
import NursingSelected from "../NursingList";
import T from "prop-types";
const ModalSearch = ({ showModal, visible }) => {
  const { t } = useTranslation();

  const handleOk = () => {
    showModal(false);
  };

  const handleCancel = () => {
    showModal(false);
  };
  console.log(visible);
  return (
    <Modal
      visible={visible}
      onOk={handleOk}
      okText={t("drugDistributions.close")}
      cancelText={""}
      onCancel={handleCancel}
      style={{ minWidth: 992 }}
      footer={[]}
      cancelButtonProps={{ style: { display: "none" } }}
    >
      <Main>
        <div className="title">
          <h4>Chỉ định điều dưỡng</h4>
        </div>
        <div className="nursing-container">
          <Row gutter={[12, 12]}>
            <Col span={12}>
              <NursingAll visible={visible} />
            </Col>
            <Col span={12}>
              <NursingSelected
                title={t("patientRoom.nursingIncharge")}
                total={true}
              />
            </Col>
          </Row>
        </div>
      </Main>
    </Modal>
  );
};

ModalSearch.defaultProps = {
  showModal: () => {},
  visible: false,
};

ModalSearch.propTypes = {
  showModal: T.func,
  visible: T.bool,
};

export default ModalSearch;
