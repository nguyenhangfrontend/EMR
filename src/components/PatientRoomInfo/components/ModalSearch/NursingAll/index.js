import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Main } from "./styled";
import { List, Input, Card, Spin, Empty } from "antd";
import { useTranslation } from "react-i18next";
import T from "prop-types";
const NursingAll = ({
  getAllNursing,
  onSelectNusing,
  isLoadingNursing,
  searchNurse,
  nurseSearch,
  visible,
}) => {
  const { t } = useTranslation();
  const [inputValue, setInputValue] = useState();
  useEffect(() => {
    setInputValue("");
    searchNurse({ timKiem: "" });
  }, [visible]);

  useEffect(() => {
    if (nurseSearch.length === 1) {
      selectNusing(nurseSearch[0]);
    }
  }, [nurseSearch]);

  const selectNusing = (item) => {
    if (!item.selected) {
      const id = item.id;
      onSelectNusing({ nurseId: id });
    }
  };
  const handleChange = (e) => {
    setInputValue(e.target.value);
  };
  const handleSubmit = () => {
    searchNurse({ timKiem: inputValue });
  };
  return (
    <Main>
      <Card
        className={`card-container ${!nurseSearch.length && "empty"}`}
        title={
          <div className="title-container">
            <span>{"Danh sách điều dưỡng"}</span>
            <div className="search"></div>
          </div>
        }
        bordered={false}
        className="card-container"
      >
        <div className="search-inner">
          <p className="items-length">
            {nurseSearch.length ? nurseSearch.length : 0} bản ghi
          </p>
          <Input
            value={inputValue}
            placeholder="Nhập tên, mã nhân viên"
            onChange={handleChange}
            onPressEnter={handleSubmit}
          />
        </div>

        <Spin spinning={isLoadingNursing}>
          {nurseSearch.length ? (
            <List
              itemLayout="horizontal"
              dataSource={nurseSearch}
              className="scroll-container"
              renderItem={(item) => (
                <List.Item
                  className={`room-item ${item.selected ? "disabled" : ""}`}
                  onClick={() => selectNusing(item)}
                >
                  <List.Item.Meta
                    title={<span>{item.fullName}</span>}
                    description={`${t("patientRoom.nursingCode")}: ${
                      item.value && item.value
                    }, ${t("drugDistributions.department")}: ${
                      item.department && item.department.name
                    }`}
                  />
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
    </Main>
  );
};

const mapState = (state) => ({
  nurses: state.patientRoom.nurses,
  nursesAll: state.patientRoom.nursesAll,
  nurseSearch: state.patientRoom.nurseSearch || [],
  isLoadingNursing: state.patientRoom.isLoadingNursing,
  nursingSelected: state.patientRoom.nursingSelected,
});

const mapDispatch = ({
  patientRoom: {
    getAllNursing,
    onSelectNusing,
    getListNurseByDepartment,
    searchNurse,
  },
}) => ({
  getAllNursing,
  onSelectNusing,
  getListNurseByDepartment,
  searchNurse,
});

export default connect(mapState, mapDispatch)(NursingAll);
