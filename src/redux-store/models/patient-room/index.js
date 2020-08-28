import { client, masterDataPath, medicinePath } from "client/request";
import { USERS, SELECTNURSE } from "client/api";
import { combineUrlParams } from "utils";
import { message } from "antd";
import cacheUtils from "utils/cache-utils";
export default {
  state: {
    nurses: [],
    isLoadingNursingSelected: false,
    isLoadingNursing: false,
  }, // initial state
  reducers: {
    updateData(state, payload = {}) {
      return { ...state, ...payload };
    },
  },
  effects: (dispatch) => ({
    async getAllNursing(payload, state) {
      let nursesAll = await cacheUtils.read("", "DATA_NURSING", [], false);
      dispatch.patientRoom.updateData({
        nursesAll: nursesAll || [],
        isLoadingNursing: true,
      });
      const res = await client.get(
        combineUrlParams(`${masterDataPath}${USERS}`, {
          page: "0",
          size: 9999,
          active: true,
          nurse: true,
          ...payload,
        })
      );
      if (res?.data?.code === 0) {
        nursesAll = (res?.data?.data || []).map((item) => ({
          id: item.id,
          fullName: item.fullName,
          value: item.value,
          department: {
            id: item.department?.id,
            name: item.department?.name,
          },
          departmentId: item.departmentId,
        }));
        cacheUtils.save("", "DATA_NURSING", nursesAll, false);

        dispatch.patientRoom.updateData({
          isLoadingNursing: false,
          nursesAll,
        });
      } else {
        dispatch.patientRoom.updateData({
          isLoadingNursing: false,
          nursesAll: nursesAll || [],
        });
      }
      let departmentId = state.patientRoom.departmentId;
      dispatch.patientRoom.getListNurseByDepartment({ departmentId });
    },
    onSelectDepartment: ({ departmentId }, state) => {
      dispatch.patientRoom.updateData({
        departmentId,
        nursingSelected: [],
        roomId: null,
      });
      dispatch.room.getAllRoomsAdmin({ departmentId });
      dispatch.patientRoom.getListNurseByDepartment({ departmentId });
    },
    onSelectRoom: ({ roomId }, state) => {
      if (state.patientRoom.roomId !== roomId) {
        dispatch.patientRoom.updateData({
          roomId,
          nursingSelected: [],
        });
        dispatch.patientRoom.getNursingSelected({ phongId: roomId });
      }
    },
    onSelectNusing: async ({ nurseId }, state) => {
      dispatch.patientRoom.updateData({
        nurseId,
      });
      const res = await client.post(`${medicinePath}${SELECTNURSE}`, {
        userId: nurseId,
        phongId: state.patientRoom.roomId,
      });
      if (res?.data?.code === 0) {
        let roomId = state.patientRoom.roomId;
        let nurseSearch = (state.patientRoom.nurseSearch || []).filter(
          (item) => item?.id != nurseId
        ); //cap nhat lại list search
        dispatch.patientRoom.updateData({
          nurseSearch: [...nurseSearch],
        });
        dispatch.patientRoom.getNursingSelected({ phongId: roomId });
        message.success(`${res?.data?.message || "Lưu thành công"}`);
      } else {
        message.error(`${res?.data?.message}`);
      }
    },
    getNursingSelected: async (payload, rootState) => {
      dispatch.patientRoom.updateData({ isLoadingNursingSelected: true });
      const res = await client.get(
        combineUrlParams(`${medicinePath}${SELECTNURSE}`, {
          page: "0",
          ...payload,
          sort: "createdAt,desc",
        })
      );
      if (res?.data?.code === 0) {
        dispatch.patientRoom.updateData({
          isLoadingNursingSelected: false,
          nursingSelected: res?.data?.data || [],
        });
      } else {
        dispatch.patientRoom.updateData({
          isLoadingNursingSelected: false,
          nursingSelected: res?.data?.data || [],
        });
      }
    },

    getListNurseByDepartment: ({ departmentId }, state) => {
      let nursesAll = state.patientRoom.nursesAll || [];
      //sort danh sách điều dưỡng sắp xếp tăng có khoa đang chọn lên đầu sort alphabet fullName
      let listAll = nursesAll.sort((a, b) => {
        if (a.departmentId === departmentId) {
          if (b.departmentId !== departmentId) return -1;
          else {
            return (a.fullName || "").createUniqueText() >
              (b.fullName || "").createUniqueText()
              ? 1
              : -1;
          }
        } else {
          if (b.departmentId === departmentId) {
            return 1;
          } else {
            return (a.fullName || "").createUniqueText() >
              (b.fullName || "").createUniqueText()
              ? 1
              : -1;
          }
        }
      });
      dispatch.patientRoom.updateData({
        nurses: [...listAll],
      });
    },
    searchNurse: ({ timKiem = "" }, state) => {
      let nursingSelected = (state.patientRoom.nursingSelected || [])
        .map((item) => item?.user?.value)
        .filter((item) => item);
      let text = timKiem.toLowerCase().createUniqueText();
      let nurseSearch = (state.patientRoom.nurses || []).filter((item) => {
        let fullName = item?.fullName || "";
        let userName = item?.value || "";
        if (
          nursingSelected.find((y) => {
            return y == userName;
          })
        )
          return false;
        if (!text) return true;
        if (
          fullName.toLowerCase().createUniqueText().indexOf(text) != -1 ||
          userName.toLowerCase().createUniqueText().indexOf(text) != -1
        ) {
          return true;
        }
      });
      console.log(state.patientRoom.nurses, nurseSearch);
      dispatch.patientRoom.updateData({
        nurseSearch: [...nurseSearch],
      });
    },
    async onDeleteNursing(payload, state) {
      let roomId = state.patientRoom.roomId;
      await client.delete(`${medicinePath}${SELECTNURSE}/${payload}`);
      dispatch.patientRoom.getNursingSelected({ phongId: roomId });
    },
  }),
};
