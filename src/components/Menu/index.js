import React from "react";
import { connect } from 'react-redux';
import { Menu, Icon } from "antd";
import { useTranslation } from "react-i18next";
import { Main } from "./styled";
import { Link } from "react-router-dom";
import { get } from 'lodash';
import { menu, checkRole } from './constant';

const AppMenu = ({ auth }) => {
  const { t } = useTranslation();
  const { SubMenu } = Menu;

  const roles = get(auth, 'auth.authorities', []);

  return (
    <Main>
      <Menu
        theme="dark"
        mode="inline"
        style={{ lineHeight: "60px", backgroundColor: "#094359" }}
        defaultSelectedKeys={window.location.pathname}
        defaultOpenKeys={['group-distribution']}
      >
        {Object.keys(menu).map(key => {
          const item = menu[key];
          if (!item.group) {
            return checkRole(item.accessRoles, roles) ? (
              <Menu.Item key={item.link}>
                <Link to={item.link}>
                  {item.icon ? <Icon component={item.icon} /> : <Icon type={item.iconType}  />}
                  <span>{t(item.name)}</span>
                </Link>
              </Menu.Item>
            ) : null
          } else {
            return (
              <SubMenu
                key={key}
                title={(
                  <span>
                    {item.icon ? <Icon component={item.icon} /> : <Icon type={item.iconType}  />}
                    <span>{t(item.name)}</span>
                  </span>
                )}
              >
                {Object.keys(item).map(keyLv2 => {
                  const child = item[keyLv2];

                  if (typeof child.link === 'string') {

                    return checkRole(child.accessRoles, roles) ? (
                      <Menu.Item key={child.link}>
                        <Link to={child.link}>
                          <span>{t(child.name)}</span>
                        </Link>
                      </Menu.Item>
                    ) : null
                  }

                  return null;
                })}
              </SubMenu>
            );
          }
        })}
      </Menu>
    </Main>
  );
};

const mapState = (state) => ({
  auth: state.auth
});

export default connect(mapState)(AppMenu);
