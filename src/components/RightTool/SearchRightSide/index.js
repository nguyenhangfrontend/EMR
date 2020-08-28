import React, {  useState, useRef } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Main } from "./styled";
import { Icon, Button, Input, Tooltip } from "antd";
import ScanIcon from "assets/svg/scan.svg";
import ListIcon from "assets/svg/list.svg";
import ScanQrCode from "components/ScanQrCode";
import { useHistory } from "react-router-dom";

const Heading = (props) => {
  const history = useHistory();
  const refQRCodeScaner = useRef(null);
  const [inputValue, setInputValue] = useState("");

  const submit = () => {
    props.fetPatients({ timKiem: inputValue });
  };

  const changeInput = (e) => {
    setInputValue(e.target.value);
  };
  const onScanQRcode = () => {
    if (refQRCodeScaner.current) {
      refQRCodeScaner.current.show((data) => {
        history.push("/app/vital-signs/" + data);
      });
    }
  };

  return (
    <Main>
      <div className="search-container">
        <Input
          prefix={
            <Icon type="search" style={{ color: "#125872" }} onClick={submit} />
          }
          suffix={
            <Tooltip placement="topLeft" title={"Scan"}>
              <Icon
                onClick={onScanQRcode}
                className={"scan-suffix"}
                component={ScanIcon}
              />
            </Tooltip>

          }
          className="input-search"
          onChange={changeInput}
          onPressEnter={submit}
          placeholder="Nhập mã HS, mã BA"
        />
      </div>
      <ScanQrCode ref={refQRCodeScaner} />
    </Main>
  );
};

const mapDispatch = ({ patient: { fetPatients } }) => ({
  fetPatients,
});

export default connect(null, mapDispatch)(Heading);
