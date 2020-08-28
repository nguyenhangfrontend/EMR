import React, { useEffect } from "react";
import { connect } from "react-redux";

import { ThemeProvider } from "styled-components";
import { pink } from "themes";
import web from "./web";
import { Main } from "./styled";
import { ConfigProvider } from "antd";
import viVN from "antd/es/locale/vi_VN";

import { Switch, Route } from "react-router-dom";
import { originUrl, accountUrl } from "client/request";
import { messaging } from "components/Notification/init-fcm";
import { vitalSignPrint } from "../pages/constants";
import { useHistory } from "react-router-dom";

Array.prototype.insert = function (index, item) {
  this.splice(index, 0, item);
};

const App = (props) => {
  const history = useHistory();

  useEffect(() => {

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const authCode = urlParams.get("code");
    if (authCode) {
      if (messaging)
        messaging
          .requestPermission()
          .then(async () => {
            let deviceToken = await messaging.getToken();
            onLogin(authCode, deviceToken, originUrl);
          })
          .catch((e) => {
            onLogin(authCode, "", originUrl);
          });
      else onLogin(authCode, "", originUrl);
    } else {
      if (!props.auth || !props.auth.access_token) {
        window.location.href = accountUrl;
      }
    }
  }, []);

  const onLogin = (code, deviceToken, redirectURI) => {
    props.updateData({ auth: null });
    props
      .onLogin({ code, deviceToken, redirectURI })
      .then((s) => {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const state = urlParams.get("state");

        if (history) history.push(`${decodeURIComponent(state)}`);
      })
      .catch((e) => {});
  };
  const logout = connect(null, ({ auth: { updateData } }) => ({ updateData }))(
    (props) => {
      props.updateData({
        auth: null,
      });
      setTimeout(() => {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        window.location.href = urlParams.get("redirect") || "/";
      }, 2000);
      return null;
    }
  );
  return (
    <ThemeProvider theme={pink}>
      <ConfigProvider locale={viVN}>
        <Switch>
          <Route path={"/logout"} component={logout} />
          <Route
            path={"/vital-signs/:patientDocument"}
            component={vitalSignPrint}
          />
          <Main>
            <Route path={"/"} component={web} />
          </Main>
        </Switch>
      </ConfigProvider>
    </ThemeProvider>
  );
};

const mapState = (state) => ({
  auth: state.auth.auth,
});

const mapDispatch = ({ auth: { onLogin, updateData } }) => ({
  onLogin,
  updateData,
});

export default connect(mapState, mapDispatch)(App);
