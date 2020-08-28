import React from "react";
import { connect } from "react-redux";
import { Main } from "./styled";
import { Button, Modal} from "antd";
import { useTranslation } from "react-i18next";
import T from "prop-types";

const Delete = ({
  isDelete,
  setOpenDelete,
  id,
  deleteCategory
}) => {
  const {t} = useTranslation()
  const handleCancel = () => {
    setOpenDelete(false)
  }
  const handleOk = () => {
    console.log(id)
    setOpenDelete(false)
    deleteCategory(id)
  }
  return (
    <Modal
      visible={isDelete}
      onOk={handleOk}
      okText={t("drugDistributions.close")}
      cancelText={""}
      onCancel={handleCancel}
      style={{ maxWidth: 420 }}
      footer={[
        <div style={{ textAlign: "center", padding: "5px" }}>
          <Button
            style={{
              minWidth: 130,
              backgroundColor: "#FE5955",
              textAlign: "center",
              color: "#fff",
              border: "none",
              height: "40px",
            }}
            onClick={handleCancel}
          >
            {"Không"}
          </Button>
          <Button
            style={{
              minWidth: 130,
              backgroundColor: "#20D0CE",
              textAlign: "center",
              color: "#fff",
              border: "none",
              height: "40px",
            }}
            onClick={handleOk}
          >
            {"Có"}
          </Button>
        </div>,
      ]}
      cancelButtonProps={{ style: { display: "none" } }}
    >
      <Main>
        <div className="title">
          <h4>{"Bạn có chắc chắn muốn xóa chỉ số sống này ?"}</h4>
        </div>
      </Main>
    </Modal>
  );
};

Delete.defaultProps = {
  showModal: () => {},
  deleteCategory: () => {},
};

Delete.propTypes = {
  showModal: T.func,
  deleteCategory: T.func,
  isDelete: T.bool,
};


const mapDispatch = ({
  vitalSigns: {deleteCategory },
}) => ({
  deleteCategory
});
export default connect(null, mapDispatch)(Delete);
