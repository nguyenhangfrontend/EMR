import React, { useEffect } from "react";
import { Avatar, Icon, Button, Tooltip, Popover } from "antd";
import { Main } from "./styled";
import Patient from "components/Patient";
import { Link } from "react-router-dom";

const CollapsedLayout = ({ appCurrent, info, localApps }) => {
  useEffect(() => {
    console.log('app current: ', appCurrent);
  }, [appCurrent]);

  return (
    <Main>
      <div className={"layout-item"}>
        <Tooltip placement="topLeft" title={"Danh sách NB"}>
          <Link to={"/app/patient-list"}>
            <Button style={{ width: '100%' }} className="btn-list item-action" icon={'unordered-list'} />
          </Link>
        </Tooltip>
        <Popover
          content={
            <div style={{ width: 300 }}>
              <Patient />{" "}
            </div>
          }
          trigger="hover"
          placement={"left"}
          className="item-action"
        >
          <Avatar shape={"square"} size={50} icon={"user"} />
        </Popover>
      </div>

      <div className={"layout-item"}>
        {localApps.map((item) => (
          <Tooltip key={item.name} title={item.name} placement={"left"}>
            <Link to={`${item.link}/${info?.maHoSo}`}>
              <Button
                type={appCurrent === item.name ? "primary" : "default"}
                className={"layout-app-item"}
              >
                <Icon component={item.icon} className={"app-select-icon"} />
              </Button>
            </Link>
          </Tooltip>
        ))}
      </div>
    </Main>
  );
};

export default CollapsedLayout;
