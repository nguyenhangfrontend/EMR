import React, { useEffect, useState, useRef } from "react";
import { connect } from "react-redux";
import { Icon, Select, Input, Row, Col } from "antd";
import { Main } from "./styled";
import { unsignText } from "components/utils";
import { useTranslation } from "react-i18next";
import ScanIcon from "assets/svg/scan.svg";
import ScanQrCode from "components/ScanQrCode";

const SearchPatients = ({
  fetPatients,
  getAllDepartments,
  common,
  rooms,
  getAllRoomsAdmin,
  departments,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [departmentId, setDepartment] = useState();
  const [roomId, setRoom] = useState();
  const { t } = useTranslation();
  const refQRCodeScaner = useRef(null);

  useEffect(() => {
    fetPatients();
    getAllDepartments();
  }, []);

  const changeInput = (e) => {
    setInputValue(e.target.value);
  };
  const submit = (e, value) => {
    const params = {
      timKiem: value || inputValue,
      khoaId: departmentId,
      phongId: roomId,
    };
    fetPatients({ ...params });
  };
  const selectDepartment = (value) => {
    setDepartment(value);
    const params = {
      timKiem: inputValue,
      khoaId: value,
      phongId: roomId,
    };
    getAllRoomsAdmin({departmentId: value})
    fetPatients({ ...params });
  };
  const selectRoom = (value) => {
    const params = {
      timKiem: inputValue,
      khoaId: departmentId,
      phongId: value,
    };
    setRoom(value);
    fetPatients({ ...params });
  };

  const filterOption = (input, option) => {
    return (
      option.props.name &&
      unsignText(option.props.name)
        .toLowerCase()
        .indexOf(unsignText(input.toLowerCase())) >= 0
    );
  };
  const onScanQRcode = () => {
    if (refQRCodeScaner.current) {
      refQRCodeScaner.current.show((data) => {
        setInputValue(data);
        submit(null, data);
      });
    }
  };

  return (
    <Main>
      <Row>
        <Col span={8}>
          <Input
            onChange={changeInput}
            type="text"
            value={inputValue}
            placeholder="Nhập tên, mã HS hoặc mã BA"
            className="search-input search-item"
            prefix={
              <Icon
                type="search"
                style={{ color: "#125872" }}
                onClick={submit}
              />
            }
            suffix={
              <Icon
                style={{ fontSize: 22 }}
                onClick={onScanQRcode}
                className={"scan-suffix"}
                component={ScanIcon}
              />
            }
            onPressEnter={submit}
          />
        </Col>

        <Col span={16}>
          <Row gutter={12}>
            <Col span={12} offset={6}>
              <Select
                showSearch
                value={departmentId}
                onSelect={selectDepartment}
                placeholder={t("drugDistributions.selectDepartmant")}
                className="search-item"
                filterOption={filterOption}
                notFoundContent={t("drugDistributions.noData")}
              >
                {departments.map((item) => (
                  <Select.Option key={item} value={item.id} name={item.name}>
                    <div className={"select-search-item"} title={item.name}>
                      {item.name}
                    </div>
                  </Select.Option>
                ))}
              </Select>
            </Col>

            <Col span={6}>
              <Select
                showSearch
                value={roomId || undefined}
                onSelect={selectRoom}
                placeholder={t("drugDistributions.selectRoom")}
                className="search-item"
                filterOption={filterOption}
                notFoundContent={t("drugDistributions.noData")}
                width={280}
              >
                <Select.Option value="">{"- Chọn tất cả -"}</Select.Option>
                {rooms.map((item) => (
                  <Select.Option key={item} value={item.id} name={item.name}>
                    <div className={"select-search-item"} title={item.name}>
                      {item.name}
                    </div>
                  </Select.Option>
                ))}
              </Select>
            </Col>
          </Row>
        </Col>
      </Row>

      <ScanQrCode ref={refQRCodeScaner} />
    </Main>
  );
};
const mapState = (state) => ({
  patienList: state.common.patients,
  common: state.common,
  auth: state.auth.auth,
  patient: state.patient,
  patientHistory: state.patient.patientHistory,
  departments: state.department.departments || [],
  rooms: state.room.rooms
});

const mapDispatch = ({
  patient: { fetPatients },
  department: { getAllDepartments },
  room: {getAllRoomsAdmin}
}) => ({
  fetPatients,
  getAllDepartments,
  getAllRoomsAdmin
});

export default connect(mapState, mapDispatch)(SearchPatients);
