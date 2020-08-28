import React, { useEffect, useState } from "react";
import Logo from "assets/svg/logo-white.svg";
import { Link } from "react-router-dom";
import { Icon, Dropdown, Menu, Popover } from "antd";
import { useTranslation } from "react-i18next";
import { Main } from "./styled";
import UserInfo from "../UserInfo";
import Notification from "../Notification";
import { connect } from "react-redux";
import useInterval from "hook/useInterval";

const menu = (changeLanguage) => (
  <Menu>
    <Menu.Item onClick={() => changeLanguage("vi")}>{"Tiếng việt"}</Menu.Item>

    <Menu.Item onClick={() => changeLanguage("en")}>{"English"}</Menu.Item>
  </Menu>
);

const ClientHeader = (props) => {
  const { t, i18n } = useTranslation();
  const [state, _setState] = useState({});
  const setState = (data = {}) => {
    _setState((state) => {
      return { ...state, ...data };
    });
  };

  useEffect(() => {
    i18n.changeLanguage("vi");
    props.showInAppNotification();
  }, []);
  useInterval(() => {
    props.showInAppNotification();
  }, 60000);
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  const onShowNotification = (show) => {
    setState({ showNotification: show });
  };

  return (
    <Main>
      <div className={'left-side-header'}>
        <Link to={"/"} className={"logo-link"}>
          <Logo width={110} height={40} />
        </Link>

        <span className={'left-side-header-title'}>{process.env.REACT_APP_TITLE}</span>
      </div>

      <div className="header-icon">
        <div className={"document"}>
          <a target={'_blank'} href={`${window.location.origin}${process.env.REACT_APP_DOCUMENT_LINK}`}>
            <span title={'Tài liệu, hướng dẫn sử dụng'}>
              <Icon type="question-circle" style={{ color: '#fff', fontSize: 16 }} />
            </span>
          </a>
        </div>

        <div className={"app-notification"}>
          <Popover
            content={<Notification show={state.showNotification} />}
            trigger="click"
            onVisibleChange={onShowNotification}
          >
            <div className="notification-contain">
              <Icon type="bell" style={{ fontSize: 18, color: "#fff" }} />
              {props.totalUnread > 0 && (
                <span className="badge">
                  {props.totalUnread > 99 ? "99+" : props.totalUnread}
                </span>
              )}
            </div>
          </Popover>
        </div>
        <div className={"app-language"}>
          <Dropdown
            overlay={menu(changeLanguage)}
            overlayStyle={{ minWidth: 120 }}
            placement={"bottomRight"}
          >
            <div id={"app-language"} className={"language-contain"}>
              <Icon type="global" style={{ fontSize: 18, color: "#fff" }} />
              <span className={"language-title"}>{t("language")}</span>
            </div>
          </Dropdown>
        </div>
        <div className={"use-info-header"}>
          <UserInfo />
        </div>
      </div>
    </Main>
  );
};

export default connect(
  (state) => {
    return {
      totalUnread: state.notification.totalUnread,
    };
  },
  ({ notification: { showInAppNotification } }) => ({
    showInAppNotification,
  })
)(ClientHeader);
