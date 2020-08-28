import React from "react";
import { connect } from "react-redux";
import { Main } from "./styled";
import { Menu, Dropdown, Icon, Avatar } from "antd";
import { useTranslation } from "react-i18next";

const UserInfo = (props) => {
  const { t } = useTranslation();

  const onLogout = () => {
    props.onLogout();
  };

  const menu = (
    <Menu>
      <Menu.Item key="0" onClick={onLogout}>
        <Icon type={"logout"} />
        {t("user.logout")}
      </Menu.Item>
    </Menu>
  );

  return (
    <Main>
      <Dropdown
        overlay={menu}
        trigger={["click"]}
        overlayStyle={{ minWidth: 150 }}
      >
        <div className="user-info">
          <Avatar icon="user" size="small" />
          <span className="user-name">{props.auth?.username}</span>
        </div>
      </Dropdown>
    </Main>
  );
};

const mapState = (state) => ({
  auth: state.auth.auth,
});

export default connect(mapState, ({ auth: { onLogout } }) => ({
  onLogout,
}))(UserInfo);
