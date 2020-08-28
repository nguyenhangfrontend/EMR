import { client, patientPath, medicinePath } from "client/request";
import { combineUrlParams } from "utils";
import { PATIENT_MEDICINE, MEDICINELIST } from "client/api";
import { message } from "antd";
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
    onSelectDepartment: ({ departmentId }, state) => {
      dispatch.drugAllocation.updateData({
        departmentId,
        roomId: null,
        rooms: [],
        patients: [],
      });
      let payload = {
        departmentId: departmentId,
      };
      const feature = state.drugAllocation.feature;
      if (feature === "allocation") {
        payload.userId = state.auth.auth?.id;
      }
      dispatch.room.getAllRooms(payload);
      dispatch.drugAllocation.onRefresh();
    },

    onSelectRoom: (roomId) => {
      dispatch.drugAllocation.updateData({
        roomId,
      });
      dispatch.drugAllocation.onRefresh();
    },
    onChangeDate: (date) => {
      dispatch.drugAllocation.updateData({
        date: date,
      });
      dispatch.drugAllocation.onRefresh();
    },
    onRefresh: (payload, state) => {
      let newData = {
        page: 0,
        finished: false,
        patients: [],
        isLoadingPatient: true,
        patient: null,
      };
      dispatch.drugAllocation.updateData(newData);
      dispatch.drugAllocation.onSearch(0);
    },
    onSearch: async (page, state) => {
      const {
        textSearch = "",
        departmentId = "",
        roomId = "",
        date = new Date(),
        size = 1000,
      } = state.drugAllocation;
      if (!departmentId) {
        return;
      }
      let newData = {
        isLoading: true,
        isRefreshing: false,
        isLoadMore: false,
      };
      if (page === 0) newData.isRefreshing = true;
      else newData.isLoadMore = true;
      dispatch.drugAllocation.updateData(newData);
      let userId = state.auth.auth?.id;
      let payload = {
        page: page + "",
        size: size + "",
        timKiem: textSearch,
        ngayYLenh: date.format("yyyy-MM-dd"),
        khoaId: departmentId,
        active: true,
        sort: "maHoSo,desc",
        ...(roomId ? { phongId: roomId } : {}),
      };
      const feature = state.drugAllocation.feature;
      if (feature === "allocation") {
        payload.userId = userId;
        payload.trongVien = true;
      }

      let res = await client.get(
        combineUrlParams(`${patientPath}${PATIENT_MEDICINE}`, payload)
      );
      if (res?.data?.code === 0) {
        let data = state.drugAllocation.patients || [];
        let drugType = state.drugAllocation.drugType || 10;
        let newValues = {
          isLoadingPatient: false,
          isLoadMore: false,
          isRefreshing: false,
          page,
          drugType,
          finished: false,
        };

        if ((res?.data?.data || []).length !== 0) {
          data = [...(page === 0 ? [] : data), ...(res?.data?.data || [])];
          newValues.patients = data;
          dispatch.drugAllocation.updateData(newValues);
          if (page === 0 && !state.drugAllocation.patient) {
            dispatch.drugAllocation.onSelectPatient(data[0]);
          }
        } else {
          newValues.finished = true;
          if (page === 0) {
            newValues.drug10 = [];
            newValues.drug20 = [];
            newValues.patient = null;
          }
          dispatch.drugAllocation.updateData(newValues);
        }
      } else {
        let data = {
          isLoadingPatient: false,
          isLoadMore: false,
          isRefreshing: false,
        };
        dispatch.drugAllocation.updateData(data);
        message.error(res?.data?.message || "Tải dữ liệu không thành công");
      }
    },
    onSelectPatient: (patient, state) => {
      dispatch.drugAllocation.updateData({
        patient,
      });
      dispatch.drugAllocation.onSearchDrug({
        drugType: 20,
      });
    },
    onSearchDrug: async ({ drugType }, state) => {
      const {
        date = new Date(),
        patient = {},
        departmentId,
      } = state.drugAllocation;

      dispatch.drugAllocation.updateData({
        showLoadingDrug: true,
        drugType,
        drug: null,
      });
      let res = await client.get(
        combineUrlParams(`${medicinePath}${MEDICINELIST}`, {
          page: "0",
          patientHistoryId: patient.id,
          loaiThuoc: drugType,
          khoaId: departmentId,
          active: true,
          sort: "tenThuongMai",
        })
      );
      if (res?.data?.code === 0) {
        const feature = state.drugAllocation.feature;
        dispatch.drugAllocation.updateData({
          showLoadingDrug: false,
          ["drug" + drugType]: (res?.data?.data || []).filter((item) => {
            return (
              item.ngayThucHien?.toDateObject().ddmmyyyy() ===
                date?.ddmmyyyy() &&
              item.daPhat &&
              (feature === "distribution" || !item.daCapChoNb)
            );
          }),
        });
      } else {
        dispatch.drugAllocation.updateData({
          showLoadingDrug: false,
        });
        message.error(res?.data?.message || "Tìm kiếm thuốc không thành công");
      }
    },
    onChangeDrugType: (drugType, state) => {
      dispatch.drugAllocation.updateData({
        drugType: drugType,
        showLoadingDrug: true,
      });
      dispatch.drugAllocation.onSearchDrug({ drugType });
    },
    onAllocation: async (payload, state) => {
      let { drugType = 10 } = state.drugAllocation;
      let drugIds = state.drugAllocation["drug" + drugType]
        .filter((item) => !item.daCapChoNb)
        .map((item) => item.id);
      if (!drugIds.length) {
        message.error("Đã phát hết thuốc");
        return;
      }
      dispatch.drugAllocation.updateData({
        showLoadingDrug: true,
      });
      let res = await client.put(`${medicinePath}${MEDICINELIST}`, {
        ids: drugIds,
      });
      if (res?.data?.code === 0) {
        dispatch.drugAllocation.updateData({
          showLoadingDrug: false,
          ["drug" + drugType]: state.drugAllocation["drug" + drugType].map(
            (item) => {
              item.daCapChoNb = true;
              return item;
            }
          ),
        });
        // dispatch.drugAllocation.onSearchDrug({ drugType });
        message.success("Phát thuốc thành công");
      } else {
        dispatch.drugAllocation.updateData({
          showLoadingDrug: true,
        });
        message.error(res?.data?.message || "Phát thuốc không thành công");
      }
    },
    onViewDetailDrug: async (drugId) => {
      dispatch.drugAllocation.updateData({
        showLoadingDrug: true,
      });
      let res = await client.get(
        combineUrlParams(`${medicinePath}${MEDICINELIST}/${drugId}`)
      );
      if (res?.data?.code === 0) {
        dispatch.drugAllocation.updateData({
          drug: res.data.data,
        });
      } else {
        message.error(
          res?.data?.message || "Không thể hiển thị thông tin phát thuốc"
        );
      }
      dispatch.drugAllocation.updateData({
        showLoadingDrug: false,
      });
    },
  }),
};
