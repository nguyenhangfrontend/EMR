import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Main } from "./styled";
import { Button, Modal, Input, Form, Checkbox, Select } from "antd";
import { useTranslation } from "react-i18next";
import T from "prop-types";

const DetailModal = ({
  showModal,
  visible,
  data,
  createEditCategory,
  view,
  setView,
  form,
  departments,
}) => {
  const { getFieldDecorator } = form;
  const [departmentOptions, setDepartmentOption] = useState([]);
  const { t } = useTranslation();
  const handleOk = () => {
    showModal(true);
    setView(false);
  };

  const handleCancel = () => {
    showModal(false);
    setView(false);
    form.resetFields();
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    form.validateFields((err, values) => {
      if (!err) {
        const dataSubmit = {
          dataSubmit: {
            ten: values.name,
            donVi: values.unit,
            giaTriLonNhat: values.maxValue,
            giaTriNhoNhat: values.minValue,
            khoaIds: values.departmentSelected,
            active: values.active,
          },
          id: data.id,
        };
        createEditCategory(dataSubmit);
        handleCancel();
      }
    });
  };

  return (
    <Modal
      visible={visible}
      onOk={handleOk}
      okText={t("drugDistributions.close")}
      cancelText={""}
      onCancel={handleCancel}
      style={{ maxWidth: 420 }}
      footer={[]}
      cancelButtonProps={{ style: { display: "none" } }}
    >
      <Main>
        <div className="title">
          <h4>
            {data.id && !view
              ? "Sửa chỉ số sống"
              : view
              ? "Chi tiết chỉ số sống"
              : "Thêm chỉ số sống"}
          </h4>
        </div>
        <div className="form">
          <Form onSubmit={handleSubmit}>
            {/* <Form.Item label={"Mã chỉ số"} className={"props-form-item"}>
            <Input disabled={view} onChange={changeCode} value={code} />
          </Form.Item> */}

            <Form.Item label={"Tên chỉ số"} className={"props-form-item"}>
              {getFieldDecorator("name", {
                rules: [
                  { required: true, message: "Vui lòng nhập tên chỉ số!" },
                ],
                initialValue: data.ten,
              })(<Input disabled={view} />)}
            </Form.Item>

            <Form.Item label={"Đơn vị"}>
              {getFieldDecorator("unit", {
                rules: [{ required: true, message: "Vui lòng nhập đơn vị!" }],
                initialValue: data.donVi,
              })(<Input disabled={view} />)}
            </Form.Item>

            <Form.Item label={"Giá trị tối đa"}>
              {getFieldDecorator("maxValue", {
                initialValue: data.giaTriLonNhat,
              })(<Input disabled={view} />)}
            </Form.Item>

            <Form.Item label={"Giá trị tối thiểu"}>
              {getFieldDecorator("minValue", {
                initialValue: data.giaTriNhoNhat,
              })(<Input disabled={view} />)}
            </Form.Item>
            <Form.Item label={"Khoa áp dụng"}>
              {getFieldDecorator("departmentSelected", {
                rules: [
                  { required: true, message: "Vui lòng chọn khoa áp dụng!" },
                ],
                initialValue: data.khoaIds,
              })(
                <Select
                  placeholder={"Chọn khoa"}
                  className="search-item"
                  mode="multiple"
                  style={{ width: "100%", minHeight: 40, borderRadius: 50 }}
                  disabled={view}
                >
                  {departments.map((item, index) => {
                    return (
                      <Select.Option
                        key={index}
                        value={item.id}
                        name={item.name}
                      >
                        <div title={item.name}>{item.name}</div>
                      </Select.Option>
                    );
                  })}
                </Select>
              )}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator("active", {
                valuePropName: "checked",
                initialValue: data.active || !data.id  && true,
              })(
                <Checkbox disabled={view}>{t("permission.effective")}</Checkbox>
              )}
            </Form.Item>
            <Form.Item wrapperCol={{ span: 24, offset: 3 }}>
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
              >
                Lưu
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Main>
    </Modal>
  );
};

DetailModal.defaultProps = {
  showModal: () => {},
  visible: false,
  data: {},
};

DetailModal.propTypes = {
  showModal: T.func,
  visible: T.bool,
  data: T.shape({}),
};
const mapState = (state) => ({
  permission: state.permission,
  departments: state.department.departments || [],
});

const mapDispatch = ({
  vitalSigns: { getAllCategory, createEditCategory },
}) => ({
  getAllCategory,
  createEditCategory,
});

const WrappedApp = Form.create({})(DetailModal);
export default connect(mapState, mapDispatch)(WrappedApp);
