import { HOST, client, medicinePath } from "client/request";
import { SSO_LOGIN } from "client/api";
import { message } from "antd";

export default {
  state: {},
  reducers: {
    updateData(state, payload = {}) {
      return { ...state, ...payload };
    },
  },
  effects: (dispatch) => ({
    onLogin: ({ code, deviceToken, redirectURI }) => {
      dispatch.auth.updateData({
        auth: null,
      });
      return new Promise((resolve, reject) => {
        let data = {
          code,
          deviceToken,
          redirectURI,
        };
        client
          .post(`${medicinePath}${SSO_LOGIN}`, data)
          .then((s) => {
            if (s?.data?.code === 0 && s?.data?.data) {
              dispatch.auth.updateData({
                auth: s?.data?.data,
              });
              resolve(s?.data?.data);
              dispatch.department.getAllDepartments();
              dispatch.patientRoom.getAllNursing();
            } else {
              message.error(s?.data?.message || "Đăng nhập không thành công");
              reject(s);
            }
          })
          .catch((e) => {
            message.error(e?.message || "Đăng nhập không thành công");
            reject(e);
          });
      });
    },
    onLogout: () => {
      dispatch.auth.updateData({
        auth: null,
      });
      setTimeout(() => {
        let redirect = `${HOST}auth/logout?redirect_uri=${window.location.origin}`;
        console.log(redirect);
        window.location.href = redirect;
      }, 500);
    },
  }),
  persist: {
    whitelist: ["auth"],
    blacklist: [],
  },
};
