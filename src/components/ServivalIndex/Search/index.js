import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Icon, Input, Button } from "antd";
import { Main } from "./styled";
import AddNewIcon from "assets/svg/addNew.svg";
const Search = ({
  getAllCategory,
  handleShowModal
}) => {
  const [inputValue, setInputValue] = useState("");
  useEffect(() => {
    getAllCategory()
  }, [])
  const changeInput = (e) => {
    setInputValue(e.target.value);
  };
  const submit = () => {
    const params = {
      ten: inputValue,
    };
    getAllCategory({...params})
  };

  const handleShow = () => {
    handleShowModal(true)
  }
  return (
    <Main>
      <Input
        onChange={changeInput}
        type="text"
        value={inputValue}
        placeholder="Nhập tên chỉ số sống"
        className="search-input search-item"
        prefix={
          <Icon type="search" style={{ color: "#125872" }} onClick={submit} />
        }
        onPressEnter={submit}
      />
      <Button className="btn-add" onClick={handleShow}><Icon component={AddNewIcon} />Thêm chỉ số sống</Button>
    </Main>
  );
};



const mapDispatch = ({
  vitalSigns: { getAllCategory },
}) => ({
  getAllCategory,
});

export default connect(null, mapDispatch)(Search);
