import React, { useState } from "react";
import { connect } from "react-redux";
import { Main } from "./styled";
import { Card, List, Icon, Empty, Spin, Button } from "antd";
import { useTranslation } from "react-i18next";
import ModalSearch from "../ModalSearch";
const NursingList = ({
  onDeleteNursing,
  nursingSelected,
  isLoadingNursingSelected,
  title,
  showModal,
  visible,
  total,
}) => {
  const { t } = useTranslation();
  const handledeleteNursing = (id) => {
    onDeleteNursing(id);
  };

  return (
    <Main className="main-selected">
      <Card
        title={title}
        bordered={false}
        className={`card-container ${!nursingSelected.length && "empty"}`}
      >
        <p className="item-length">{`${
          total ? nursingSelected.length + " bản ghi" : ""
        }`}</p>
        <Spin spinning={isLoadingNursingSelected}>
          {nursingSelected && nursingSelected.length ? (
            <List
              itemLayout="horizontal"
              dataSource={nursingSelected}
              className="scroll-container"
              renderItem={(item) => (
                <List.Item className={"room-item"}>
                  <List.Item.Meta
                    title={<span>{item.user.fullName}</span>}
                    description={`${t("patientRoom.nursingCode")}: ${
                      item.user.value || ""
                    }, ${t("drugDistributions.department")}: ${
                      item.user.department?.name ?? ""
                    }`}
                  />
                  <div
                    id={`close_icon_${item.id}`}
                    onClick={() => handledeleteNursing(item.id)}
                  >
                    <Icon type="close" />
                  </div>
                </List.Item>
              )}
            />
          ) : (
            <Empty
              description={
                <span id={"empty_no_data"}>
                  {t("drugDistributions.noData")}
                </span>
              }
            />
          )}
        </Spin>
      </Card>
      <ModalSearch visible={visible} showModal={showModal} />
    </Main>
  );
};

const mapState = (state) => ({
  nursingSelected: state.patientRoom.nursingSelected || [],
  isLoadingNursingSelected: state.patientRoom.isLoadingNursingSelected,
});

const mapDispatch = ({ patientRoom: { onDeleteNursing } }) => ({
  onDeleteNursing,
});

export default connect(mapState, mapDispatch)(NursingList);
