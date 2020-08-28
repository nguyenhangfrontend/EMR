import { client, medicinePath, masterDataPath } from "client/request";
import { combineUrlParams } from "utils";
import cacheUtils from "utils/cache-utils";
import { ROOMS_MANAGERS, ROOMS } from "client/api";
export default {
  state: {
    rooms: [],
  }, // initial state
  reducers: {
    updateData(state, payload = {}) {
      return { ...state, ...payload };
    },
  },
  effects: (dispatch) => ({
    getAllRoomsManager: async ({ departmentId, userId }, state) => {
      let rooms = await cacheUtils.read(
        departmentId + "_" + userId,
        "DATA_ROOMS",
        [],
        false
      );
      dispatch.room.updateData({
        rooms,
      });
      let res = await client.get(
        combineUrlParams(`${medicinePath}${ROOMS_MANAGERS}`, {
          page: "0",
          active: true,
          khoaId: departmentId,
          userId: userId,
          sort: "name",
        })
      );
      if (res?.data?.code === 0) {
        rooms = (res?.data?.data || []).map((item) => ({
          id: item.id,
          name: item.name,
        }));
        dispatch.room.updateData({
          rooms,
        });
        cacheUtils.save(
          departmentId + "_" + userId,
          "DATA_ROOMS",
          rooms,
          false
        );
      } else {
        dispatch.room.updateData({
          rooms: [],
        });
      }
    },
    getAllRoomsAdmin: async (payload = {}, state) => {
      let rooms = await cacheUtils.read("", "DATA_ROOMS", [], false);
      dispatch.room.updateData({
        rooms,
      });
      const res = await client.get(
        combineUrlParams(`${masterDataPath}${ROOMS}`, {
          page: "0",
          sort: "name",
          active: true,
          ...payload,
        })
      );
      if (res?.data?.code === 0) {
        let rooms = (res?.data?.data || []).map((item) => ({
          id: item.id,
          name: item.name,
        }));
        dispatch.room.updateData({
          rooms,
        });
        cacheUtils.save("", "DATA_ROOMS", rooms, false);
      } else {
        dispatch.room.updateData({
          rooms: [],
        });
      }
    },
    getAllRooms: async ({ departmentId, userId }, state) => {
      const { authorities = [] } = state.auth.auth || {};
      const roleAdmin = authorities.find((item) => item === "ROLE_IsofhAdmin");
      if (roleAdmin) dispatch.room.getAllRoomsAdmin({ departmentId });
      else {
        dispatch.room.getAllRoomsManager({
          departmentId,
          userId,
        });
      }
    },
  }),
};
