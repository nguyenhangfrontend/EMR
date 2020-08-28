import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Icon, Input, Button, Select } from "antd";
import { Main } from "./styled";
import AddNewIcon from "assets/svg/addNew.svg";
import { useTranslation } from "react-i18next";
import Create from "../Create";

const Search = ({
  getMedicalRecordScan,
  fetchTemplate,
  documents,
}) => {

  const { t } = useTranslation();
  const [inputValue, setInputValue] = useState("");
  const [formId, setFormId] = useState();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    getMedicalRecordScan();
  }, []);
  const changeInput = (e) => {
    setInputValue(e.target.value);
  };

  const submit = () => {
    const params = {
      patientDocument: inputValue,
      formId: formId,
    };
    fetchTemplate(params.patientDocument);
    getMedicalRecordScan({ ...params });
  };

  const handleShow = (type) => {
    setVisible(type);
  };

  const filterOption = (input, option) => {
    return (
      (option.props.name || "")
        .toLowerCase()
        .createUniqueText()
        .indexOf(input.toLowerCase().createUniqueText()) >= 0
    );
  };
  const selectDocuments = (value) => {
    const params = {
      patientDocument: inputValue,
      formId: value,
    };
    setFormId(value)
    getMedicalRecordScan({ ...params });
  };

  return (
    <Main>
      <div className="item-left">
        <Input.Search 
          onChange={changeInput}
          type="text"
          value={inputValue}
          placeholder="Mã HS"
          className="search-input search-item"
          onPressEnter={submit}
        />
        <Select
          showSearch
          size={"default"}
          placeholder="Chọn biểu mẫu"
          className="search-item"
          filterOption={filterOption}
          onSelect={selectDocuments}
          notFoundContent={
            <span id={"no-data-mess"}>{t("drugDistributions.noData")}</span>
          }
          id={"department"}
          style={{ width: 200 }}
        >
          {documents.template &&
            documents.template.map((item, index) => (
              <Select.Option
                key={index}
                value={item.id}
                id={item.id}
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
      </div>
      <div className="item-right">
        <Button className="btn-add" onClick={handleShow}>
          <Icon component={AddNewIcon} />
          Thêm mới
        </Button>
      </div>
      <Create
        visible={visible}
        showModal={handleShow}
      />
    </Main>
  );
};
const mapState = (state) => ({
  documents: state.documents,
});
const mapDispatch = ({
  scan: { getMedicalRecordScan },
  documents: { fetchTemplate },
}) => ({
  getMedicalRecordScan,
  fetchTemplate,
});

export default connect(mapState, mapDispatch)(Search);
