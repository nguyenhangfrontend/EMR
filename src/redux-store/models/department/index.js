import { client, masterDataPath } from "client/request";
import { combineUrlParams } from "utils";
import cacheUtils from "utils/cache-utils";
import { DEPARTMENTS, USERS } from "client/api";
export default {
  state: {
    departments: [],
  }, // initial state
  reducers: {
    updateData(state, payload = {}) {
      return { ...state, ...payload };
    },
  },
  effects: (dispatch) => ({
    getAllDepartments: async (payload, state) => {
      let userId = state.auth.auth?.id;
      let departments = await cacheUtils.read(
        userId,
        "DATA_DEPARTMENTS",
        [],
        false
      );
      dispatch.department.updateData({
        departments,
      });
      const getDepartment = () => {
        client
          .get(
            combineUrlParams(`${masterDataPath}${DEPARTMENTS}`, {
              page: "0",
              active: true,
              sort: "name",
            })
          )
          .then((res) => {
            if (res?.data?.code === 0) {
              let departments = (res?.data?.data || []).map((item) => ({
                id: item.id,
                name: item.name,
              }));
              dispatch.department.updateData({
                departments,
              });
              cacheUtils.save(userId, "DATA_DEPARTMENTS", departments, false);
            }
          });
      };
      let auth = state.auth.auth;
      if (auth && auth.id) {
        let res = await client.get(`${masterDataPath}${USERS}/${auth.id}`);
        if (res?.data?.code === 0) {
          let data = res.data.data;
          let roles = data.roles || [];
          let role = roles.find((item) => item.id === 1000000);
          if (role) getDepartment();
          else {
            let departments = data.departments || [];
            departments.sort((a, b) => {
              return a.name.localeCompare(b.name);
            });
            if (data.department) {
              departments = [data.department, ...departments];
              departments = departments.filter((item, index, self) => {
                return (
                  self.findIndex((item2) => item2.id === item.id) === index
                );
              });
            }
            departments = departments.map((item) => ({
              id: item.id,
              name: item.name,
            }));
            dispatch.department.updateData({
              departments,
            });
            cacheUtils.save(userId, "DATA_DEPARTMENTS", departments, false);
          }
        }
      }
    },
  }),
};
